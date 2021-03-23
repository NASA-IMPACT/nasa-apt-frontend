/**
 * Base reducer for an api request, taking into account the action.id If it
 * exists it will store in the state under that path. Allows for page caching.
 *
 * Uses the following actions:
 * - invalidate/<actionName>
 * - request/<actionName>
 * - receive/<actionName>
 *
 * which are created by makeActions
 *
 * @param {object} op Options
 * @param {string} op.name The action name to use as suffix
 * @param {object} op.initialState Initial state to use. Used by the invalidate
 * action
 * @param {object} op.baseState The base state from where to get the needed
 * properties.
 *
 * @example
 * const resultsReducer = makeAPIReducer({ name: 'results', initial: {} });
 */
export function makeReducer({ name: actionName, initialState, baseState }) {
  // Reducer function.
  return (state, action) => {
    const hasId = typeof action.id !== 'undefined';

    switch (action.type) {
      case `invalidate/${actionName}`:
        // When invalidating set the state to the initial value. If there's an
        // id remove the key completely because that is the initial state.
        if (hasId) {
          /* eslint-disable-next-line no-unused-vars */
          const { [action.id]: _, ...rest } = state;
          return rest;
        } else {
          return initialState;
        }
      case `request/${actionName}`: {
        const localState = hasId ? state[action.id] : state;
        const changeReq = {
          ...baseState,
          ...localState,
          status: 'loading'
        };
        return hasId ? { ...state, [action.id]: changeReq } : changeReq;
      }
      case `receive/${actionName}`: {
        const localState = hasId ? state[action.id] : state;
        // eslint-disable-next-line prefer-const
        let st = {
          ...baseState,
          ...localState,
          receivedAt: action.receivedAt
        };

        if (action.error) {
          st.status = 'failed';
          st.error = action.error;
          // The data remains to what was previously set. This allows to keep
          // the data in the interface even if the request fails.
        } else {
          st.status = 'succeeded';
          st.data = action.data;
          st.error = null;
        }

        return hasId ? { ...state, [action.id]: st } : st;
      }
    }
    return state;
  };
}
