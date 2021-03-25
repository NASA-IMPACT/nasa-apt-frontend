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
          // The whole ATBD has a structure like:

          // interface ATBD {
          //   id: Number
          //   alias: String
          //   created_by: String
          //   created_at: Date
          //   title: String
          //   versions: [ATBDVersion]
          // }

          // interface ATBDVersion {
          //   status: "Draft" | "Published"
          //   published_by: String
          //   published_at: Date
          //   created_by: String
          //   created_at: Date
          //   major: Number
          //   minor: Number
          //   version: String
          //   document: ATBDDocument
          //   changelog: String
          //   doi: String
          // }

          // We keep the response from the metaInfo, and append all the fields
          // of the queried version.
          return {
            ...metaInfo.data,
            // Despite being an array it only has 1 version, the one we queried.
            ...versionInfo.data.versions[0]
          };
        }
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
