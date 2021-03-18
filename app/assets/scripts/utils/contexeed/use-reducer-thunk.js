import { useReducer } from 'react';

export function useReducerWithThunk(reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const customDispatch = (action) =>
    typeof action === 'function'
      ? action(customDispatch, state)
      : dispatch(action);

  return [state, customDispatch];
}
