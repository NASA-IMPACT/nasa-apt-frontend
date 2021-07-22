import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Heading } from '@devseed-ui/typography';

import {
  HubList,
  HubListItem,
  HubEntry,
  HubEntryHeader,
  HubEntryHeadline,
  HubEntryTitle,
  HubEntryHeadNav,
  HubEntryBreadcrumbMenu,
  HubEntryDetails
} from '../../../styles/hub';

import { documentView } from '../../../utils/url-creator';
import { renderMultipleRoles } from '../contact-utils';

const ContactRelated = styled.section`
  grid-column: content-start / content-end;
`;

export default function ContactRelatedDocuments(props) {
  const { related } = props;

  if (!related.length) return null;

  return (
    <ContactRelated>
      <Heading as='h2'>Appears on</Heading>
      <HubList>
        {related.map(({ roles, atbd_version }) => (
          <HubListItem key={`${atbd_version.atbd.id}-${atbd_version.version}`}>
            <RelatedAtbdEntry atbdVersion={atbd_version} roles={roles} />
          </HubListItem>
        ))}
      </HubList>
    </ContactRelated>
  );
}

ContactRelatedDocuments.propTypes = {
  related: T.array
};

const RelatedAtbdEntry = (props) => {
  const { atbdVersion, roles } = props;
  const { title } = atbdVersion.atbd;

  return (
    <HubEntry>
      <HubEntryHeader>
        <HubEntryHeadline>
          <HubEntryTitle>
            <Link
              to={documentView(atbdVersion.atbd, atbdVersion.version)}
              title='View document'
            >
              {title}
            </Link>
          </HubEntryTitle>
          <HubEntryHeadNav role='navigation'>
            <HubEntryBreadcrumbMenu>
              <li>
                <strong>{atbdVersion.version}</strong>
              </li>
            </HubEntryBreadcrumbMenu>
          </HubEntryHeadNav>
        </HubEntryHeadline>
        {!!roles.length && (
          <HubEntryDetails>
            <dt>Roles</dt>
            <dd>As {renderMultipleRoles(roles)}</dd>
          </HubEntryDetails>
        )}
      </HubEntryHeader>
    </HubEntry>
  );
};

RelatedAtbdEntry.propTypes = {
  atbdVersion: T.object,
  roles: T.array
};
