import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
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
import SignIn from '../../../a11n/signin';
import { EmptyHub } from '../../common/empty-states';

import { useContacts } from '../../../context/contacts-list';
import { useUser } from '../../../context/user';
import { createProcessToast } from '../../common/toasts';
import { contactEdit } from '../../../utils/url-creator';
import { contactDeleteConfirmAndToast } from '../contact-delete-process';

export function Contacts() {
  const {
    fetchContacts,
    createContact,
    deleteContact,
    contacts
  } = useContacts();

  const { isLogged } = useUser();
  const history = useHistory();

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
      history.push(contactEdit(result.data.id));
    }
  };

  const onContactAction = useCallback(
    async (contact, menuId) => {
      if (menuId === 'delete') {
        await contactDeleteConfirmAndToast({
          contact,
          deleteContact
        });
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
          {contacts.status === 'succeeded' && !contacts.data?.length && (
            <ContentBlock style={{ height: '100%' }}>
              <EmptyHub>
                <p>
                  It looks like the contact list is empty. Start by creating a
                  contact.
                </p>
                <Button
                  variation='primary-raised-dark'
                  title='Create new contact'
                  useIcon='plus--small'
                  onClick={onCreateClick}
                >
                  Create contact
                </Button>
              </EmptyHub>
            </ContentBlock>
          )}
          {contacts.status === 'succeeded' && contacts.data?.length && (
            <ContentBlock>
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
            </ContentBlock>
          )}
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Contacts;
