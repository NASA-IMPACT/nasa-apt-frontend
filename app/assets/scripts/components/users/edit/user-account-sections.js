import React, { useMemo } from 'react';
import T from 'prop-types';

import DropdownMenu from '../../common/dropdown-menu';
import { Link } from '../../../styles/clean/link';
import { SECTIONS } from './sections';

export default function UserAccountSections({ section }) {
  const dropProps = useMemo(
    () => ({
      triggerProps: {
        variation: 'achromic-plain'
      },
      triggerLabel: 'Sections',
      menu: [
        {
          id: 'actions',
          items: SECTIONS.map((section) => ({
            id: section.id,
            label: section.label,
            title: `View ${section.label} settings`,
            as: Link,
            to: `/account/edit/${section.id}`
          }))
        }
      ]
    }),
    []
  );

  return (
    <DropdownMenu
      {...dropProps}
      alignment='right'
      direction='down'
      dropTitle='Sections'
      activeItem={section}
      withChevron
    />
  );
}

UserAccountSections.propTypes = {
  section: T.string
};
