import React, { createContext, useCallback, useContext } from 'react';
import T from 'prop-types';

import { useAuthToken } from './user';
import withRequestToken from '../utils/with-request-token';
import { useContexeedApi } from '../utils/contexeed';

// Context
export const AtbdsContext = createContext(null);

const getUpdatedTimes = (atbdData, versionData) => {
  if (!atbdData) {
    return {
      last_updated_at: versionData.last_updated_at,
      last_updated_by: versionData.last_updated_by
    };
  }
  if (!versionData) {
    return {
      last_updated_at: atbdData.last_updated_at,
      last_updated_by: atbdData.last_updated_by
    };
  }

  const lastUpdate =
    atbdData.last_updated_at > versionData.last_updated_at
      ? atbdData.last_updated_at
      : versionData.last_updated_at;
  const lastUpdatedBy =
    atbdData.last_updated_at > versionData.last_updated_at
      ? atbdData.last_updated_by
      : versionData.last_updated_by;

  return {
    last_updated_at: lastUpdate,
    last_updated_by: lastUpdatedBy
  };
};

/**
 * Computes the new versions array replacing the version with the updated data.
 *
 * @param {array} versions The current versions array
 * @param {string} currentVersion The version identifier (v2.3)
 * @param {object} newVersionData The new data for this version
 * @returns array
 */
const getUpdatedVersions = (versions, currentVersion, newVersionData) => {
  // When the content gets updated we also have to update the corresponding
  // version in the versions array. This is needed to ensure consistency with
  // the returned structure from fetchSingleAtbd.
  return versions.map((v) => {
    if (v.version === currentVersion) {
      // Exclude document from the versions array.
      /* eslint-disable-next-line no-unused-vars */
      const { document, ...rest } = newVersionData;
      return rest;
    } else {
      return v;
    }
  });
};

// Context provider
export const AtbdsProvider = (props) => {
  const { children } = props;
  const { token } = useAuthToken();

  const { getState: getAtbds, fetchAtbds, deleteFullAtbd } = useContexeedApi({
    name: 'atbdList',
    requests: {
      fetchAtbds: withRequestToken(token, () => ({
        url: '/atbds'
      }))
    },
    mutations: {
      deleteFullAtbd: withRequestToken(token, ({ id }) => ({
        mutation: async ({ axios, requestOptions, state, actions }) => {
          try {
            // Dispatch request action. It is already dispatchable.
            actions.request();

            await axios({
              ...requestOptions,
              url: `/atbds/${id}`,
              method: 'delete'
            });

            // If this worked, remove the item from the atbd list.
            const newData = state.data.filter((atbd) => atbd.id !== id);
            return actions.receive(newData);
          } catch (error) {
            // Dispatch receive action. It is already dispatchable.
            return actions.receive(null, error);
          }
        }
      }))
    }
  });

  const {
    getState: getSingleAtbd,
    fetchSingleAtbd,
    createAtbd,
    updateAtbd,
    deleteAtbdVersion
  } = useContexeedApi({
    name: 'atbdSingle',
    useKey: true,
    interceptor: (state, action) => {
      // The statekey for a single atbd can be alias-version. This means that
      // when the alias changes the key must updated as well. This code captures
      // the action and does that.
      switch (action.type) {
        case 'atbdSingle/move-key': {
          const { [action.from]: prevKey, ...rest } = state;
          return {
            action,
            state: {
              ...rest,
              [action.to]: prevKey
            }
          };
        }
      }
      return { state, action };
    },
    requests: {
      fetchSingleAtbd: withRequestToken(token, ({ id, version }) => ({
        stateKey: `${id}/${version}`,
        // The __overrideData allows us to produce the data any way we like.
        // Since this action needs to fetch data from 2 endpoints and combine it
        // we can't use the conventional ways. The data returned is stored in
        // the store.
        __overrideData: async ({ axios, requestOptions }) => {
          const [metaInfo, versionInfo] = await Promise.all([
            axios({
              ...requestOptions,
              url: `/atbds/${id}`
            }),
            axios({
              ...requestOptions,
              url: `/atbds/${id}/versions/${version}`
            })
          ]);
          const metaData = metaInfo.data;
          // Despite being an array it only has 1 version, the one we queried.
          const versionData = versionInfo.data.versions[0];

          // The responses of both endpoints are pretty similar. The first
          // includes the meta information (no document) of all the versions,
          // and the second includes the full document of the requested version.
          // The structure of an ATBD can be see in ./types.ts
          // We keep the response from the metaInfo, and append all the fields
          // of the queried version.
          return {
            ...metaData,
            ...versionData,
            // The last updated at value will be the most recent between the
            // base data and the version data.
            ...getUpdatedTimes(metaData, versionData)
          };
        }
      }))
    },
    mutations: {
      createAtbd: withRequestToken(token, () => ({
        // Holder for the creation of a new ATBD since we don't have id yet.
        stateKey: 'new',
        mutation: async ({ axios, requestOptions, actions }) => {
          try {
            // Dispatch request action. It is already dispatchable.
            actions.request();

            const response = await axios({
              ...requestOptions,
              url: '/atbds',
              method: 'post',
              data: {
                // New ATBDs are created as Untitled. The user can change the title
                // at a later stage.
                title: 'Untitled Document'
              }
            });

            // Dispatch receive action. It is already dispatchable.
            return actions.receive(response.data);
          } catch (error) {
            // Dispatch receive action. It is already dispatchable.
            return actions.receive(null, error);
          }
        }
      })),
      deleteAtbdVersion: withRequestToken(token, ({ id, version }) => ({
        stateKey: `${id}/${version}`,
        mutation: async ({ axios, requestOptions, actions }) => {
          try {
            // Dispatch request action. It is already dispatchable.
            actions.request();

            await axios({
              ...requestOptions,
              url: `/atbds/${id}/versions/${version}`,
              method: 'delete'
            });

            // If this worked, invalidate the state for this id-version
            return actions.invalidate();
          } catch (error) {
            // Dispatch receive action. It is already dispatchable.
            return actions.receive(null, error);
          }
        }
      })),
      // Updating an ATBD is simple most of the times. The vast majority of the
      // fields belong to an ATBD version and we'd use the versions endpoint.
      // However when updating global fields like the tile or alias, we need to
      // hit a separate endpoint just for those.
      updateAtbd: withRequestToken(token, ({ id, version, data }) => ({
        stateKey: `${id}/${version}`,
        mutation: async ({ axios, requestOptions, state, actions }) => {
          try {
            // The id bound to the action function might be the alias or the
            // numeric id. We need to use the numeric id to make the requests
            // because the alias might be updated. If the alias update request
            // finishes before the content update request, the content update
            // would be looking at a non existent alias.
            const { id: numericAtbdId, title, alias, ...rest } = data;

            // Dispatch request action. It is already dispatchable.
            actions.request();

            const metaUpdate =
              // We have to update the title or alias and that requires a
              // different endpoint.
              title || alias
                ? axios({
                    ...requestOptions,
                    url: `/atbds/${numericAtbdId}`,
                    method: 'post',
                    data: {
                      title,
                      alias
                    }
                  })
                : // Nothing to update.
                  Promise.resolve();

            // Content for the atbd is actually stored on the version.
            const contentUpdate = Object.keys(rest).length
              ? axios({
                  ...requestOptions,
                  url: `/atbds/${numericAtbdId}/versions/${version}`,
                  method: 'post',
                  data: rest
                })
              : // Nothing to update.
                Promise.resolve();

            const [metaResponse, contentResponse] = await Promise.all([
              metaUpdate,
              contentUpdate
            ]);

            // Since the both responses return data that we need on the state we
            // have to merge them.
            let updatedData = state.data;

            if (contentResponse) {
              // Despite being an array it only has 1 version, the one we queried.
              // See note on fetchSingleAtbd
              const updatedVersion = contentResponse.data.versions[0];

              updatedData = {
                ...updatedData,
                // When the content gets updated we also have to update the
                // corresponding version in the versions array. This is needed
                // to ensure consistency with the returned structure from
                // fetchSingleAtbd.
                versions: getUpdatedVersions(
                  updatedData.versions,
                  version,
                  updatedVersion
                ),
                ...updatedVersion
              };
            }

            if (metaResponse) {
              updatedData = {
                ...updatedData,
                title: metaResponse.data.title,
                alias: metaResponse.data.alias
              };
            }

            updatedData = {
              ...updatedData,
              // The last updated at value will be the most recent between the
              // base data and the version data.
              ...getUpdatedTimes(
                metaResponse?.data,
                contentResponse?.data.versions[0]
              )
            };

            // Dispatch receive action. It is already dispatchable.
            const updateResult = actions.receive(updatedData);

            // The state key may have to change if the atbd alias changed.
            const newAtbdId = metaResponse
              ? metaResponse.data.alias || metaResponse.data.id
              : id;
            // Or if the version changed
            const newAtbdVersion = contentResponse
              ? // Despite being an array it only has 1 version, the one we queried.
                contentResponse.data.versions[0].version
              : version;

            const currentKey = `${id}/${version}`;
            const newKey = `${newAtbdId}/${newAtbdVersion}`;

            if (newKey !== currentKey) {
              // Direct access to the dispatch function.
              actions.dispatch({
                type: 'atbdSingle/move-key',
                from: currentKey,
                to: newKey
              });

              // Ensure everything is correct, even the new key.
              return { ...updateResult, key: newKey };
            }

            // Return the data receiving action.
            return { ...updateResult };
          } catch (error) {
            // Dispatch receive action. It is already dispatchable.
            return actions.receive(null, error);
          }
        }
      }))
    }
  });

  const contextValue = {
    getAtbds,
    fetchAtbds,
    getSingleAtbd,
    fetchSingleAtbd,
    createAtbd,
    updateAtbd,
    deleteFullAtbd,
    deleteAtbdVersion
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
  const {
    getSingleAtbd,
    fetchSingleAtbd,
    updateAtbd,
    deleteAtbdVersion
  } = useCheckContext('useSingleAtbd');

  return {
    atbd: getSingleAtbd(`${id}/${version}`),
    fetchSingleAtbd: useCallback(() => fetchSingleAtbd({ id, version }), [
      id,
      version,
      fetchSingleAtbd
    ]),
    updateAtbd: useCallback((data) => updateAtbd({ id, version, data }), [
      id,
      version,
      updateAtbd
    ]),
    deleteAtbdVersion: useCallback(() => deleteAtbdVersion({ id, version }), [
      id,
      version,
      deleteAtbdVersion
    ])
  };
};

export const useAtbds = () => {
  const { getAtbds, fetchAtbds, createAtbd, deleteFullAtbd } = useCheckContext(
    'useAtbds'
  );
  return { atbds: getAtbds(), fetchAtbds, createAtbd, deleteFullAtbd };
};
