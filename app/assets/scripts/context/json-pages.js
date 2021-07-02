import React, { createContext, useCallback } from 'react';
import defaultsDeep from 'lodash.defaultsdeep';
import T from 'prop-types';

import config from '../config';
import { useContexeedApi } from '../utils/contexeed-v2';
import { createContextChecker } from '../utils/create-context-checker';

function withLocalBaseUrl(fn) {
  return (...args) => {
    return defaultsDeep(
      {
        requestOptions: {
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
      slicedState: true,
      requests: {
        fetchPagesIndex: withLocalBaseUrl(({ id, url }) => ({
          sliceKey: `${id}`,
          url
        }))
      }
    },
    []
  );

  const { getState: getSingleJsonPage, fetchSingleJsonPage } = useContexeedApi(
    {
      name: 'jsonPages',
      slicedState: true,
      requests: {
        fetchSingleJsonPage: withLocalBaseUrl(({ id, url }) => ({
          sliceKey: `${id}`,
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
const useSafeContextFn = createContextChecker(
  JsonPagesContext,
  'JsonPagesContext'
);

export const useSingleJsonPage = (id) => {
  const { getSingleJsonPage, fetchSingleJsonPage } = useSafeContextFn(
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
  const { getPagesIndex, fetchPagesIndex } = useSafeContextFn(
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
