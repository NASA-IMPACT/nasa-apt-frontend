import { useReducerWithThunk } from './use-reducer-thunk';

/**
 * Creates a reducer hook from a contexeed instance.
 *
 * @param {object} contextseed A contexeed instance created with createContexeedAPI
 * @returns Array tuple [state, dispatch]
 */
export function useContexeedReducer(contextseed) {
  return useReducerWithThunk(contextseed.reducer, contextseed.initialState);
}
