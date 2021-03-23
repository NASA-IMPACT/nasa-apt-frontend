import React, { createContext, useContext } from 'react';
import T from 'prop-types';

import { useAuthToken } from './user';
import withRequestToken from '../utils/with-request-token';
import { useContexeedApi } from '../utils/contexeed';

// Context
export const AtbdsContext = createContext(null);

// Context provider
export const AtbdsProvider = (props) => {
  const { children } = props;
  const { token } = useAuthToken();

  const { getState: getAtbds, fetchAtbds } = useContexeedApi({
    name: 'atbdList',
    requests: {
      fetchAtbds: withRequestToken(token, () => ({
        url: '/atbds'
      }))
    }
  });

  const { getState: getSingleAtbd, fetchSingleAtbd } = useContexeedApi({
    name: 'atbdSingle',
    useKey: true,
    requests: {
      fetchSingleAtbd: withRequestToken(token, ({ id, version }) => ({
        url: `/atbds/${id}/versions/${version}`,
        stateKey: `${id}/${version}`
      }))
    }
  });

  const contextValue = {
    getAtbds,
    fetchAtbds,
    getSingleAtbd,
    fetchSingleAtbd
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
const useCheckContext = (fnName) => {
  const context = useContext(AtbdsContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <AtbdsContext> component's context.`
    );
  }

  return context;
};

export const useSingleAtbd = ({ id, version }) => {
  const { getSingleAtbd, fetchSingleAtbd } = useCheckContext('useSingleAtbd');
  return {
    atbd: getSingleAtbd(`${id}/${version}`),
    fetchSingleAtbd: () => fetchSingleAtbd({ id, version })
  };
};

export const useAtbds = () => {
  const { getAtbds, fetchAtbds } = useCheckContext('useAtbds');
  return { atbds: getAtbds(), fetchAtbds };
};
