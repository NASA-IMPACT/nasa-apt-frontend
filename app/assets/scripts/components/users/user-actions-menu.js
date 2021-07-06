import React, { useMemo } from 'react';
import T from 'prop-types';

import DropdownMenu from '../common/dropdown-menu';
import { Link } from '../../styles/clean/link';

export default function UserActionsMenu({ onSelect, variation }) {
  const dropProps = useMemo(() => {
    // Define menu items.
    const itemEdit = {
      id: 'edit',
      label: 'Edit',
      title: 'Edit Account',
      as: Link,
      to: '/account/edit'
    };

    return {
      triggerProps: {
        hideText: true,
        useIcon: 'ellipsis-vertical',
        variation
      },
      triggerLabel: 'Account options',
      menu: [
        {
          id: 'actions',
          items: [itemEdit]
        }
      ]
    };
  }, [variation]);

  return (
    <DropdownMenu
      {...dropProps}
      alignment='right'
      direction='down'
      dropTitle='Options'
      onSelect={onSelect}
    />
  );
}

UserActionsMenu.propTypes = {
  onSelect: T.func,
  variation: T.string,
  contactId: T.oneOfType([T.string, T.number])
};
