import React, { useMemo } from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';

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
import { DocumentStatusPill } from '../common/status-pill';
import DropdownMenu from '../common/dropdown-menu';
import VersionsMenu from './versions-menu';
import { DateButton } from '../common/date';
import { CollaboratorsMenu } from './collaborators-menu';

import { useContextualAbility } from '../../a11n';
import { useUser } from '../../context/user';
import { documentEdit, documentView } from '../../utils/url-creator';

// Component with the Breadcrumb navigation header for a single ATBD.
export default function DocumentHeadline(props) {
  const { title, atbdId, version, mode, versions, updatedDate } = props;
  const { isLogged } = useUser();
  const ability = useContextualAbility();

  const atbdVersion = versions.find((v) => v.version === version);

  const canEditATBD = ability.can('edit', atbdVersion);

  const documentModesMenu = useMemo(() => {
    const viewATBD = {
      id: 'view',
      label: 'Viewing',
      title: `Switch to viewing mode`,
      as: Link,
      to: documentView(atbdId, version)
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
              to: documentEdit(atbdId, version)
            }
          ]
        : [viewATBD]
    };
  }, [atbdId, version, canEditATBD]);

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

  return (
    <React.Fragment>
      <InpageHeadline>
        <InpageHeadHgroup>
          <TruncatedInpageTitle>
            <Link to={documentView(atbdId, version)} title='Link to document'>
              {title}
            </Link>
          </TruncatedInpageTitle>
          <InpageHeadNav role='navigation'>
            <BreadcrumbMenu>
              <li>
                <VersionsMenu
                  atbdId={atbdId}
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
              <DocumentStatusPill atbdVersion={atbdVersion} />
            </li>
            <li>
              <DateButton
                variation='achromic-plain'
                prefix='Updated'
                date={updatedDate}
                to={documentView(atbdId, version)}
                title='View document'
              />
            </li>
            <li>
              <CollaboratorsMenu
                atbdVersion={atbdVersion}
                triggerProps={collaboratorsMenuTriggerProps}
              />
            </li>
            <li>
              <Button
                variation='achromic-plain'
                size='small'
                useIcon='speech-balloon'
                title='View comments'
              >
                8 comments
              </Button>
            </li>
          </InpageMeta>
        )}
      </InpageHeadline>
    </React.Fragment>
  );
}

DocumentHeadline.propTypes = {
  title: T.string,
  atbdId: T.oneOfType([T.string, T.number]),
  version: T.string,
  versions: T.array,
  updatedDate: T.object,
  mode: T.string
};
