import React, { createContext, useCallback } from 'react';
import T from 'prop-types';

import { useAuthToken } from './user';
import withRequestToken from '../utils/with-request-token';
import { useContexeedApi } from '../utils/contexeed-v2';
import { emptyContactMechanismValue } from '../components/contacts/edit/contact-form-fields';
import { createContextChecker } from '../utils/create-context-checker';

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
          url: `/contacts/${id}`,
          requestOptions: {
            method: 'delete'
          },
          onDone: (finish, { state }) => {
            // The delete contact action acts on the contact list state, but
            // if called from within a single contact page, we also want to
            // invalidate the individual state.
            invalidateSingle(id);
            // If this worked, remove the item from the contact list.
            const newData = state.data?.filter?.(
              (contact) => contact.id !== id
            );
            return finish(null, newData);
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
      slicedState: true,
      requests: {
        fetchSingleContact: withRequestToken(token, ({ id }) => ({
          sliceKey: `${id}`,
          url: `/contacts/${id}`
        }))
      },
      mutations: {
        createContact: withRequestToken(token, ({ key, data } = {}) => ({
          // Holder for the creation of a new contact since we don't have final
          // id yet. When creating several contacts at once (like through the
          // atbd contact page) we need a key to differentiate between them.
          sliceKey: key ? `new-${key}` : 'new',
          url: '/contacts',
          requestOptions: {
            method: 'post',
            data: data || {
              first_name: 'New',
              last_name: 'Contact',
              mechanisms: [emptyContactMechanismValue]
            }
          },
          onDone: (finish, { data }) => {
            // Add the newly created contact to the contact list.
            contactListDispatch({
              type: 'contactList/append-contact',
              data: data
            });
            return finish();
          }
        })),
        updateContact: withRequestToken(token, ({ id: stateKeyId, data }) => {
          const { id, ...rest } = data;

          return {
            sliceKey: `${stateKeyId}`,
            url: `/contacts/${id}`,
            requestOptions: {
              method: 'post',
              data: rest
            },
            onDone: (finish, { data }) => {
              // Update the contact to the contact list.
              contactListDispatch({
                type: 'contactList/update-contact',
                data: data
              });
              return finish();
            }
          };
        })
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
const useSafeContextFn = createContextChecker(
  ContactsContext,
  'ContactsContext'
);

export const useSingleContact = ({ id }) => {
  const { getSingleContact, fetchSingleContact, updateContact } =
    useSafeContextFn('useSingleContact');

  return {
    contact: getSingleContact(`${id}`),
    fetchSingleContact: useCallback(
      () => fetchSingleContact({ id }),
      [id, fetchSingleContact]
    ),
    updateContact: useCallback(
      (data) => updateContact({ id, data }),
      [id, updateContact]
    )
  };
};

export const useContacts = () => {
  const {
    getContacts,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact
  } = useSafeContextFn('useContacts');

  return {
    contacts: getContacts(),
    fetchContacts,
    createContact,
    updateContactUnbound: updateContact,
    deleteContact
  };
};
