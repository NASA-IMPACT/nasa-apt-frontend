import React, { useMemo } from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';
import { CollaboratorsMenu } from '../documents/collaborators-menu';
import {
  InpageHeadline,
  TruncatedInpageTitle,
  InpageSubtitle,
  InpageHeadHgroup,
  InpageHeadNav,
  BreadcrumbMenu,
  InpageMeta
} from '../../styles/inpage';
import { useContextualAbility } from '../../a11n';
import { Link } from '../../styles/clean/link';
import { DocumentStatusPill } from '../common/status-pill';
import DropdownMenu from '../common/dropdown-menu';
import VersionsMenu from './versions-menu';

import { useUser } from '../../context/user';
import { atbdEdit, atbdView } from '../../utils/url-creator';

// Component with the Breadcrumb navigation header for a single ATBD.
export default function DocumentHeadline(props) {
  const { title, atbdId, version, mode, versions } = props;
  const { isLogged } = useUser();
  const ability = useContextualAbility();

  const canEditATBD = ability.can('edit', 'atbd');

  const documentModesMenu = useMemo(() => {
    const viewATBD = {
      id: 'view',
      label: 'Viewing',
      title: `Switch to viewing mode`,
      as: Link,
      to: atbdView(atbdId, version)
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
              to: atbdEdit(atbdId, version)
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

  const atbdVersion = versions.find((v) => v.version === version);

  return (
    <React.Fragment>
      <InpageHeadline>
        <InpageHeadHgroup>
          <TruncatedInpageTitle>
            <Link to={atbdView(atbdId, version)} title='Link to document'>
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
              <Button
                forwardedAs={Link}
                variation='achromic-plain'
                useIcon='clock'
                to={atbdView(atbdId, version)}
                title='Link to document'
              >
                Updated <time dateTime='2021-07-14'>about 20 hours ago</time>
              </Button>
            </li>
            <li>
              <CollaboratorsMenu
                triggerProps={useMemo(
                  () => ({ variation: 'achromic-plain' }),
                  []
                )}
              />
            </li>
            <li>
              <Button
                variation='achromic-plain'
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
  mode: T.string
};
