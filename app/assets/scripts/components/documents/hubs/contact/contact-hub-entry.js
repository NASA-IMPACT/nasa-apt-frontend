import React from 'react';
import T from 'prop-types';

import {
  HubEntry,
  HubEntryHeader,
  HubEntryHeadline,
  HubEntryTitle,
  HubEntryDetails
  // HubEntryActions
} from '../../../../styles/hub';
import { Link } from '../../../../styles/clean/link';
// import ContactActionsMenu from '../contact-actions-menu'; TODO create this?

import { contactView } from '../../../../utils/url-creator';

export default function ContactEntry({ contact }) {
  // const onAction = useCallback((...args) => onContactAction(contact, ...args), [
  //   onContactAction,
  //   contact
  // ]);
  return (
    <HubEntry>
      <HubEntryHeader>
        <HubEntryHeadline>
          <HubEntryTitle>
            <Link to={contactView(contact)} title='View document'>
              {contact.name}
            </Link>
          </HubEntryTitle>
        </HubEntryHeadline>
        <HubEntryDetails>
          <dt>Mechanisms</dt>
          <dd>{contact.mechanismsCount} contact mechanisms</dd>
          <dt>On</dt>
          <dd>
            <time dateTime={contact.createdAt}>{contact.createdAt}</time>
          </dd>
        </HubEntryDetails>
        {/* <HubEntryActions> TODO: add this once created
          <ActionsMenu contact={contact} onSelect={onAction} />
        </HubEntryActions> */}
      </HubEntryHeader>
    </HubEntry>
  );
}

ContactEntry.propTypes = {
  contact: T.object
  // onContactAction: T.func
};
