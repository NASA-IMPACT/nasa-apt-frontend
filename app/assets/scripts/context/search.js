import React, { createContext, useCallback } from 'react';
import T from 'prop-types';

import { useContexeedApi } from '../utils/contexeed-v2';
import { useAuthToken } from './user';
import withRequestToken from '../utils/with-request-token';
import { createContextChecker } from '../utils/create-context-checker';

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
          const { term, year } = data;

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
const useSafeContextFn = createContextChecker(SearchContext, 'SearchContext');

export const useSearch = () => {
  const { getResults, fetchSearchResults, invalidate } =
    useSafeContextFn('useSearch');

  return {
    results: getResults(),
    invalidate,
    fetchSearchResults: useCallback(
      (data) => fetchSearchResults({ data }),
      [fetchSearchResults]
    )
  };
};
