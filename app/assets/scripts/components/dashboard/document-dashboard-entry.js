import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';

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
import DocumentActionsMenu from '../documents/document-actions-menu';
import DocumentGovernanceAction from '../documents/document-governance-action';
import DocumentCommentsButton from '../documents/document-comment-button';

import { documentView } from '../../utils/url-creator';
import { computeAtbdVersion } from '../../context/atbds-list';
import getDocumentIdKey from '../documents/get-document-id-key';

function DocumentDashboardEntry(props) {
  const { atbd, onDocumentAction } = props;

  const lastVersion = useMemo(
    () => computeAtbdVersion(atbd, atbd.versions.last),
    [atbd]
  );

  const onAction = useCallback(
    (menuId, payload = {}) =>
      onDocumentAction(menuId, {
        atbd: lastVersion,
        ...payload
      }),
    [onDocumentAction, lastVersion]
  );

  const onCollaboratorMenuOptionsClick = useCallback(
    () => onAction('manage-collaborators'),
    [onAction]
  );

  const onViewCommentsClick = useCallback(
    (e) => {
      e.preventDefault();
      onAction('toggle-comments');
    },
    [onAction]
  );

  return (
    <DocumentEntry>
      <DocumentEntryHeader>
        <DocumentEntryHeadline>
          <DocumentEntryHgroup>
            <DocumentEntryTitle>
              <Link
                to={documentView(atbd, lastVersion.version)}
                title={`View ${atbd.title}`}
              >
                {atbd.title}
              </Link>
            </DocumentEntryTitle>
            <DocumentEntryNav role='navigation'>
              <DocumentEntryBreadcrumbMenu>
                <li>
                  <VersionsMenu
                    atbdId={getDocumentIdKey(atbd).id}
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
                date={new Date(lastVersion.last_updated_at)}
                to={documentView(atbd)}
                title={`View ${atbd.title}`}
              />
            </li>
            <li>
              <CollaboratorsMenu
                onOptionsClick={onCollaboratorMenuOptionsClick}
                atbdId={lastVersion.id}
                version={lastVersion.version}
                triggerProps={useMemo(() => ({ size: 'small' }), [])}
              />
            </li>
            <li>
              <DocumentCommentsButton
                onClick={onViewCommentsClick}
                size='small'
                atbd={lastVersion}
              />
            </li>
          </DocumentEntryMeta>
        </DocumentEntryHeadline>
        <DocumentEntryActions>
          <DocumentGovernanceAction
            atbdId={getDocumentIdKey(lastVersion).id}
            version={lastVersion.version}
            atbd={lastVersion}
            origin='hub'
            onAction={onAction}
          />
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
