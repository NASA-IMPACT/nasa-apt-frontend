import { useReducer } from 'react';

/**
 * Creates a reducer that supports dispatching functions.
 *
 * @param {function} reducer Reducer function
 * @param {object} initialState Reducer initial state
 * @returns Array tuple [state, dispatch]
 */
export function useReducerWithThunk(reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const customDispatch = (action) =>
    typeof action === 'function'
      ? action(customDispatch, state)
      : dispatch(action);

  return [state, customDispatch];
}
