import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Button } from '@devseed-ui/button';
import { GlobalLoading } from '@devseed-ui/global-loading';

import App from '../../../common/app';
import {
  Inpage,
  InpageHeaderSticky,
  InpageHeadline,
  InpageTitle,
  InpageActions,
  InpageBody
} from '../../../../styles/inpage';
import { HubList, HubListItem } from '../../../../styles/hub';
import { ContentBlock } from '../../../../styles/content-block';
import ButtonSecondary from '../../../../styles/button-secondary';
import ContactHubEntry from './contact-hub-entry';

import { useContacts } from '../../../../context/contacts-list';
// import { conactEdit } from '../../../../utils/url-creator'; TODO create this
import toasts, { createProcessToast } from '../../../common/toasts';
// import { confirmDeleteContact } from '../../../common/confirmation-prompt'; TODO update this to include contact

export function Contacts() {
  const {
    fetchContacts,
    createContact,
    deleteFullContact,
    contacts
  } = useContacts();
  const history = useHistory();

  useEffect(() => {
    fetchContacts();
  }, []);

  // We only want to handle errors when the atbd request fails. Mutation errors,
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
      history.push(conactEdit(result.data));
    }
  };

  const onDocumentAction = useCallback(
    async (contact, menuId) => {
      if (menuId === 'delete') {
        const { result: confirmed } = await confirmDeleteAtbd(contact.title);
        if (confirmed) {
          const result = await deleteFullContact({ id: contact.id });
          if (result.error) {
            toasts.error(`An error occurred: ${result.error.message}`);
          } else {
            toasts.success('Contact successfully deleted');
          }
        }
      }
    },
    [deleteFullContact]
  );

  return (
    <App pageTitle='Contacts'>
      {contacts.status === 'loading' && <GlobalLoading />}
      <Inpage>
        <InpageHeaderSticky>
          <InpageHeadline>
            <InpageTitle>Documents</InpageTitle>
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
                      onDocumentAction={onDocumentAction}
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
