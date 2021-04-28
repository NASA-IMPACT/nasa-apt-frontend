import React, { useMemo } from 'react';
import T from 'prop-types';

import { contactEdit } from '../../utils/url-creator';
import DropdownMenu from '../common/dropdown-menu';
import { Link } from '../../styles/clean/link';

export default function ContactActionsMenu({ contact, onSelect }) {
  const dropProps = useMemo(() => {
    // Define menu items.
    const itemEdit = {
      id: 'edit',
      label: 'Edit',
      title: 'Edit contact',
      as: Link,
      to: contactEdit(contact.id)
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
        items: [itemEdit]
      }
    };
  }, [contact]);

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

ContactActionsMenu.propTypes = {
  onSelect: T.func,
  contact: T.object
};
