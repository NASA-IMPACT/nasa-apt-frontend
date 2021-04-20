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

export default function ContactEntry({ contact, onContactAction }) {
  const onAction = useCallback((...args) => onContactAction(contact, ...args), [
    onContactAction,
    contact
  ]);
  return (
    <HubEntry>
      <HubEntryHeader>
        <HubEntryHeadline>
          <HubEntryTitle>
            <Link to={`contact/${contact.id}`} title='View document'>
              {contact.first_name} {contact.middle_name} {contact.last_name}
            </Link>
          </HubEntryTitle>
        </HubEntryHeadline>
        <HubEntryDetails>
          <dt>Mechanisms</dt>
          <dd>{contact.mechanisms.length} contact mechanisms</dd>
          <dt>On</dt>
          <dd>
            <time dateTime={contact.createdAt}>{contact.createdAt}</time>
          </dd>
        </HubEntryDetails>
        <HubEntryActions>
          <ContactActionsMenu contact={contact} onSelect={onAction} />
        </HubEntryActions>
      </HubEntryHeader>
    </HubEntry>
  );
}

ContactEntry.propTypes = {
  contact: T.object,
  onContactAction: T.func
};
