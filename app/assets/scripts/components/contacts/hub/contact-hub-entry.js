import React, { useCallback } from 'react';
import T from 'prop-types';

import {
  HubEntry,
  HubEntryHeader,
  HubEntryHeadline,
  HubEntryTitle,
  HubEntryDetails,
  HubEntryActions
} from '../../../styles/hub';
import { Link } from '../../../styles/clean/link';
import ContactActionsMenu from '../contact-actions-menu';

import { contactView } from '../../../utils/url-creator';

export default function ContactEntry({ contact, onContactAction }) {
  const onAction = useCallback((...args) => onContactAction(contact, ...args), [
    onContactAction,
    contact
  ]);

  const mechanismCount = contact.mechanisms.length;
  const atbdUseCount = contact.atbd_versions_link.length;

  return (
    <HubEntry>
      <HubEntryHeader>
        <HubEntryHeadline>
          <HubEntryTitle>
            <Link to={contactView(contact.id)} title='View contact'>
              {contact.first_name} {contact.middle_name} {contact.last_name}
            </Link>
          </HubEntryTitle>
        </HubEntryHeadline>
        <HubEntryDetails>
          <dt>Mechanisms</dt>
          <dd>
            {mechanismCount} contact{' '}
            {mechanismCount === 1 ? 'mechanism' : 'mechanisms'}
          </dd>
          <dt>Number of occurrences</dt>
          {atbdUseCount ? (
            <dd>
              Used on {atbdUseCount}{' '}
              {atbdUseCount === 1 ? 'document' : 'documents'}
            </dd>
          ) : (
            <dd>Not used on documents</dd>
          )}
        </HubEntryDetails>
        <HubEntryActions>
          <ContactActionsMenu contactId={contact.id} onSelect={onAction} />
        </HubEntryActions>
      </HubEntryHeader>
    </HubEntry>
  );
}

ContactEntry.propTypes = {
  contact: T.object,
  onContactAction: T.func
};
