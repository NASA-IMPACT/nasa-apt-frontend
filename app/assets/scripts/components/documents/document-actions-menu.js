import React, { useMemo } from 'react';
import T from 'prop-types';

import DropdownMenu, { MenuItemReasonDisabled } from '../common/dropdown-menu';
import { Link } from '../../styles/clean/link';

import { documentEdit } from '../../utils/url-creator';
import { useUser } from '../../context/user';
import { useContextualAbility } from '../../a11n';
import { isDraftEquivalent, isPublished } from './status';

export default function DocumentActionsMenu(props) {
  const { atbd, atbdVersion, variation, size, onSelect, origin } = props;
  const { isLogged, isCurator } = useUser();
  const ability = useContextualAbility();

  const dropProps = useMemo(() => {
    // Define menu items.
    const itemViewInfo = {
      id: 'view-info',
      label: 'View info...',
      title: 'View document info'
    };
    const viewChangelog = {
      id: 'view-changelog',
      label: 'View changelog...',
      title: 'View document changelog'
    };
    const itemChangeLeading = {
      id: 'change-leading',
      label: 'Change lead author...',
      title: 'Change the document lead author'
    };
    const itemUpdateMinor = {
      id: 'update-minor',
      label: 'Update minor version...',
      title: 'Update minor version of document',
      /* eslint-disable-next-line react/display-name */
      render: (props) => {
        return (
          <MenuItemReasonDisabled
            {...props}
            isDisabled={!isPublished(atbdVersion)}
            tipMessage='Minor versions can only be updated for published documents.'
          />
        );
      }
    };
    const itemDraftMajor = {
      id: 'draft-major',
      label: 'Draft a new major version',
      title: 'Draft a new major version of document',
      /* eslint-disable-next-line react/display-name */
      render: (props) => {
        const lastVersion = atbd.versions.last;
        return (
          <MenuItemReasonDisabled
            {...props}
            isDisabled={!isPublished(lastVersion)}
            tipMessage={`A Major non published version (${lastVersion.version}) already exists.`}
          />
        );
      }
    };
    const itemEdit = {
      id: 'edit',
      label: 'Edit',
      title: 'Edit document',
      as: Link,
      to: documentEdit(atbd, atbdVersion.version)
    };
    // The delete option is in a separate menu.
    const itemDelete = {
      id: 'delete',
      title: 'Delete document',
      label: 'Delete',
      /* eslint-disable-next-line react/display-name */
      render: (props) => (
        <MenuItemReasonDisabled
          {...props}
          // A document can only be deleted:
          // - By the owner or curator when in draft
          //   Whether or not it is the owner is checked by the rules. Here we check the
          //   status to be able to show a message because disabling it in the rules
          //   would remove the button.
          isDisabled={!isDraftEquivalent(atbdVersion)}
          tipMessage='It is not possible to delete documents that are not in Draft.'
        />
      )
    };

    const triggerProps = {
      triggerProps: {
        hideText: true,
        useIcon: 'ellipsis-vertical',
        variation,
        size,
        'data-cy': 'options-trigger'
      },
      triggerLabel: 'Document options'
    };

    // Anonymous users only have one option to view the document info.
    // Return early.
    if (!isLogged) {
      return {
        ...triggerProps,
        menu: {
          id: 'actions',
          items: [itemViewInfo, viewChangelog]
        }
      };
    }

    const menuDefinition = [
      {
        id: 'actions',
        items: [
          itemViewInfo,
          viewChangelog,
          // When we are in the single edit, we don't need the edit button
          // redundancy.
          origin !== 'single-edit' &&
            ability.can('edit', atbdVersion) &&
            itemEdit,
          ability.can('change-lead-author', atbdVersion) && itemChangeLeading,
          ability.can('draft-major', atbdVersion) && itemDraftMajor,
          // Anyone that can edit the published document and update the minor
          // version.
          ability.can('edit', atbdVersion) && itemUpdateMinor
        ]
      },
      {
        id: 'actions2',
        items: [ability.can('delete', atbdVersion) && itemDelete]
      }
    ];

    // Clean the menu, removing any that has no items.
    return {
      ...triggerProps,
      menu: menuDefinition
    };
  }, [
    variation,
    size,
    atbd,
    atbdVersion,
    isLogged,
    isCurator,
    ability,
    origin
  ]);

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

DocumentActionsMenu.propTypes = {
  origin: T.string,
  onSelect: T.func,
  atbd: T.object,
  atbdVersion: T.object,
  variation: T.string,
  size: T.string
};
