import React, { createContext, useCallback, useContext } from 'react';
import T from 'prop-types';

import { useAuthToken } from './user';
import withRequestToken from '../utils/with-request-token';
import { useContexeedApi } from '../utils/contexeed';

// Context
export const ContactsContext = createContext(null);

// Context provider
export const ContactsProvider = ({ children }) => {
  const { token } = useAuthToken();

  const {
    getState: getContacts,
    fetchContacts,
    deleteContact
  } = useContexeedApi(
    {
      name: 'contactList',
      requests: {
        fetchContacts: withRequestToken(token, () => ({
          url: '/contacts'
        }))
      },
      mutations: {
        deleteContact: withRequestToken(token, ({ id }) => ({
          mutation: async ({ axios, requestOptions, state, actions }) => {
            try {
              // Dispatch request action. It is already dispatchable.
              actions.request();

              await axios({
                ...requestOptions,
                url: `/contacts/${id}`,
                method: 'delete'
              });

              // The delete contact action acts on the contact list state, but
              // if called from within a single contact page, we also want to
              // invalidate the individual state.
              invalidateSingle(id);

              // If this worked, remove the item from the contact list.
              const newData = state.data?.filter?.(
                (contact) => contact.id !== id
              );
              return actions.receive(newData);
            } catch (error) {
              // Dispatch receive action. It is already dispatchable.
              return actions.receive(null, error);
            }
          }
        }))
      }
    },
    [token]
  );

  const {
    getState: getSingleContact,
    fetchSingleContact,
    createContact,
    updateContact,
    invalidate: invalidateSingle
  } = useContexeedApi(
    {
      name: 'contactSingle',
      useKey: true,
      requests: {
        fetchSingleContact: withRequestToken(token, ({ id }) => ({
          stateKey: `${id}`,
          url: `/contacts/${id}`
        }))
      },
      mutations: {
        createContact: withRequestToken(token, () => ({
          // Holder for the creation of a new contact since we don't have id yet.
          stateKey: 'new',
          mutation: async ({ axios, requestOptions, actions }) => {
            try {
              // Dispatch request action. It is already dispatchable.
              actions.request();

              const response = await axios({
                ...requestOptions,
                url: '/contacts',
                method: 'post'
              });

              // Dispatch receive action. It is already dispatchable.
              return actions.receive(response.data);
            } catch (error) {
              // Dispatch receive action. It is already dispatchable.
              return actions.receive(null, error);
            }
          }
        })),
        updateContact: withRequestToken(token, ({ id, data }) => ({
          stateKey: `${id}`,
          mutation: async ({ axios, requestOptions, state, actions }) => {
            try {
              const { id, ...rest } = data;
              // Dispatch request action. It is already dispatchable.
              actions.request();

              await axios({
                ...requestOptions,
                url: `/contacts/${id}`,
                method: 'post',
                data: rest
              });

              // Dispatch receive action. It is already dispatchable.
              const updateResult = actions.receive(state.data);
              return { ...updateResult };
            } catch (error) {
              // Dispatch receive action. It is already dispatchable.
              return actions.receive(null, error);
            }
          }
        }))
      }
    },
    [token]
  );

  const contextValue = {
    getContacts,
    fetchContacts,
    getSingleContact,
    fetchSingleContact,
    createContact,
    deleteContact,
    updateContact
  };

  return (
    <ContactsContext.Provider value={contextValue}>
      {children}
    </ContactsContext.Provider>
  );
};

ContactsProvider.propTypes = {
  children: T.node
};

// Context consumers.
// Used to access different parts of the contact list context
const useCheckContext = (fnName) => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <ContactsContext> component's context.`
    );
  }

  return context;
};

export const useSingleContact = ({ id }) => {
  const {
    getSingleContact,
    fetchSingleContact,
    updateContact
  } = useCheckContext('useSingleContact');

  return {
    contact: getSingleContact(`${id}`),
    fetchSingleContact: useCallback(() => fetchSingleContact({ id }), [
      id,
      fetchSingleContact
    ]),
    updateContact: useCallback((data) => updateContact({ id, data }), [
      id,
      updateContact
    ])
  };
};

export const useContacts = () => {
  const {
    getContacts,
    fetchContacts,
    createContact,
    deleteContact
  } = useCheckContext('useContacts');

  return {
    contacts: getContacts(),
    fetchContacts,
    createContact,
    deleteContact
  };
};
