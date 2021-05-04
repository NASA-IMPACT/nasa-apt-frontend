import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

import App from '../../common/app';
import {
  Inpage,
  InpageBody,
  InpageHeaderSticky,
  InpageActions
} from '../../../styles/inpage';
import DetailsList from '../../../styles/typography/details-list';
import { ContentBlock } from '../../../styles/content-block';
import Prose from '../../../styles/typography/prose';
import UhOh from '../../uhoh';
import ContactActionsMenu from '../contact-actions-menu';

import { useContacts, useSingleContact } from '../../../context/contacts-list';
import { contactDeleteConfirmAndToast } from '../contact-delete-process';
import ContactNavHeader from '../contact-nav-header';

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

export default function ContactView() {
  const { id } = useParams();
  const history = useHistory();

  const { deleteContact } = useContacts();
  const { contact, fetchSingleContact } = useSingleContact({
    id
  });

  useEffect(() => {
    fetchSingleContact();
  }, [id]);

  const onContactMenuAction = useCallback(
    async (menuId) => {
      if (menuId === 'delete') {
        await contactDeleteConfirmAndToast({
          contact: contact.data,
          deleteContact,
          history
        });
      }
    },
    [contact.data, deleteContact, history]
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
                contactId={data.id}
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
                      {data.first_name} {data.middle_name} {data.last_name}
                    </ContactTitle>
                  </ContactHeader>
                  <DetailsList>
                    <dt>First Name</dt>
                    <dd>{data.first_name}</dd>
                    {data.middle_name && (
                      <>
                        <dt>Middle Name</dt>
                        <dd>{data.middle_name}</dd>
                      </>
                    )}
                    <dt>Last Name</dt>
                    <dd>{data.last_name}</dd>
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
                    {!!data?.mechanisms.length && (
                      <>
                        <dt>Mechanisms</dt>
                        <dd>
                          {data.mechanisms.map((mechanism, i) => (
                            // Nothing will cause the order to change on this
                            // page. Array keys are safe.
                            /* eslint-disable-next-line react/no-array-index-key */
                            <p key={`${mechanism.mechanism_type}-${i}`}>
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
