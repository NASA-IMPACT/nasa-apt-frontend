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
import StatusPill from '../../common/status-pill';
import { Link } from '../../../styles/clean/link';
import VersionsMenu from '../versions-menu';
import AtbdActionsMenu from '../atbd-actions-menu';

import { atbdView } from '../../../utils/url-creator';
import { calculateAtbdCompleteness } from '../completeness';

function AtbdHubEntry(props) {
  const { atbd, onDocumentAction } = props;
  const lastVersion = atbd.versions[atbd.versions.length - 1];

  const { percent } = calculateAtbdCompleteness(lastVersion);

  const onAction = useCallback((...args) => onDocumentAction(atbd, ...args), [
    onDocumentAction,
    atbd
  ]);

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
        {lastVersion.status === 'Draft' && (
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
            <time dateTime='2021-02-07'>Feb 7, 2021</time>
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
