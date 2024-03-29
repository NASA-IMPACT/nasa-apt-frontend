import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';
import { VerticalDivider } from '@devseed-ui/toolbar';
import { BsFilePdf } from 'react-icons/bs';

import { Can } from '../../a11n';
import { DocumentStatusLink, DocumentStatusPill } from '../common/status-pill';
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
import { resolveTitle } from '../../utils/common';

function DocumentDashboardEntry(props) {
  const { atbd, onDocumentAction } = props;
  const pdfMode = atbd?.document_type === 'PDF';

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

  const onDocumentStatusClick = useCallback(
    (e) => {
      e.preventDefault();
      onAction('view-tracker');
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
                {resolveTitle(atbd.title)}
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
            {atbd.document_type === 'PDF' && (
              <BsFilePdf title='PDF type document' />
            )}
          </DocumentEntryHgroup>
          <DocumentEntryMeta>
            <li>
              <DocumentStatusLink
                to={documentView(atbd)}
                title='View document progress tracker'
                onClick={onDocumentStatusClick}
              >
                <DocumentStatusPill
                  atbdVersion={lastVersion}
                  pdfMode={pdfMode}
                />
              </DocumentStatusLink>
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
                atbdVersion={lastVersion}
                triggerProps={useMemo(() => ({ size: 'small' }), [])}
              />
            </li>
            <Can do='access-comments' on={lastVersion}>
              <li>
                <DocumentCommentsButton
                  onClick={onViewCommentsClick}
                  size='small'
                  atbd={lastVersion}
                />
              </li>
            </Can>
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
          <VerticalDivider />
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
