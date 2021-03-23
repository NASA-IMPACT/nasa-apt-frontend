import React, { useMemo } from 'react';
import T from 'prop-types';
import castArray from 'lodash.castarray';
import { Button } from '@devseed-ui/button';
import Dropdown, {
  DropTitle,
  DropMenu,
  DropMenuItem
} from '@devseed-ui/dropdown';

const getMenuClickHandler = (fn, menuItem) => {
  return (event) => {
    // Prevent the default action unless is a link.
    if (!menuItem.href && !menuItem.to) {
      event.preventDefault();
    }
    fn?.(menuItem.id, { menuItem, event });
  };
};

/*
Definition of a menu.

interface MenuItem {
  id: String            // Id of the menu item. Must be unique and will be used
                        // in the onSelect handler
  label: String         // Text for the menu item
  title: String         // Title prop for the menu item
  icon: String          // Icon to use. `iconified` must be true on menu
  keepOpen              // Does not close the dropdown when clicking the item
  [Other]               // All remaining props are passed to the DropMenuItem
}

interface Menu {
  id: String            // Unique id for the menu
  selectable: Boolean   // Whether or not the DropMenu is selectable
  iconified: Boolean    // Whether or not the DropMenu is iconified
  items: [MenuItem]
}
*/

/**
 * Renders a dropdown menu. It supports multiple menus, but only one element
 * selected at a time.
 *
 * @prop {string} activeItem Id of the active menu item
 * @prop {string} dropTitle Title for the dropdown box
 * @prop {object} triggerProps Additional props to add to the trigger button
 * @prop {string} triggerLabel Label for the trigger when no option is selected
 * @prop {array|object} menu List of menus according to Menu definition
 * @prop {function} onSelect Handler for when an element is selected. The event
 * will be prevented unless there's an href property set.
 */
export default function DropdownMenu(props) {
  const {
    menu: menuInput,
    activeItem,
    dropTitle,
    withChevron,
    triggerProps = {},
    triggerLabel,
    onSelect
  } = props;

  const menu = useMemo(() => castArray(menuInput), [menuInput]);

  const activeMenuItem = useMemo(() => {
    if (!activeItem) return null;
    const allItems = menu.reduce((acc, m) => acc.concat(m.items), []);
    const item = allItems.find((menuItem) => menuItem.id === activeItem);
    return item;
  }, [menu, activeItem]);

  return (
    <Dropdown
      alignment='center'
      direction='down'
      triggerElement={(props) => (
        <Button
          variation='base-plain'
          title='Open dropdown'
          useIcon={withChevron && ['chevron-down--small', 'after']}
          {...triggerProps}
          {...props}
        >
          {activeMenuItem?.label || triggerLabel}
        </Button>
      )}
    >
      <DropTitle>{dropTitle}</DropTitle>
      {menu.map((menu) => (
        <DropMenu
          key={menu.id}
          selectable={menu.selectable}
          iconified={menu.iconified}
        >
          {menu.items.map((menuItem) => {
            const { id, icon, title, label, keepOpen, ...rest } = menuItem;

            const closeProp = keepOpen
              ? {}
              : { 'data-dropdown': 'click.close' };

            return (
              <li key={id}>
                <DropMenuItem
                  useIcon={icon}
                  title={title}
                  active={id === activeMenuItem?.id}
                  {...closeProp}
                  {...rest}
                  onClick={getMenuClickHandler(onSelect, menuItem)}
                >
                  {label}
                </DropMenuItem>
              </li>
            );
          })}
        </DropMenu>
      ))}
    </Dropdown>
  );
}

DropdownMenu.propTypes = {
  menu: T.oneOfType([T.array, T.object]),
  withChevron: T.bool,
  activeItem: T.string,
  dropTitle: T.string,
  triggerProps: T.object,
  triggerLabel: T.string,
  onSelect: T.func
};
