import React, { useCallback } from 'react';
import T from 'prop-types';

import {
  HubEntry,
  HubEntryHeader,
  HubEntryHeadline,
  HubEntryTitle,
  HubEntryMeta,
  HubEntryDetails,
  HubEntryHeadNav,
  HubEntryBreadcrumbMenu,
  HubEntryActions
} from '../../../styles/hub';
import { DocumentStatusPill } from '../../common/status-pill';
import { Link } from '../../../styles/clean/link';
import VersionsMenu from '../versions-menu';
import DocumentActionsMenu from '../document-actions-menu';
import Datetime from '../../common/date';
import Tip from '../../common/tooltip';

import { atbdView } from '../../../utils/url-creator';
import { useUser } from '../../../context/user';

function DocumentHubEntry(props) {
  const { atbd, onDocumentAction } = props;
  const lastVersion = atbd.versions[atbd.versions.length - 1];
  const { isLogged } = useUser();

  const onAction = useCallback((...args) => onDocumentAction(atbd, ...args), [
    onDocumentAction,
    atbd
  ]);

  // The updated at is the most recent between the version updated at and the
  // atbd updated at.
  const updateDate = new Date(
    Math.max(
      new Date(atbd.last_updated_at).getTime(),
      new Date(lastVersion.last_updated_at).getTime()
    )
  );

  return (
    <HubEntry>
      <HubEntryHeader>
        <HubEntryHeadline>
          <HubEntryTitle>
            <Link
              to={atbdView(atbd, lastVersion.version)}
              title='View document'
            >
              {atbd.title}
            </Link>
          </HubEntryTitle>
          <HubEntryHeadNav role='navigation'>
            <HubEntryBreadcrumbMenu>
              <li>
                <VersionsMenu
                  atbdId={atbd.alias || atbd.id}
                  versions={atbd.versions}
                />
              </li>
            </HubEntryBreadcrumbMenu>
          </HubEntryHeadNav>
        </HubEntryHeadline>
        {isLogged && (
          <HubEntryMeta>
            <dt>Status</dt>
            <dd>
              <DocumentStatusPill atbdVersion={lastVersion} />
            </dd>
          </HubEntryMeta>
        )}
        <HubEntryDetails>
          <Creators creators={lastVersion.citation?.creators} />
          <dt>On</dt>
          <dd>
            <Datetime date={updateDate} />
          </dd>
        </HubEntryDetails>
        <HubEntryActions>
          <DocumentActionsMenu
            origin='hub'
            atbd={atbd}
            atbdVersion={lastVersion}
            onSelect={onAction}
          />
        </HubEntryActions>
      </HubEntryHeader>
    </HubEntry>
  );
}

DocumentHubEntry.propTypes = {
  atbd: T.object,
  onDocumentAction: T.func
};

export default DocumentHubEntry;

const Creators = ({ creators }) => {
  if (!creators) return null;

  const creatorsList = creators?.split(' and ');

  if (creatorsList.length > 1) {
    return (
      <React.Fragment>
        <dt>By</dt>
        <dd>
          <Tip title={creators}>{creatorsList[0]} et al.</Tip>
        </dd>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <dt>By</dt>
      <dd>{creators}</dd>
    </React.Fragment>
  );
};

Creators.propTypes = {
  creators: T.string
};