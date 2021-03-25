import { useMemo, useCallback } from 'react';

import { withReducerLogs } from './with-reducer-log';
import { makeReducer } from './make-reducer';
import { makeActions } from './make-actions';
import { makeRequestThunk } from './make-request-thunk';
import { useReducerWithThunk } from './use-reducer-thunk';

// status: 'idle' | 'loading' | 'succeeded' | 'failed'
const baseContexeedState = {
  status: 'idle',
  receivedAt: null,
  error: null,
  data: null
};

export function useContexeedApi(config, deps = []) {
  const { name, useKey, requests = {} } = config;

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
      makeReducer({
        name,
        // When creating the reducer we need the initial state, to be able to use
        // the invalidate function.
        initialState,
        //The base state is used as the source for missing properties. We start
        //from the base state and replace what's needed. In this way we ensure
        //state consistency.
        baseState: baseContexeedState
      })
    );

    // Create the actions needed by the thunk (request and receive), and the
    // invalidate action to clean the state.
    const actions = makeActions({ name, useKey });

    return {
      initialState,
      reducer,
      actions
    };
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
    [dispatch, ...deps]
  );

  const invalidate = useCallback(
    (...args) => dispatch(actions.invalidate(...args)),
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
    [state, ...deps]
  );

  return {
    ...requestActions,
    invalidate,
    getState,
    rawState: state,
    dispatch
  };
}

const makeRequestAction = (config, fnName, actions) => {
  const { name, useKey, requests = {} } = config;
  const { request, receive } = actions;
  // Config example:
  // {
  //   name: 'example',
  //   useKey: true,
  //   requests: {
  //     fetchSingleAtbd: ({id}) => ({
  //       url: `/atbds/${id}`,
  //       stateKey: `${id}`
  //     })
  //   }
  // }
  return (...args) => {
    // Extract the state key from the returned params.
    const { stateKey, ...rest } = requests[fnName](...args);

    // If the config defines this contexeed as `useKey`, the `stateKey` becomes
    // required.
    if (useKey && !stateKey) {
      throw new Error(
        `The contexeed \`${name}\` is setup to use a key (useKey), but the requester \`${fnName}\` is not returning a stateKey.`
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
