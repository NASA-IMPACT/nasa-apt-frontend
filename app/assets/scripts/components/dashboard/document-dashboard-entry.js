import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';

import { DocumentStatusPill } from '../common/status-pill';
import { Link } from '../../styles/clean/link';
import VersionsMenu from '../documents/versions-menu';
import { DateButton } from '../common/date';
import { CollaboratorsMenu } from '../documents/collaborators-menu';
import {
  DocumentEntry,
  DocumentEntryActions,
  DocumentEntryBreadcrumbMenu,
  DocumentEntryHeader,
  DocumentEntryHeadline,
  DocumentEntryHgroup,
  DocumentEntryNav,
  DocumentEntryMeta,
  DocumentEntryTitle
} from '../../styles/documents/list';
import ContextualDocAction from './document-item-ctx-action';
import DocumentActionsMenu from '../documents/document-actions-menu';

import { documentView } from '../../utils/url-creator';
import { documentUpdatedDate } from '../../utils/date';
import { computeAtbdVersion } from '../../context/atbds-list';

function DocumentDashboardEntry(props) {
  const { atbd, onDocumentAction } = props;
  const lastVersion = atbd.versions.last;

  const onAction = useCallback(
    (menuId, payload = {}) =>
      onDocumentAction(menuId, {
        atbd: computeAtbdVersion(atbd, lastVersion),
        ...payload
      }),
    [onDocumentAction, lastVersion, atbd]
  );

  const onCollaboratorMenuOptionsClick = useCallback(
    () => onAction('manage-collaborators'),
    [onAction]
  );

  // The updated at is the most recent between the version updated at and the
  // atbd updated at.
  const updateDate = documentUpdatedDate(atbd, lastVersion);

  return (
    <DocumentEntry>
      <DocumentEntryHeader>
        <DocumentEntryHeadline>
          <DocumentEntryHgroup>
            <DocumentEntryTitle>
              <Link
                to={documentView(atbd, lastVersion.version)}
                title='View document'
              >
                {atbd.title}
              </Link>
            </DocumentEntryTitle>
            <DocumentEntryNav role='navigation'>
              <DocumentEntryBreadcrumbMenu>
                <li>
                  <VersionsMenu
                    atbdId={atbd.alias || atbd.id}
                    versions={atbd.versions}
                    size='small'
                  />
                </li>
              </DocumentEntryBreadcrumbMenu>
            </DocumentEntryNav>
          </DocumentEntryHgroup>
          <DocumentEntryMeta>
            <li>
              <DocumentStatusPill atbdVersion={lastVersion} />
            </li>
            <li>
              <DateButton
                prefix='Updated'
                date={updateDate}
                to={documentView(atbd)}
                title='View document'
              />
            </li>
            <li>
              <CollaboratorsMenu
                onOptionsClick={onCollaboratorMenuOptionsClick}
                atbdVersion={lastVersion}
                triggerProps={useMemo(() => ({ size: 'small' }), [])}
              />
            </li>
            <li>
              <Button
                forwardedAs={Link}
                size='small'
                useIcon='speech-balloon'
                to='/'
                title='View comments'
              >
                8 comments
              </Button>
            </li>
          </DocumentEntryMeta>
        </DocumentEntryHeadline>
        <DocumentEntryActions>
          <ContextualDocAction action='approve-review' />
          <DocumentActionsMenu
            origin='hub'
            size='small'
            atbd={atbd}
            atbdVersion={lastVersion}
            onSelect={onAction}
          />
        </DocumentEntryActions>
      </DocumentEntryHeader>
    </DocumentEntry>
  );
}

DocumentDashboardEntry.propTypes = {
  atbd: T.object,
  onDocumentAction: T.func
};

export default DocumentDashboardEntry;
