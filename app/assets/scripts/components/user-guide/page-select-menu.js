import React, { useMemo } from 'react';
import T from 'prop-types';

import DropdownMenu from '../common/dropdown-menu';
import { Link } from '../../styles/clean/link';

export default function PageSelectMenu(props) {
  const { selectedPage, pagesIndex } = props;

  const pagesMenu = useMemo(() => {
    return {
      id: 'pages',
      selectable: true,
      items: pagesIndex.map((page) => ({
        id: page.id,
        label: page.title,
        title: `View page ${page.title}`,
        as: Link,
        to: `/user-guide/${page.id}`
      }))
    };
  }, [pagesIndex]);

  const dropdownMenuTriggerProps = useMemo(
    () => ({
      variation: 'achromic-plain'
    }),
    []
  );

  return (
    <DropdownMenu
      alignment='left'
      direction='down'
      menu={pagesMenu}
      activeItem={selectedPage}
      triggerProps={dropdownMenuTriggerProps}
      withChevron
      dropTitle='Pages'
    />
  );
}

PageSelectMenu.propTypes = {
  selectedPage: T.string,
  pagesIndex: T.array
};
