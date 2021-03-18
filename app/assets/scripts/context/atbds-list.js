import React, { createContext, useContext } from 'react';
import T from 'prop-types';

import { createContexeedAPI, useReducerWithThunk } from '../utils/contexeed';

// Create contexeed instance for the ATBD list.
const atbdListContexeed = createContexeedAPI({ name: 'atbdList' });

// Create dispatchable actions to fetch api data.
const fetchAtbds = atbdListContexeed.makeRequestAction(() => ({
  url: '/atbds'
}));

// Context
export const AtbdsContext = createContext(null);

// Context provider
export const AtbdsProvider = (props) => {
  const { children } = props;

  const [state, dispatch] = useReducerWithThunk(
    atbdListContexeed.reducer,
    atbdListContexeed.initialState
  );

  const contextValue = {
    state,
    fetchAtbds: (...args) => dispatch(fetchAtbds(...args))
  };

  return (
    <AtbdsContext.Provider value={contextValue}>
      {children}
    </AtbdsContext.Provider>
  );
};

AtbdsProvider.propTypes = {
  children: T.node
};

// Context consumers.
// Used to access different parts of the ATBD list context

export const useAtbds = () => {
  const context = useContext(AtbdsContext);

  if (!context) {
    throw new Error(
      `The \`useAtbds\` hook must be used inside the <AtbdsContext> component's context.`
    );
  }

  return context;
};
