import React, { useMemo } from 'react';
import T from 'prop-types';

import DropdownMenu from '../common/dropdown-menu';
import { Link } from '../../styles/clean/link';

import { contactEdit } from '../../utils/url-creator';

export default function ContactActionsMenu({ contactId, onSelect, variation }) {
  const dropProps = useMemo(() => {
    // Define menu items.
    const itemEdit = {
      id: 'edit',
      label: 'Edit',
      title: 'Edit contact',
      as: Link,
      to: contactEdit(contactId)
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
        variation,
        'data-cy': `contact-trigger-${contactId}`
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
  }, [contactId, variation]);

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
  variation: T.string,
  contactId: T.oneOfType([T.string, T.number])
};
