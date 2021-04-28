import React, { useMemo } from 'react';
import T from 'prop-types';

import { contactEdit } from '../../utils/url-creator';
import DropdownMenu from '../common/dropdown-menu';
import { Link } from '../../styles/clean/link';

export default function ContactActionsMenu({ contact, onSelect, variation }) {
  const dropProps = useMemo(() => {
    // Define menu items.
    const itemEdit = {
      id: 'edit',
      label: 'Edit',
      title: 'Edit contact',
      as: Link,
      to: contactEdit(contact.id)
    };

    // The delete option is in a separate menu.
    const deleteMenu = {
      id: 'actions2',
      items: [
        {
          id: 'delete',
          label: 'Delete',
          title: 'Delete contact'
        }
      ]
    };

    const triggerProps = {
      triggerProps: {
        hideText: true,
        useIcon: 'ellipsis-vertical',
        variation
      },
      triggerLabel: 'Contact options'
    };

    return {
      ...triggerProps,
      menu: [
        {
          id: 'actions',
          items: [itemEdit]
        },
        deleteMenu
      ]
    };
  }, [contact, variation]);

  return (
    <DropdownMenu {...dropProps} dropTitle='Options' onSelect={onSelect} />
  );
}

ContactActionsMenu.propTypes = {
  onSelect: T.func,
  variation: T.string,
  contact: T.object
};
