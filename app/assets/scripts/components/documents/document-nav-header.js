import React, { useMemo } from 'react';
import T from 'prop-types';

import {
  InpageHeadline,
  InpageTitle,
  InpageMeta,
  InpageHeadNav,
  BreadcrumbMenu,
  InpageSubtitle
} from '../../styles/inpage';
import { Link, NavLink } from '../../styles/clean/link';
import StatusPill from '../common/status-pill';
import DropdownMenu from '../common/dropdown-menu';

export default function DocumentNavHeader(props) {
  const { title, atbdId, status, currentVersion, mode, versions } = props;

  const documentModesMenu = useMemo(
    () => ({
      id: 'mode',
      selectable: true,
      items: [
        {
          id: 'view',
          label: 'Viewing',
          title: `Switch to viewing mode`,
          as: NavLink,
          to: `/documents/${atbdId}/${currentVersion}`
        },
        {
          id: 'edit',
          label: 'Editing',
          title: `Switch to editing mode`,
          as: NavLink,
          to: `/documents/${atbdId}/${currentVersion}/edit`
        }
      ]
    }),
    [atbdId, currentVersion]
  );

  const atbdVersions = [...versions].reverse();

  const versionMenu = useMemo(
    () => ({
      id: 'versions',
      selectable: true,
      items: atbdVersions.map((v) => ({
        id: v.version,
        label: v.version,
        title: `View ${v.version} page`,
        as: Link,
        to: `/documents/${atbdId}/${v.version}`
      }))
    }),
    [atbdId, atbdVersions]
  );

  const dropdownMenuTriggerProps = useMemo(
    () => ({
      variation: 'achromic-plain'
    }),
    []
  );

  return (
    <>
      <InpageHeadline>
        <InpageTitle>{title}</InpageTitle>
        <InpageHeadNav role='navigation'>
          <BreadcrumbMenu>
            <li>
              <DropdownMenu
                menu={versionMenu}
                activeItem={currentVersion}
                triggerProps={dropdownMenuTriggerProps}
                withChevron
                dropTitle='Version'
              />
            </li>
            <li>
              <DropdownMenu
                menu={documentModesMenu}
                activeItem={mode}
                triggerProps={dropdownMenuTriggerProps}
                withChevron
                dropTitle='Mode'
              />
            </li>
          </BreadcrumbMenu>
        </InpageHeadNav>
      </InpageHeadline>
      <InpageMeta>
        <dt>Under</dt>
        <InpageSubtitle as='dd'>Documents</InpageSubtitle>
        <dt>Status</dt>
        <dd>
          <StatusPill status={status} completeness={80} />
        </dd>
      </InpageMeta>
    </>
  );
}

DocumentNavHeader.propTypes = {
  title: T.string,
  status: T.string,
  atbdId: T.string,
  currentVersion: T.string,
  versions: T.array,
  mode: T.string
};
