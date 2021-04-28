import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

import App from '../common/app';
import { confirmDeleteContact } from '../common/confirmation-prompt';
import toasts from '../common/toasts';
import {
  Inpage,
  InpageBody,
  InpageHeaderSticky,
  InpageActions
} from '../../styles/inpage';
import DetailsList from '../../styles/typography/details-list';
import { ContentBlock } from '../../styles/content-block';
import Prose from '../../styles/typography/prose';
import UhOh from '../uhoh';
import ContactActionsMenu from './contact-actions-menu';
import ContactNavHeader from './contact-nav-header';

import { useSingleContact } from '../../context/contacts-list';

const ContactCanvas = styled(InpageBody)`
  padding: 0;
  display: grid;
  grid-template-columns: min-content 1fr;
  height: 100%;

  > * {
    grid-row: 1;
  }
`;

const ContactContent = styled.div`
  grid-column: content-start / content-end;
  max-width: 52rem;
`;

const ContactHeader = styled.header`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2rem;
  padding-bottom: ${glsp(1.5)};

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: ${themeVal('color.baseAlphaC')};
    content: '';
    pointer-events: none;
  }
`;

const ContactTitle = styled(Heading)`
  margin: 0;
`;

const EmptySection = () => <p>No content available.</p>;

export default function ContactView() {
  const { id } = useParams();
  const history = useHistory();
  const { contact, fetchSingleContact, deleteContact } = useSingleContact({
    id
  });

  useEffect(() => {
    fetchSingleContact();
  }, [id]);

  const onContactMenuAction = useCallback(
    async (menuId) => {
      if (menuId === 'delete') {
        const { result: confirmed } = await confirmDeleteContact(
          `${contact.data?.first_name} ${contact.data?.last_name}`
        );

        if (confirmed) {
          const result = await deleteContact();
          if (result.error) {
            toasts.error(`An error occurred: ${result.error.message}`);
          } else {
            toasts.success('Contact successfully deleted');
            history.push('/contacts');
          }
        }
      }
    },
    [contact.data?.id, deleteContact, history]
  );

  // We only want to handle errors when the contact request fails. Mutation errors,
  // tracked by the `mutationStatus` property are handled in the submit
  // handlers.
  if (contact.status === 'failed') {
    const errCode = contact.error?.response.status;

    if (errCode === 400 || errCode === 404) {
      return <UhOh />;
    } else if (contact.error) {
      // This is a serious server error. By throwing it will be caught by the
      // error boundary. There's no recovery from this error.
      throw contact.error;
    }
  }
  const { status, data } = contact;
  return (
    <App pageTitle='Contact view'>
      {status === 'loading' && <GlobalLoading />}
      {status === 'succeeded' && (
        <Inpage>
          <InpageHeaderSticky data-element='inpage-header'>
            <ContactNavHeader
              contactId={data.id}
              name={`${data.first_name} ${data.last_name}`}
              mode='view'
            />
            <InpageActions>
              <ContactActionsMenu
                contact={contact.data}
                variation='achromic-plain'
                onSelect={onContactMenuAction}
              />
            </InpageActions>
          </InpageHeaderSticky>
          <ContactCanvas>
            <ContentBlock>
              <ContactContent>
                <Prose>
                  <ContactHeader>
                    <ContactTitle>
                      {data.first_name} {data.last_name}
                    </ContactTitle>
                  </ContactHeader>
                  <DetailsList>
                    <dt>First Name</dt>
                    <dd>
                      {data.first_name ? data.first_name : <EmptySection />}
                    </dd>

                    <dt>Middle Name</dt>
                    <dd>
                      {data.middle_name ? data.middle_name : <EmptySection />}
                    </dd>
                    <dt>Last Name</dt>
                    <dd>
                      {data.last_name ? data.last_name : <EmptySection />}
                    </dd>
                    <dt>Mechanisms</dt>
                    <dd>
                      {data.mechanisms ? (
                        data.mechanisms.map((mechanism) => (
                          <p key={mechanism.mechanism_type}>
                            {mechanism.mechanism_type}:{' '}
                            {mechanism.mechanism_value}
                          </p>
                        ))
                      ) : (
                        <EmptySection />
                      )}
                    </dd>
                  </DetailsList>
                </Prose>
              </ContactContent>
            </ContentBlock>
          </ContactCanvas>
        </Inpage>
      )}
    </App>
  );
}
