import React, { createContext, useCallback, useContext } from 'react';
import T from 'prop-types';

import { useContexeedApi } from '../utils/contexeed-v2';
import { useAuthToken } from './user';
import withRequestToken from '../utils/with-request-token';

// Context
export const SearchContext = createContext(null);

// Context provider
export const SearchProvider = ({ children }) => {
  const { token } = useAuthToken();

  const {
    getState: getResults,
    fetchSearchResults,
    invalidate
  } = useContexeedApi(
    {
      name: 'searchResults',
      requests: {
        fetchSearchResults: withRequestToken(token, ({ data }) => {
          const { term, year, status } = data;

          const statusFilter =
            status === 'all' ? 'Draft OR Published' : status.toLowerCase();

          const elasticQuery = {
            bool: {
              must: [
                {
                  multi_match: {
                    query: term
                  }
                }
              ],
              filter: []
            }
          };

          elasticQuery.bool.filter.push({
            match: { 'version.status': statusFilter }
          });

          if (year !== 'all') {
            elasticQuery.bool.filter.push({
              match: { 'version.citation.release_date': year }
            });
          }

          return {
            url: `/search`,
            requestOptions: {
              method: 'post',
              data: {
                query: elasticQuery,
                highlight: { fields: { '*': {} } }
              }
            }
          };
        })
      }
    },
    [token]
  );

  const contextValue = {
    getResults,
    fetchSearchResults,
    invalidate
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: T.node
};

// Context consumers.
// Used to access different parts of the contact list context
const useCheckContext = (fnName) => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <SearchContext> component's context.`
    );
  }

  return context;
};

export const useSearch = () => {
  const { getResults, fetchSearchResults, invalidate } = useCheckContext(
    'useSearch'
  );

  return {
    results: getResults(),
    invalidate,
    fetchSearchResults: useCallback((data) => fetchSearchResults({ data }), [
      fetchSearchResults
    ])
  };
};
