import React, { useCallback, useEffect } from 'react';
// import { useHistory } from 'react-router';
import { Button } from '@devseed-ui/button';
import { GlobalLoading } from '@devseed-ui/global-loading';

import App from '../../common/app';
import {
  Inpage,
  InpageHeaderSticky,
  InpageHeadline,
  InpageTitle,
  InpageActions,
  InpageBody
} from '../../../styles/inpage';
import { HubList, HubListItem } from '../../../styles/hub';
import { ContentBlock } from '../../../styles/content-block';
import ButtonSecondary from '../../../styles/button-secondary';
import ContactHubEntry from './contact-hub-entry';

import { useContacts } from '../../../context/contacts-list';
import { useUser } from '../../../context/user';
import toasts, { createProcessToast } from '../../common/toasts';
import { confirmDeleteContact } from '../../common/confirmation-prompt';
import SignIn from '../../../a11n/signin';

export function Contacts() {
  const {
    fetchContacts,
    createContact,
    deleteContact,
    contacts
  } = useContacts();

  const { isLogged } = useUser();
  // const history = useHistory();

  useEffect(() => {
    fetchContacts();
  }, []);

  // We only want to handle errors when the contact request fails. Mutation errors,
  // tracked by the `mutationStatus` property are handled in the submit
  // handlers.
  if (contacts.status === 'failed' && contacts.error) {
    // This is a serious server error. By throwing it will be caught by the
    // error boundary. There's no recovery from this error.
    throw contacts.error;
  }

  const onCreateClick = async () => {
    const processToast = createProcessToast('Creating new contact');
    const result = await createContact();

    if (result.error) {
      processToast.error(`An error occurred: ${result.error.message}`);
    } else {
      processToast.success('contact successfully created');
      // history.push(result.data.id);
    }
  };

  const onContactAction = useCallback(
    async (contact, menuId) => {
      if (menuId === 'delete') {
        const { result: confirmed } = await confirmDeleteContact(contact.title);
        if (confirmed) {
          const result = await deleteContact({ id: contact.id });
          if (result.error) {
            toasts.error(`An error occurred: ${result.error.message}`);
          } else {
            toasts.success('Contact successfully deleted');
          }
        }
      }
    },
    [deleteContact]
  );
  if (!isLogged) {
    return <SignIn />;
  }
  return (
    <App pageTitle='Contacts'>
      {contacts.status === 'loading' && <GlobalLoading />}
      <Inpage>
        <InpageHeaderSticky>
          <InpageHeadline>
            <InpageTitle>Contacts</InpageTitle>
          </InpageHeadline>
          <InpageActions>
            <ButtonSecondary
              title='Create new contact'
              useIcon='plus--small'
              onClick={onCreateClick}
            >
              Create
            </ButtonSecondary>
          </InpageActions>
        </InpageHeaderSticky>
        <InpageBody>
          <ContentBlock>
            {contacts.status === 'succeeded' && !contacts.data?.length && (
              <div>
                There are no contacts. You can start by creating one.
                <Button
                  variation='primary-raised-dark'
                  title='Create new contact'
                  useIcon='plus--small'
                  onClick={onCreateClick}
                >
                  Create
                </Button>
              </div>
            )}
            {contacts.status === 'succeeded' && contacts.data?.length && (
              <HubList>
                {contacts.data.map((contact) => (
                  <HubListItem key={contact.id}>
                    <ContactHubEntry
                      contact={contact}
                      onContactAction={onContactAction}
                    />
                  </HubListItem>
                ))}
              </HubList>
            )}
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Contacts;
