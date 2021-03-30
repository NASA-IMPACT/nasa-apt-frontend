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

  const {
    getState: getSingleAtbd,
    fetchSingleAtbd,
    createAtbd,
    updateAtbd
  } = useContexeedApi({
    name: 'atbdSingle',
    useKey: true,
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
          // The responses of both endpoints are pretty similar. The first
          // includes the meta information (no document) of all the versions,
          // and the second includes the full document of the requested version.
          // The structure of an ATBD can be see in ./types.ts
          // We keep the response from the metaInfo, and append all the fields
          // of the queried version.
          return {
            ...metaInfo.data,
            // Despite being an array it only has 1 version, the one we queried.
            ...versionInfo.data.versions[0]
          };
        }
      })),
      createAtbd: withRequestToken(token, () => ({
        // Holder for the creation of a new ATBD since we don't have id yet.
        stateKey: 'new',
        url: '/atbds',
        options: {
          method: 'post',
          data: {
            // New ATBDS are created as Untitled. The user can change the title
            // at a later stage.
            title: 'Untitled Document'
          }
        }
      }))
    },
    mutations: {
      // Updating an ATBD is simple most of the times. The vast majority of the
      // fields belong to an ATBD version and we'd use the versions endpoint.
      // However when updating global fields like the tile or alias, we need to
      // hit a separate endpoint just for those.
      updateAtbd: withRequestToken(token, ({ id, version, data }) => ({
        stateKey: `${id}/${version}`,
        mutation: async ({ axios, requestOptions, state, actions }) => {
          try {
            const { title, alias, ...rest } = data;

            // Dispatch request action. It is already dispatchable.
            actions.request();

            const metaUpdate =
              // We have to update the title or alias and that requires a
              // different endpoint.
              title || alias
                ? axios({
                    ...requestOptions,
                    url: `/atbds/${id}`,
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
                  url: `/atbds/${id}/versions/${version}`,
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
              updatedData = {
                ...updatedData,
                // Despite being an array it only has 1 version, the one we queried.
                // See not on fetchSingleAtbd
                ...contentResponse.data.versions[0]
              };
            }

            if (metaResponse) {
              updatedData = {
                ...updatedData,
                title: metaResponse.data.title,
                alias: metaResponse.data.alias
              };
            }

            // Dispatch receive action. It is already dispatchable.
            return actions.receive(updatedData);
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
    updateAtbd
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
  const { getSingleAtbd, fetchSingleAtbd, updateAtbd } = useCheckContext(
    'useSingleAtbd'
  );

  return {
    atbd: getSingleAtbd(`${id}/${version}`),
    fetchSingleAtbd: () => fetchSingleAtbd({ id, version }),
    updateAtbd: (data) => updateAtbd({ id, version, data })
  };
};

export const useAtbds = () => {
  const { getAtbds, fetchAtbds, createAtbd } = useCheckContext('useAtbds');
  return { atbds: getAtbds(), fetchAtbds, createAtbd };
};
