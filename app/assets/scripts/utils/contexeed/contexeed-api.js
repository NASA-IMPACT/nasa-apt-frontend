import { makeActions } from './make-actions';
import { makeReducer } from './make-reducer';
import { makeRequestThunk } from './make-request-thunk';
import { withReducerLogs } from './with-reducer-log';

// status: 'idle' | 'loading' | 'succeeded' | 'failed'
const baseContexeedState = {
  status: 'idle',
  receivedAt: null,
  error: null,
  data: null
};

/**
 * Creates all the needed pieces for an contexeed api handler.
 * Includes the reducer, api request actions and an api request creator.
 *
 * @param {object} op Options
 * @param {string} op.name The action name to use as suffix
 * @param {bool} op.useKey Whether the actions need to handle a key.
 *
 * @returns Object {
 *  apiActions,
 *  initialState,
 *  reducer,
 *  makeRequestAction
 * }
 *
 * @example Usage in a react component.
 * Define the Contexeed outside the component
 *
 * // Create contexeed instance.
 * const exampleContexeed = createContexeedAPI({ name: 'example' });
 *
 * // Create dispatchable actions to fetch api data.
 * const fetchExample = exampleContexeed.makeRequestAction((id) => ({
 *   url: `https://example.com/${id}`
 * }));
 *
 * function MyComponent() {
 *  // useReducerWithThunk works the same way as useReducer but with support for
 *  // function actions. It is available through contexeed.
 *  const [state, dispatch] = useReducerWithThunk(
 *    exampleContexeed.reducer,
 *    exampleContexeed.initialState
 *  );
 *
 *  useEffect(() => {
 *    dispatch(fetchExample(1));
 *  }, []);
 *
 *  return <p>Hello</p>
 * }
 */
export function createContexeedAPI({ name, useKey }) {
  const apiActions = makeActions({ name, useKey });

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
      initialState,
      baseState: baseContexeedState
    })
  );

  const makeRequestAction = (fn) => {
    return (...args) => {
      const { stateKey, ...rest } = fn(...args);

      return makeRequestThunk({
        ...rest,
        stateKey,
        requestFn: stateKey
          ? apiActions.request.bind(null, stateKey)
          : apiActions.request,
        receiveFn: stateKey
          ? apiActions.receive.bind(null, stateKey)
          : apiActions.receive
      });
    };
  };

  return {
    apiActions,
    initialState,
    reducer,
    makeRequestAction
  };
}
