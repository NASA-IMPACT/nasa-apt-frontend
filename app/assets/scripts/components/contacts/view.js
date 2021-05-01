import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

import App from '../common/app';
import { confirmDeleteContact } from '../common/confirmation-prompt';
import toasts from '../common/toasts';
import { Inpage, InpageBody } from '../../styles/inpage';
import DetailsList from '../../styles/typography/details-list';
import { ContentBlock } from '../../styles/content-block';
import Prose from '../../styles/typography/prose';
import UhOh from '../uhoh';
import ContactActionsMenu from './contact-actions-menu';
import ContactNav from './contact-nav';

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
  const { contact, fetchSingleContact, deleteContact } = useSingleContact({
    id
  });

  useEffect(() => {
    fetchSingleContact();
  }, [id]);

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
          <ContactNav
            contactId={data.id}
            name={`${data.first_name} ${data.last_name}`}
            deleteContact={deleteContact}
            mode='view'
          />
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
                    <dd>{data?.first_name || <EmptySection />}</dd>
                    {data.name && (
                      <>
                        <dt>Middle Name</dt>
                        <dd>{data.name}</dd>
                      </>
                    )}
                    <dt>Last Name</dt>
                    <dd>{data?.last_name || <EmptySection />}</dd>
                    {data.uuid && (
                      <>
                        <dt>UUID</dt>
                        <dd>{data.uuid}</dd>
                      </>
                    )}
                    {data.url && (
                      <>
                        <dt>URL</dt>
                        <dd>{data.url}</dd>
                      </>
                    )}
                    {data?.mechanisms.length && (
                      <>
                        <dt>Mechanisms</dt>
                        <dd>
                          {data.mechanisms.map((mechanism) => (
                            <p key={mechanism.mechanism_type}>
                              {mechanism.mechanism_type}:{' '}
                              {mechanism.mechanism_value}
                            </p>
                          ))}
                        </dd>
                      </>
                    )}
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
