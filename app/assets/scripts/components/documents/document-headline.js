import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';

import {
  InpageHeadline,
  TruncatedInpageTitle,
  InpageSubtitle,
  InpageHeadHgroup,
  InpageHeadNav,
  BreadcrumbMenu,
  InpageMeta
} from '../../styles/inpage';
import { Link } from '../../styles/clean/link';
import { DocumentStatusLink, DocumentStatusPill } from '../common/status-pill';
import DropdownMenu from '../common/dropdown-menu';
import VersionsMenu from './versions-menu';
import { DateButton } from '../common/date';
import { CollaboratorsMenu } from './collaborators-menu';
import DocumentCommentsButton from './document-comment-button';

import { useContextualAbility } from '../../a11n';
import { useUser } from '../../context/user';
import { documentEdit, documentView } from '../../utils/url-creator';
import { useCommentCenter } from '../../context/comment-center';
import getDocumentIdKey from './get-document-id-key';

// Component with the Breadcrumb navigation header for a single ATBD.
export default function DocumentHeadline(props) {
  const { atbd, mode, onAction } = props;
  const { isLogged } = useUser();
  const ability = useContextualAbility();
  const { isPanelOpen } = useCommentCenter();

  const { title, version, versions, last_updated_at } = atbd;
  const atbdIdOrAlias = getDocumentIdKey(atbd).id;
  const updatedDate = new Date(last_updated_at);

  const atbdVersion = versions.find((v) => v.version === version);

  const canEditATBD = ability.can('edit', atbdVersion);

  const documentModesMenu = useMemo(() => {
    const viewATBD = {
      id: 'view',
      label: 'Viewing',
      title: `Switch to viewing mode`,
      as: Link,
      to: documentView(atbd, version)
    };
    return {
      id: 'mode',
      selectable: true,
      items: canEditATBD
        ? [
            viewATBD,
            {
              id: 'edit',
              label: 'Editing',
              title: `Switch to editing mode`,
              as: Link,
              to: documentEdit(atbd, version)
            }
          ]
        : [viewATBD]
    };
  }, [atbd, version, canEditATBD]);

  const dropdownMenuTriggerProps = useMemo(
    () => ({
      variation: 'achromic-plain'
    }),
    []
  );

  const collaboratorsMenuTriggerProps = useMemo(
    () => ({ size: 'small', variation: 'achromic-plain' }),
    []
  );

  const onCollaboratorMenuOptionsClick = useCallback(
    () => onAction('manage-collaborators'),
    [onAction]
  );

  const onCommentsClick = useCallback(
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
    <React.Fragment>
      <InpageHeadline>
        <InpageHeadHgroup>
          <TruncatedInpageTitle>
            <Link to={documentView(atbd, version)} title={`View ${title}`}>
              {title}
            </Link>
          </TruncatedInpageTitle>
          <InpageHeadNav role='navigation'>
            <BreadcrumbMenu>
              <li>
                <VersionsMenu
                  atbdId={atbdIdOrAlias}
                  versions={versions}
                  variation='achromic-plain'
                  version={version}
                />
              </li>
              {isLogged && documentModesMenu.items.length > 1 && (
                <li>
                  <DropdownMenu
                    alignment='left'
                    direction='down'
                    menu={documentModesMenu}
                    activeItem={mode}
                    triggerProps={dropdownMenuTriggerProps}
                    withChevron
                    dropTitle='Mode'
                  />
                </li>
              )}
            </BreadcrumbMenu>
          </InpageHeadNav>
        </InpageHeadHgroup>
        {!isLogged && (
          <InpageSubtitle>
            <span>Under</span>
            <Link to='/documents' title='View all Documents'>
              Documents
            </Link>
          </InpageSubtitle>
        )}
        {isLogged && (
          <InpageMeta>
            <li>
              <DocumentStatusLink
                to={documentView(atbd, version)}
                title='View document progress tracker'
                onClick={onDocumentStatusClick}
              >
                <DocumentStatusPill atbdVersion={atbdVersion} />
              </DocumentStatusLink>
            </li>
            <li>
              <DateButton
                variation='achromic-plain'
                prefix='Updated'
                date={updatedDate}
                to={documentView(atbd, version)}
                title={`View ${title}`}
              />
            </li>
            <li>
              <CollaboratorsMenu
                onOptionsClick={onCollaboratorMenuOptionsClick}
                atbdVersion={atbdVersion}
                triggerProps={collaboratorsMenuTriggerProps}
              />
            </li>
            <li>
              <DocumentCommentsButton
                variation='achromic-plain'
                size='small'
                onClick={onCommentsClick}
                active={isPanelOpen}
                atbd={atbd}
              />
            </li>
          </InpageMeta>
        )}
      </InpageHeadline>
    </React.Fragment>
  );
}

DocumentHeadline.propTypes = {
  atbd: T.object,
  onAction: T.func,
  mode: T.string
};
