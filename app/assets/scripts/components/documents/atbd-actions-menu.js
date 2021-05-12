import React, { useMemo } from 'react';
import T from 'prop-types';

import DropdownMenu, {
  DropMenuItemEnhanced,
  getMenuClickHandler
} from '../common/dropdown-menu';
import { Link } from '../../styles/clean/link';
import Tip from '../common/tooltip';

import { atbdEdit } from '../../utils/url-creator';
import { useUser } from '../../context/user';

export default function AtbdActionsMenu(props) {
  const { atbd, atbdVersion, variation, onSelect, origin } = props;
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
          /* eslint-disable-next-line react/display-name */
          render: (props) => (
            <DeleteMenuItem
              {...props}
              atbd={atbd}
              atbdVersion={atbdVersion}
              origin={origin}
            />
          )
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

    if (!isLogged) {
      return {
        ...triggerProps,
        menu: {
          id: 'actions',
          items: [itemViewInfo]
        }
      };
    }

    const editItemMenu = origin !== 'single-edit' ? [itemEdit] : [];

    const isAtbdDraft = atbdVersion.status.toLowerCase() === 'draft';
    if (isAtbdDraft) {
      return {
        ...triggerProps,
        menu: [
          {
            id: 'actions',
            items: [itemViewInfo, itemPublish, ...editItemMenu]
          },
          deleteMenu
        ]
      };
    }

    return {
      ...triggerProps,
      menu: [
        {
          id: 'actions',
          items: [
            itemViewInfo,
            itemUpdateMinor,
            itemDraftMajor,
            ...editItemMenu
          ]
        },
        deleteMenu
      ]
    };
  }, [variation, atbd, atbdVersion, isLogged, origin]);

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

AtbdActionsMenu.propTypes = {
  origin: T.string,
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

const DeleteMenuItem = ({
  onSelect,
  menuItem,
  atbd,
  atbdVersion,
  origin,
  ...props
}) => {
  const isPublished = atbdVersion.status.toLowerCase() === 'published';

  // The delete action on the hub, deletes the whole document, however this is
  // not possible if there are published versions. Warn the user of this case.
  // This is only relevant if the last version if not published, otherwise the
  // other message is good.
  if (origin === 'hub') {
    const hasPublished = atbd.versions.some(
      (v) => v.status.toLowerCase() === 'published'
    );
    if (hasPublished && !isPublished) {
      return (
        <Tip title='It is not possible to delete a document that has published versions. You can delete draft versions from the document page'>
          <DropMenuItemEnhanced
            disabled
            title='Delete document'
            onClick={getMenuClickHandler(onSelect, menuItem)}
            {...props}
          >
            Delete
          </DropMenuItemEnhanced>
        </Tip>
      );
    }
  }

  const item = (
    <DropMenuItemEnhanced
      disabled={isPublished}
      title='Delete document'
      onClick={getMenuClickHandler(onSelect, menuItem)}
      {...props}
    >
      Delete
    </DropMenuItemEnhanced>
  );

  return isPublished ? (
    <Tip title='It is not possible to delete a published document'>{item}</Tip>
  ) : (
    item
  );
};

DeleteMenuItem.propTypes = {
  origin: T.string,
  onSelect: T.func,
  menuItem: T.object,
  atbd: T.object,
  atbdVersion: T.object
};
