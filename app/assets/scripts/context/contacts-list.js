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
    deleteFullContact
  } = useContexeedApi({
    name: 'contactList',
    requests: {
      fetchContacts: withRequestToken(token, () => ({
        url: '/contacts'
      }))
    },
    mutations: {
      deleteFullContact: withRequestToken(token, ({ id }) => ({
        mutation: async ({ axios, requestOptions, state, actions }) => {
          try {
            // Dispatch request action. It is already dispatchable.
            actions.request();

            await axios({
              ...requestOptions,
              url: `/contacts/${id}`,
              method: 'delete'
            });

            // If this worked, remove the item from the contact list.
            const newData = state.data.filter((contact) => contact.id !== id);
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
    getState: getSingleContact,
    fetchSingleContact,
    createContact,
    updateContact,
    deleteContact
  } = useContexeedApi({
    name: 'contactSingle',
    useKey: true,
    requests: {
      fetchSingleContact: withRequestToken(token, ({ id }) => ({
        stateKey: `${id}`,
        mutation: async ({ axios, requestOptions, actions }) => {
          try {
            // Dispatch request action. It is already dispatchable.
            actions.request();

            const response = await axios({
              ...requestOptions,
              url: `/contacts/${id}`,
              method: 'fetch'
            });

            // Dispatch receive action. It is already dispatchable.
            return actions.receive(response.data);
          } catch (error) {
            // Dispatch receive action. It is already dispatchable.
            return actions.receive(null, error);
          }
        }
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
      deleteContact: withRequestToken(token, ({ id }) => ({
        stateKey: `${id}`,
        mutation: async ({ axios, requestOptions, actions }) => {
          try {
            // Dispatch request action. It is already dispatchable.
            actions.request();

            await axios({
              ...requestOptions,
              url: `/contacts/${id}`,
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
  });

  const contextValue = {
    getContacts,
    fetchContacts,
    getSingleContact,
    fetchSingleContact,
    createContact,
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
  console.log('context', context);
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
    ]),
    deleteContact: useCallback(() => deleteContact({ id }), [id, deleteContact])
  };
};

export const useContacts = () => {
  const {
    getContacts,
    fetchContacts,
    createContact,
    deleteFullContact
  } = useCheckContext('useContacts');
  return {
    contacts: getContacts(),
    fetchContacts,
    createContact,
    deleteFullContact
  };
};
