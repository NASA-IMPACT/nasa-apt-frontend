import React, { useMemo } from 'react';
import T from 'prop-types';

import DropdownMenu from '../common/dropdown-menu';
import { Link } from '../../styles/clean/link';

export default function ContactActionsMenu({ contact, onSelect }) {
  const dropProps = useMemo(() => {
    // Define menu items.
    const itemViewInfo = {
      id: 'view-info',
      label: 'View info...',
      title: 'View contact info',
      as: Link,
      to: `contact/${contact.id}`
    };
    const itemEdit = {
      id: 'edit',
      label: 'Edit',
      title: 'Edit contact',
      as: Link,
      to: `contact/${contact.id}/edit`
    };
    const itemDelete = {
      id: 'delete',
      label: 'Delete',
      title: 'Delete contact'
    };

    const triggerProps = {
      triggerProps: {
        hideText: true,
        useIcon: 'ellipsis-vertical'
      },
      triggerLabel: 'Contact options'
    };

    return {
      ...triggerProps,
      menu: {
        id: 'actions',
        items: [itemViewInfo, itemEdit, itemDelete]
      }
    };
  }, [contact]);

  return (
    <DropdownMenu {...dropProps} dropTitle='Options' onSelect={onSelect} />
  );
}

ContactActionsMenu.propTypes = {
  onSelect: T.func,
  contact: T.object
};
