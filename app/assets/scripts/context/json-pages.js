import React, { createContext, useCallback, useContext } from 'react';
import defaultsDeep from 'lodash.defaultsdeep';
import T from 'prop-types';

import config from '../config';
import { useContexeedApi } from '../utils/contexeed';

function withLocalBaseUrl(fn) {
  return (...args) => {
    return defaultsDeep(
      {
        options: {
          baseURL: config.baseUrl || '/'
        }
      },
      fn(...args)
    );
  };
}

// Context
export const JsonPagesContext = createContext(null);

// Context provider
export const JsonPagesProvider = ({ children }) => {
  const { getState: getPagesIndex, fetchPagesIndex } = useContexeedApi(
    {
      name: 'jsonPagesIndex',
      useKey: true,
      requests: {
        fetchPagesIndex: withLocalBaseUrl(({ id, url }) => ({
          stateKey: `${id}`,
          url
        }))
      }
    },
    []
  );

  const { getState: getSingleJsonPage, fetchSingleJsonPage } = useContexeedApi(
    {
      name: 'jsonPages',
      useKey: true,
      requests: {
        fetchSingleJsonPage: withLocalBaseUrl(({ id, url }) => ({
          stateKey: `${id}`,
          url
        }))
      }
    },
    []
  );

  const contextValue = {
    getPagesIndex,
    fetchPagesIndex,
    getSingleJsonPage,
    fetchSingleJsonPage
  };

  return (
    <JsonPagesContext.Provider value={contextValue}>
      {children}
    </JsonPagesContext.Provider>
  );
};

JsonPagesProvider.propTypes = {
  children: T.node
};

// Context consumers.
// Used to access different parts of the contact list context
const useCheckContext = (fnName) => {
  const context = useContext(JsonPagesContext);
  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <JsonPagesContext> component's context.`
    );
  }

  return context;
};

export const useSingleJsonPage = (id) => {
  const { getSingleJsonPage, fetchSingleJsonPage } = useCheckContext(
    'useSingleJsonPage'
  );

  return {
    page: getSingleJsonPage(`${id}`),
    fetchSingleJsonPage: useCallback(
      (url) => fetchSingleJsonPage({ id, url }),
      [id, fetchSingleJsonPage]
    )
  };
};

export const useJsonPagesIndex = (id) => {
  const { getPagesIndex, fetchPagesIndex } = useCheckContext(
    'useJsonPagesIndex'
  );

  return {
    pagesIndex: getPagesIndex(`${id}`),
    fetchPagesIndex: useCallback((url) => fetchPagesIndex({ id, url }), [
      id,
      fetchPagesIndex
    ])
  };
};
