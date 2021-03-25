import React, { useMemo } from 'react';
import T from 'prop-types';

import DropdownMenu from '../common/dropdown-menu';
import { Link } from '../../styles/clean/link';

export default function VersionsMenu(props) {
  const { atbdId, versions, variation, currentVersion } = props;

  const dropProps = useMemo(() => {
    const atbdVersions = [...versions].reverse();
    const lastVersion = atbdVersions[0];

    const versionMenu = {
      id: 'versions',
      selectable: !!currentVersion,
      items: atbdVersions.map((v) => ({
        id: v.version,
        label: v.version,
        title: `View ${v.version} page`,
        as: Link,
        to: `/documents/${atbdId}/${v.version}`
      }))
    };

    return {
      menu: versionMenu,
      triggerProps: {
        variation
      },
      // If we have a current version pass that to make the menu selectable.
      activeItem: currentVersion,
      // Otherwise provide the last one as the label.
      triggerLabel: !currentVersion ? lastVersion.version : undefined
    };
  }, [atbdId, versions, variation, currentVersion]);

  return versions.length === 1 ? (
    <strong>{versions[0].version}</strong>
  ) : (
    <DropdownMenu {...dropProps} withChevron dropTitle='Version' />
  );
}

VersionsMenu.propTypes = {
  atbdId: T.string,
  versions: T.array,
  variation: T.string,
  currentVersion: T.string
};
