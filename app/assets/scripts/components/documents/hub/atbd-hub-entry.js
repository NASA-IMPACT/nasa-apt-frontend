import React, { useCallback } from 'react';
import T from 'prop-types';
import { format } from 'date-fns';

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
import StatusPill from '../../common/status-pill';
import { Link } from '../../../styles/clean/link';
import VersionsMenu from '../versions-menu';
import AtbdActionsMenu from '../atbd-actions-menu';

import { atbdView } from '../../../utils/url-creator';
import { calculateAtbdCompleteness } from '../completeness';
import { useUser } from '../../../context/user';

function AtbdHubEntry(props) {
  const { atbd, onDocumentAction } = props;
  const lastVersion = atbd.versions[atbd.versions.length - 1];
  const { isLogged } = useUser();

  const { percent } = calculateAtbdCompleteness(lastVersion);

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
              <StatusPill status={lastVersion.status} completeness={percent} />
            </dd>
          </HubEntryMeta>
        )}
        <HubEntryDetails>
          <dt>By</dt>
          <dd>George J. Huffman et al.</dd>
          <dt>On</dt>
          <dd>
            <time dateTime={format(updateDate, 'yyyy-MM-dd')}>
              {format(updateDate, 'MMM do, yyyy')}
            </time>
          </dd>
        </HubEntryDetails>
        <HubEntryActions>
          <AtbdActionsMenu
            atbd={atbd}
            atbdVersion={lastVersion}
            onSelect={onAction}
          />
        </HubEntryActions>
      </HubEntryHeader>
    </HubEntry>
  );
}

AtbdHubEntry.propTypes = {
  atbd: T.object,
  onDocumentAction: T.func
};

export default AtbdHubEntry;
