import React, { useMemo } from 'react';
import T from 'prop-types';

import DropdownMenu, {
  DropMenuItemEnhanced,
  getMenuClickHandler
} from '../common/dropdown-menu';
import { Link } from '../../styles/clean/link';

import { atbdEdit } from '../../utils/url-creator';
import { useUser } from '../../context/user';
import Tip from '../common/tooltip';

export default function AtbdActionsMenu(props) {
  const { atbd, atbdVersion, variation, onSelect } = props;
  const { isLogged } = useUser();

  const dropProps = useMemo(() => {
    // Define menu items.
    const itemViewInfo = {
      id: 'view-info',
      label: 'View info...',
      title: 'View document info'
    };
    const itemUpdateMinor = {
      id: 'update-minor',
      label: 'Update minor version...',
      title: 'Update minor version of document'
    };
    const itemDraftMajor = {
      id: 'draft-major',
      /* eslint-disable-next-line react/display-name */
      render: (props) => <DraftMajorMenuItem {...props} atbd={atbd} />
    };
    const itemEdit = {
      id: 'edit',
      label: 'Edit',
      title: 'Edit document',
      as: Link,
      to: atbdEdit(atbd, atbdVersion.version)
    };
    const itemPublish = {
      id: 'publish',
      label: 'Publish...',
      title: 'Publish document'
    };

    // The delete option is in a separate menu.
    const deleteMenu = {
      id: 'actions2',
      items: [
        {
          id: 'delete',
          label: 'Delete',
          title: 'Delete document'
        }
      ]
    };

    const triggerProps = {
      triggerProps: {
        hideText: true,
        useIcon: 'ellipsis-vertical',
        variation
      },
      triggerLabel: 'ATBD options'
    };

    const isAtbdDraft = atbdVersion.status.toLowerCase() === 'draft';

    if (!isLogged) {
      return {
        ...triggerProps,
        menu: {
          id: 'actions',
          items: [itemViewInfo]
        }
      };
    }

    return {
      ...triggerProps,
      menu: isAtbdDraft
        ? [
            {
              id: 'actions',
              items: [itemViewInfo, itemPublish, itemEdit]
            },
            deleteMenu
          ]
        : [
            {
              id: 'actions',
              items: [itemViewInfo, itemUpdateMinor, itemDraftMajor, itemEdit]
            },
            deleteMenu
          ]
    };
  }, [variation, atbd, atbdVersion, isLogged]);

  return (
    <DropdownMenu {...dropProps} dropTitle='Options' onSelect={onSelect} />
  );
}

AtbdActionsMenu.propTypes = {
  onSelect: T.func,
  atbd: T.object,
  atbdVersion: T.object,
  variation: T.string
};

const DraftMajorMenuItem = ({ onSelect, menuItem, atbd, ...props }) => {
  const lastVersion = atbd.versions.last;
  const isLastDraft = lastVersion.status.toLowerCase() === 'draft';

  const item = (
    <DropMenuItemEnhanced
      disabled={isLastDraft}
      title='Draft a new major version of document'
      onClick={getMenuClickHandler(onSelect, menuItem)}
      {...props}
    >
      Draft a new major version
    </DropMenuItemEnhanced>
  );

  // There can only be 1 major draft version.
  return isLastDraft ? (
    <Tip
      title={`A Major draft version (${lastVersion.version}) already exists.`}
    >
      {item}
    </Tip>
  ) : (
    item
  );
};

DraftMajorMenuItem.propTypes = {
  onSelect: T.func,
  menuItem: T.object,
  atbd: T.object
};
