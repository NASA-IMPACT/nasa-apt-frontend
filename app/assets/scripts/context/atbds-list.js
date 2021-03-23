import React, { createContext, useContext } from 'react';
import T from 'prop-types';

import { createContexeedAPI, useContexeedReducer } from '../utils/contexeed';
import makeContexeedRequestWithToken from '../utils/contexeed-request-token';
import { useAuthToken } from './user';

// Create contexeed instance for the ATBD list.
const atbdListContexeed = createContexeedAPI({ name: 'atbdList' });

// Create dispatchable actions to fetch api data.
const fetchAtbds = makeContexeedRequestWithToken(atbdListContexeed, () => ({
  url: '/atbds'
}));

// Context
export const AtbdsContext = createContext(null);

// Context provider
export const AtbdsProvider = (props) => {
  const { children } = props;

  const [state, dispatch] = useContexeedReducer(atbdListContexeed);
  const { token } = useAuthToken();

  const contextValue = {
    state,
    fetchAtbds: () => dispatch(fetchAtbds({ token }))
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
