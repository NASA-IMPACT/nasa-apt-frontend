import React, { createContext, useCallback } from 'react';
import T from 'prop-types';
import qs from 'qs';

import { useAuthToken } from './user';
import withRequestToken from '../utils/with-request-token';
import { useContexeedApi } from '../utils/contexeed-v2';
import { createContextChecker } from '../utils/create-context-checker';

// Context
export const CollaboratorsContext = createContext(null);

// Context provider
export const CollaboratorsProvider = ({ children }) => {
  const { token } = useAuthToken();

  const {
    getState: getCollaborators,
    fetchCollaboratorsList
  } = useContexeedApi(
    {
      name: 'collaboratorsList',
      slicedState: true,
      requests: {
        fetchCollaboratorsList: withRequestToken(
          token,
          ({ atbdId, atbdVersion, userFilter }) => ({
            skipStateCheck: true,
            sliceKey: `${atbdId}-${atbdVersion}-${userFilter}`,
            url: `/users/?${qs.stringify({
              atbd_id: atbdId,
              version: atbdVersion,
              user_filter: userFilter
            })}`
          })
        )
      }
    },
    [token]
  );

  const contextValue = {
    getCollaborators,
    fetchCollaboratorsList
  };

  return (
    <CollaboratorsContext.Provider value={contextValue}>
      {children}
    </CollaboratorsContext.Provider>
  );
};

CollaboratorsProvider.propTypes = {
  children: T.node
};

// Context consumers.
// Used to access different parts of the collaborators list context
const useSafeContextFn = createContextChecker(
  CollaboratorsContext,
  'CollaboratorsContext'
);

export const useCollaborators = ({ atbdId, atbdVersion, userFilter }) => {
  const { getCollaborators, fetchCollaboratorsList } = useSafeContextFn(
    'useCollaborators'
  );

  return {
    collaborators: getCollaborators(`${atbdId}-${atbdVersion}-${userFilter}`),
    fetchCollaborators: useCallback(
      () => fetchCollaboratorsList({ atbdId, atbdVersion, userFilter }),
      [atbdId, atbdVersion, userFilter, fetchCollaboratorsList]
    )
  };
};
