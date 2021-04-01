import React, { useMemo } from 'react';
import T from 'prop-types';

import {
  InpageHeadline,
  TruncatedInpageTitle,
  InpageMeta,
  InpageHeadNav,
  BreadcrumbMenu,
  InpageSubtitle
} from '../../styles/inpage';
import { useContextualAbility } from '../../a11n';
import { Link } from '../../styles/clean/link';
import StatusPill from '../common/status-pill';
import DropdownMenu from '../common/dropdown-menu';
import VersionsMenu from './versions-menu';

import { useUser } from '../../context/user';
import { atbdEdit, atbdView } from '../../utils/url-creator';

// Component with the Breadcrumb navigation header for a single ATBD.
export default function DocumentNavHeader(props) {
  const {
    title,
    atbdId,
    status,
    version,
    mode,
    versions,
    completeness
  } = props;
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

  return (
    <>
      <InpageHeadline>
        <TruncatedInpageTitle>{title}</TruncatedInpageTitle>
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
      </InpageHeadline>
      <InpageMeta>
        <dt>Under</dt>
        <InpageSubtitle as='dd'>Documents</InpageSubtitle>
        <dt>Status</dt>
        <dd>
          <StatusPill status={status} completeness={completeness} />
        </dd>
      </InpageMeta>
    </>
  );
}

DocumentNavHeader.propTypes = {
  title: T.string,
  status: T.string,
  atbdId: T.oneOfType([T.string, T.number]),
  version: T.string,
  versions: T.array,
  mode: T.string,
  completeness: T.number
};
