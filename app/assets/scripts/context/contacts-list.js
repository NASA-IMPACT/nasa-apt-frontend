import React, { createContext, useCallback, useContext } from 'react';
import T from 'prop-types';

import { useAuthToken } from './user';
import withRequestToken from '../utils/with-request-token';
import { useContexeedApi } from '../utils/contexeed';
import { emptyContactMechanismValue } from '../components/contacts/edit/contact-form-fields';

// Context
export const ContactsContext = createContext(null);

// Context provider
export const ContactsProvider = ({ children }) => {
  const { token } = useAuthToken();

  const {
    getState: getContacts,
    fetchContacts,
    deleteContact,
    dispatch: contactListDispatch
  } = useContexeedApi(
    {
      name: 'contactList',
      interceptor: (state, action) => {
        // When a new contact is created append it to the list it if is set.
        switch (action.type) {
          case 'contactList/append-contact':
            {
              const { status, data } = state;
              if (status === 'succeeded') {
                const newData = [...data, action.data].sort((a, b) =>
                  a.first_name > b.first_name ? 1 : -1
                );
                return {
                  action,
                  state: {
                    ...state,
                    data: newData
                  }
                };
              }
            }
            break;
          case 'contactList/update-contact':
            {
              const { status, data } = state;
              if (status === 'succeeded') {
                const contactIndex = data.findIndex(
                  (c) => c.id === action.data.id
                );

                if (contactIndex) {
                  return {
                    action,
                    state: {
                      ...state,
                      data: Object.assign([], data, {
                        [contactIndex]: action.data
                      })
                    }
                  };
                }
              }
            }
            break;
        }
        return { state, action };
      },
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
        createContact: withRequestToken(token, ({ key, data } = {}) => ({
          // Holder for the creation of a new contact since we don't have final
          // id yet. When creating several contacts at once (like through the
          // atbd contact page) we need a key to differentiate between them.
          stateKey: key ? `new-${key}` : 'new',
          mutation: async ({ axios, requestOptions, actions }) => {
            try {
              // Dispatch request action. It is already dispatchable.
              actions.request();

              const response = await axios({
                ...requestOptions,
                url: '/contacts',
                method: 'post',
                data: data || {
                  first_name: 'New',
                  last_name: 'Contact',
                  mechanisms: [emptyContactMechanismValue]
                }
              });

              // Add the newly created contact to the contact list.
              contactListDispatch({
                type: 'contactList/append-contact',
                data: response.data
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
          mutation: async ({ axios, requestOptions, actions }) => {
            try {
              const { id, ...rest } = data;
              // Dispatch request action. It is already dispatchable.
              actions.request();

              const response = await axios({
                ...requestOptions,
                url: `/contacts/${id}`,
                method: 'post',
                data: rest
              });

              // Update the contact to the contact list.
              contactListDispatch({
                type: 'contactList/update-contact',
                data: response.data
              });

              // Dispatch receive action. It is already dispatchable.
              return actions.receive(response.data);
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
    updateContact,
    deleteContact
  } = useCheckContext('useContacts');

  return {
    contacts: getContacts(),
    fetchContacts,
    createContact,
    updateContactUnbound: updateContact,
    deleteContact
  };
};
