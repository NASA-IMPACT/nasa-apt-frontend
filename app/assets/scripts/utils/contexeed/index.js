import { useMemo, useCallback } from 'react';

import { withReducerLogs } from './with-reducer-log';
import { makeReducer } from './make-reducer';
import { makeActions } from './make-actions';
import { makeRequestThunk } from './make-request-thunk';
import { useReducerWithThunk } from './use-reducer-thunk';
import { axiosAPI } from '../axios';
import { getStateSlice } from './utils';
import { withReducerInterceptor } from './with-reducer-interceptor';

// status: 'idle' | 'loading' | 'succeeded' | 'failed'
const baseContexeedState = {
  status: 'idle',
  mutationStatus: 'idle',
  receivedAt: null,
  error: null,
  data: null
};

// Power to the developer: The several hooks accept the `deps` which get passed
// from the parent. This triggers warning with eslint but it is accounted for.

export function useContexeedApi(config, deps = []) {
  const { name, useKey, interceptor, requests = {}, mutations = {} } = config;

  // Memoize values
  const { initialState, reducer, actions } = useMemo(() => {
    // If there's a key the overall state needs to start empty. Id keys will be
    // added at a later stage resulting in something like:
    // {
    //   key1: baseContexeedState,
    //   key2: baseContexeedState,
    //   ...
    // }
    const initialState = useKey ? {} : baseContexeedState;

    const reducer = withReducerLogs(
      withReducerInterceptor(
        makeReducer({
          name,
          // When creating the reducer we need the initial state, to be able to
          // use the invalidate function.
          initialState,
          // The base state is used as the source for missing properties. We start
          // from the base state and replace what's needed. In this way we ensure
          // state consistency.
          baseState: baseContexeedState
        }),
        interceptor
      )
    );

    // Create the actions needed by the thunk (request and receive), and the
    // invalidate action to clean the state.
    const actions = makeActions({ name, useKey });

    return {
      initialState,
      reducer,
      actions
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [...deps]);

  // useReducerWithThunk is the same as React's useReducer but with support for
  // dispatching functions.
  const [state, dispatch] = useReducerWithThunk(reducer, initialState);

  // Create the dispatchable request actions from the functions defined in the
  // configuration.
  const requestActions = useMemo(
    () =>
      Object.keys(requests).reduce((acc, fnName) => {
        const fn = makeRequestAction(config, fnName, actions);
        return {
          ...acc,
          [fnName]: (...args) => dispatch(fn(...args))
        };
      }, {}),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [dispatch, ...deps]
  );

  // Create the dispatchable mutation actions from the functions defined in the
  // configuration.
  const mutationActions = useMemo(
    () =>
      Object.keys(mutations).reduce((acc, fnName) => {
        const fn = makeMutationAction(config, fnName, actions);
        return {
          ...acc,
          [fnName]: (...args) => dispatch(fn(...args))
        };
      }, {}),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [dispatch, ...deps]
  );

  const invalidate = useCallback(
    (key) => {
      if (useKey && !key) {
        throw new Error(
          `The contexeed \`${name}\` is setup to use a key (useKey), but you're using invalidate action without a key value.`
        );
      }
      return dispatch(actions.invalidate(key));
    },
    [dispatch, ...deps]
  );

  const getState = useCallback(
    (key) => {
      // If the config defines this contexeed as `useKey`, the `key` becomes
      // required.
      if (useKey && !key) {
        throw new Error(
          `The contexeed \`${name}\` is setup to use a key (useKey), but you're using getState without a key value.`
        );
      }
      if (!useKey && key) {
        throw new Error(
          `The contexeed \`${name}\` is not setup to use a key (useKey), but you're using getState with a key value.`
        );
      }

      return (useKey ? state[key] : state) || baseContexeedState;
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [state, ...deps]
  );

  return {
    ...requestActions,
    ...mutationActions,
    invalidate,
    getState,
    rawState: state,
    dispatch
  };
}

// Config example for contexeed:
// {
//   name: 'example',
//   useKey: true,
//   requests: {
//     fetchSingleAtbd: ({id}) => ({
//       url: `/atbds/${id}`,
//       stateKey: `${id}`
//     })
//   },
//   mutations: {
//     updateAtbd: ({id}) => ({
//       stateKey: `${id}`,
//       mutation: () => {}
//     })
//   }
// }

const makeRequestAction = (config, fnName, actions) => {
  const { name, useKey, requests = {} } = config;
  const { request, receive } = actions;

  return (...args) => {
    // Extract the state key from the returned params.
    const { stateKey, ...rest } = requests[fnName](...args);

    // If the config defines this contexeed as `useKey`, the `stateKey` becomes
    // required.
    if (useKey && !stateKey) {
      throw new Error(
        `The contexeed \`${name}\` is setup to use a key (useKey), but \`requests.${fnName}\` is not returning a stateKey.`
      );
    }

    return makeRequestThunk({
      ...rest,
      stateKey,
      requestFn: stateKey ? request.bind(null, stateKey) : request,
      receiveFn: stateKey ? receive.bind(null, stateKey) : receive
    });
  };
};

const makeMutationAction = (config, fnName, actions) => {
  const { name, useKey, mutations = {} } = config;
  const { request, receive, invalidate } = actions;

  return (...args) => {
    // Extract the state key from the returned params.
    const { stateKey, mutation, options } = mutations[fnName](...args);

    // If the config defines this contexeed as `useKey`, the `stateKey` becomes
    // required.
    if (useKey && !stateKey) {
      throw new Error(
        `The contexeed \`${name}\` is setup to use a key (useKey), but \`mutations.${fnName}\` is not returning a stateKey.`
      );
    }

    // Call the given action with the stateKey if is set.
    const callAction = (actionFn, args) => {
      const action = stateKey ? actionFn(stateKey, ...args) : actionFn(...args);
      return { ...action, isMutation: true };
    };

    return async function (dispatch, state) {
      const { stateSlice } = getStateSlice(state, stateKey);

      // Actions for mutations have a isMutation key.
      const dispatchableActions = {
        request: (...args) => dispatch(callAction(request, args)),
        receive: (...args) => dispatch(callAction(receive, args)),
        invalidate: () => dispatch(callAction(invalidate, args)),
        dispatch
      };

      return mutation({
        axios: axiosAPI,
        requestOptions: options,
        state: stateSlice,
        actions: dispatchableActions
      });
    };
  };
};

/**
 * With a simple mutation this helper reduces boilerplate.
 * Used as:
 *
 * mutation: simpleMutation({
 *            url: `/atbds/${id}`,
 *            method: 'delete'
 *          })
 *
 * @param {object} params parameters for the request.
 */
export const simpleMutation = (params) => async ({
  axios,
  requestOptions,
  actions
}) => {
  try {
    // Dispatch request action. It is already dispatchable.
    actions.request();

    const response = await axios({
      ...requestOptions,
      ...params
    });

    // Dispatch receive action. It is already dispatchable.
    return actions.receive(response.data);
  } catch (error) {
    // Dispatch receive action. It is already dispatchable.
    return actions.receive(null, error);
  }
};
