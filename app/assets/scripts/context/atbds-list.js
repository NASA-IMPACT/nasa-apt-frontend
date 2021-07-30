import React, { createContext, useCallback, useMemo } from 'react';
import T from 'prop-types';
import qs from 'qs';

import { useAuthToken } from './user';
import withRequestToken from '../utils/with-request-token';
import { createContextChecker } from '../utils/create-context-checker';
import { useContexeedApi } from '../utils/contexeed-v2';

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

export const computeAtbdVersion = (metaData, versionData) => {
  return {
    ...metaData,
    ...versionData,
    // The last updated at value will be the most recent between the
    // base data and the version data.
    ...getUpdatedTimes(metaData, versionData)
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

const RESET_STATE_ACTION_TYPE = 'reset-state';

// Context provider
export const AtbdsProvider = (props) => {
  const { children } = props;
  const { token } = useAuthToken();

  const {
    getState: getAtbds,
    fetchAtbds,
    dispatch: dispatchAtbdList
  } = useContexeedApi(
    {
      name: 'atbdList',
      slicedState: true,
      interceptor: (state, action) => {
        switch (action.type) {
          case RESET_STATE_ACTION_TYPE: {
            return { action, state: {} };
          }
        }
        return { state, action };
      },
      requests: {
        fetchAtbds: withRequestToken(token, (filters = {}) => ({
          sliceKey: `${filters.role || 'all'}-${filters.status || 'all'}`,
          url: `/atbds?${qs.stringify(filters, { skipNulls: true })}`
        }))
      }
    },
    [token]
  );

  /**
   * Thunk function to invalidate other versions of the same atbd.
   *
   * @description
   * Each Atbd contains an array with a list of all existent versions for that
   * Atbd. This is used to populate the version dropdown among other things.
   * Despite each of the entries on this versions array not containing the full
   * document, they still contain some information that can be updated.
   * For example, if we are on version v2.0 of an Atbd the version's array for
   * this Atbd will contains v2.0 and v1.x. If we add a new major version
   * (v3.0), the system will fetch the data for v3.0 from the api and the
   * version's array for v3.0 will now contain, v3.0, v2.0, v1.x. However the
   * version's array for v2.0 will be missing the newly added v3.0 because we
   * didn't fetch the updated data and the frontend caches data.
   * This could be solved by updating all the versions in the state, but by
   * invalidating them we ensure that if the user were to open them again,
   * they'd be refetched ensuring that the data will all be correct.
   * At the expense of a network request we reduce the probability of data
   * inconsistencies.
   *
   * @param {string|number} id Atbd id or alias used for the cache key
   * @param {string} version Atbd version
   */
  const invalidateOtherAtbdVersions = (id, version) => (dispatch, state) => {
    Object.keys(state)
      .filter((k) => k.startsWith(`${id}/`) && k !== `${id}/${version}`)
      .forEach(invalidate);
  };

  const {
    getState: getSingleAtbd,
    fetchSingleAtbd,
    invalidate,
    createAtbd,
    updateAtbd,
    deleteAtbdVersion,
    createAtbdVersion,
    fireAtbdEvent,
    dispatch: dispatchAtbdSingle
  } = useContexeedApi(
    {
      name: 'atbdSingle',
      slicedState: true,
      interceptor: (state, action) => {
        // The statekey for a single atbd can be alias-version. This means that
        // when the alias changes the key must updated as well. This code captures
        // the action and does that.
        switch (action.type) {
          case RESET_STATE_ACTION_TYPE: {
            return { action, state: {} };
          }
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
          sliceKey: `${id}/${version}`,
          // The overrideRequest allows us to produce the data any way we like.
          // Since this action needs to fetch data from 2 endpoints and combine
          // it we can't use the conventional ways. The data returned is stored
          // in the store.
          overrideRequest: async ({ axios, requestOptions }) => {
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
            return computeAtbdVersion(metaData, versionData);
          }
        }))
      },
      mutations: {
        createAtbd: withRequestToken(token, () => ({
          // Holder for the creation of a new ATBD since we don't have id yet.
          sliceKey: 'new',
          url: '/atbds',
          requestOptions: {
            method: 'post',
            data: {
              // New ATBDs are created as Untitled. The user can change the
              // title at a later stage.
              title: 'Untitled Document'
            }
          }
        })),
        createAtbdVersion: withRequestToken(token, ({ id }) => ({
          // Holder for the creation of a new ATBD version since we don't have a
          // version number yet.
          sliceKey: `${id}/new`,
          url: `/atbds/${id}/versions`,
          requestOptions: {
            method: 'post'
          },
          transformData: (data, { dispatch }) => {
            // See explanation before contexeed declaration.
            dispatch(invalidateOtherAtbdVersions(id, 'new'));

            // Although this state slice is jut a placeholder for the new
            // version, it is good to ensure that the structure is always the
            // same. See rationale on fetchSingleAtbd
            return computeAtbdVersion(data, data.versions[0]);
          }
        })),
        deleteAtbdVersion: withRequestToken(token, ({ id, version }) => ({
          sliceKey: `${id}/${version}`,
          url: `/atbds/${id}/versions/${version}`,
          requestOptions: {
            method: 'delete'
          },
          onDone: (finish, { error, invalidate }) => {
            // Because a deleted version may be in the atbd list state,
            // invalidate it all.
            dispatchAtbdList({ type: RESET_STATE_ACTION_TYPE });

            return !error ? invalidate(`${id}/${version}`) : finish();
          }
        })),
        // Updating an ATBD is simple most of the times. The vast majority of the
        // fields belong to an ATBD version and we'd use the versions endpoint.
        // However when updating global fields like the tile or alias, we need to
        // hit a separate endpoint just for those.
        updateAtbd: withRequestToken(token, ({ id, version, data }) => {
          // The id bound to the action function might be the alias or the
          // numeric id. We need to use the numeric id to make the requests
          // because the alias might be updated. If the alias update request
          // finishes before the content update request, the content update
          // would be looking at a non existent alias.
          const { id: numericAtbdId, title, alias, ...rest } = data;

          return {
            sliceKey: `${id}/${version}`,
            overrideRequest: async ({ axios, requestOptions, state }) => {
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
                  ...computeAtbdVersion(updatedData, updatedVersion),
                  // When the content gets updated we also have to update the
                  // corresponding version in the versions array. This is needed
                  // to ensure consistency with the returned structure from
                  // fetchSingleAtbd.
                  versions: getUpdatedVersions(
                    updatedData.versions,
                    version,
                    updatedVersion
                  )
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

              return {
                updatedData,
                // The contextual data is only used to dispatch the correct
                // action in the onDone step. Only the updated data will be
                // kept.
                contextualData: {
                  newAtbdId,
                  newAtbdVersion,
                  currentKey,
                  newKey
                }
              };
            },
            onDone: (finish, { data, error, dispatch }) => {
              if (error) {
                return finish();
              }

              const {
                updatedData,
                // The contextual data is only used to dispatch the correct
                // action in the onDone step. Only the updated data will be
                // kept.
                contextualData: {
                  newAtbdId,
                  newAtbdVersion,
                  currentKey,
                  newKey
                }
              } = data;

              // Dispatch the action to have the action result.
              const actionResult = finish(null, updatedData);

              if (newKey !== currentKey) {
                // Direct access to the dispatch function.
                dispatch({
                  type: 'atbdSingle/move-key',
                  from: currentKey,
                  to: newKey
                });

                // See explanation before contexeed declaration.
                dispatch(
                  invalidateOtherAtbdVersions(newAtbdId, newAtbdVersion)
                );

                // Ensure everything is correct, even the new key.
                return { ...actionResult, key: newKey };
              }

              // Return the data receiving action.
              return { ...actionResult };
            }
          };
        }),

        // Even though the events work on a separate endpoint, these events are
        // specifically tied to the ATBDs since their returned response is an
        // updated document.
        fireAtbdEvent: withRequestToken(
          token,
          ({ id, version, action, payload }) => ({
            sliceKey: `${id}/${version}`,
            url: `/events`,
            requestOptions: {
              method: 'post',
              data: {
                atbd_id: id,
                version,
                action,
                payload
              }
            },
            transformData: (data, { state }) => {
              // If the request is fired from the dashboard the state will not
              // have been initialized because no single fetch request was made.
              // If that's the case we don't have data to work with and just
              // throw an error which will be captured in the onDone.
              if (!state?.data) {
                throw new Error('state not initialized');
              }
              // Ensure that the structure is always the same. See rationale on
              // fetchSingleAtbd
              const updatedVersion = data.versions[0];

              return {
                ...computeAtbdVersion(state.data, updatedVersion),
                // When the content gets updated we also have to update the
                // corresponding version in the versions array. This is needed
                // to ensure consistency with the returned structure from
                // fetchSingleAtbd.
                versions: getUpdatedVersions(
                  state.data.versions,
                  version,
                  updatedVersion
                )
              };
            },
            onDone: (finish, { error, invalidate }) => {
              // Because a document for which an event was fired may be in the
              // atbd list state, invalidate it all.
              dispatchAtbdList({ type: RESET_STATE_ACTION_TYPE });

              // If the state is not initialized set the data as null and
              // invalidate. This will ensure that when the single page is
              // opened, data will load.
              if (error?.message === 'state not initialized') {
                const result = finish(null, null);
                invalidate(`${id}/${version}`);
                return result;
              }

              return finish();
            }
          })
        )
      }
    },
    [token]
  );

  const contextValue = {
    invalidateAtbdListCtx: useCallback(
      () => dispatchAtbdList({ type: RESET_STATE_ACTION_TYPE }),
      [dispatchAtbdList]
    ),
    invalidateAtbdSingleCtx: useCallback(
      () => dispatchAtbdSingle({ type: RESET_STATE_ACTION_TYPE }),
      [dispatchAtbdSingle]
    ),
    getAtbds,
    fetchAtbds,
    getSingleAtbd,
    fetchSingleAtbd,
    createAtbd,
    updateAtbd,
    deleteAtbdVersion,
    createAtbdVersion,
    fireAtbdEvent
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
const useSafeContextFn = createContextChecker(AtbdsContext, 'AtbdsContext');

export const useSingleAtbd = ({ id, version }) => {
  const {
    getSingleAtbd,
    fetchSingleAtbd,
    updateAtbd,
    deleteAtbdVersion,
    createAtbdVersion
  } = useSafeContextFn('useSingleAtbd');

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
    // This action is special as it allows an id and a version to be passed as
    // parameters and override the ones passed to the context function
    // (useSingleAtbd). To use `deleteAtbdVersion` normally we'd need to
    // initialize `useSingleAtbd` with { id, version } but if we don't have them
    // available (like in the hub) this is not possible.
    // In this was we can initialize useSingleAtbd({}) without params and then
    // pass them to the deleteAtbdVersion({ id, version }) when it is used.
    deleteAtbdVersion: useCallback(
      ({ id: inId = id, version: inVersion = version } = {}) =>
        deleteAtbdVersion({ id: inId, version: inVersion }),
      [id, version, deleteAtbdVersion]
    ),
    createAtbdVersion: useCallback(() => createAtbdVersion({ id }), [
      id,
      createAtbdVersion
    ])
  };
};

export const useSingleAtbdEvents = ({ id, version }) => {
  const { fireAtbdEvent } = useSafeContextFn('useSingleAtbdEvents');

  // Function to create fire event callbacks. By default single atbd context
  // actions are bound to the provided id and version. The events can also be
  // fired from the dashboard where there is an atbd list instead of single
  // ones. In these cases we cannot initialize the useSingleAtbdEvents with an
  // id and version, therefore these actions allow for those values to be passed
  // as arguments.
  const createFireEvent = useCallback(
    (action) => ({
      id: inId = id,
      version: inVersion = version,
      payload = {}
    } = {}) => {
      return fireAtbdEvent({ action, payload, id: inId, version: inVersion });
    },
    [id, version, fireAtbdEvent]
  );

  return {
    // Events:
    // fev -> Fire EVent
    fevReqReview: useMemo(() => createFireEvent('request_closed_review'), [
      createFireEvent
    ]),
    fevCancelReviewReq: useMemo(
      () => createFireEvent('cancel_closed_review_request'),
      [createFireEvent]
    ),
    fevApproveReviewReq: useMemo(
      () => createFireEvent('accept_closed_review_request'),
      [createFireEvent]
    ),
    fevDenyReviewReq: useMemo(
      () => createFireEvent('deny_closed_review_request'),
      [createFireEvent]
    ),
    fevSetOwnReviewStatus: useMemo(
      () => createFireEvent('update_review_status'),
      [createFireEvent]
    ),
    fevOpenReview: useMemo(() => createFireEvent('open_review'), [
      createFireEvent
    ]),
    fevReqPublication: useMemo(() => createFireEvent('request_publication'), [
      createFireEvent
    ]),
    fevCancelPublicationReq: useMemo(
      () => createFireEvent('cancel_publication_request'),
      [createFireEvent]
    ),
    fevApprovePublicationReq: useMemo(
      () => createFireEvent('accept_publication_request'),
      [createFireEvent]
    ),
    fevDenyPublicationReq: useMemo(
      () => createFireEvent('deny_publication_request'),
      [createFireEvent]
    ),
    fevPublish: useMemo(() => createFireEvent('publish'), [createFireEvent])
  };
};

export const useAtbds = (filters = {}) => {
  const {
    getAtbds,
    fetchAtbds,
    createAtbd,
    invalidateAtbdListCtx,
    invalidateAtbdSingleCtx
  } = useSafeContextFn('useAtbds');

  return {
    invalidateAtbdListCtx,
    invalidateAtbdSingleCtx,
    atbds: getAtbds(`${filters.role || 'all'}-${filters.status || 'all'}`),
    fetchAtbds,
    createAtbd
  };
};
