import React, { useMemo } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import castArray from 'lodash.castarray';
import { Button } from '@devseed-ui/button';
import Dropdown, {
  DropTitle,
  DropMenu,
  DropMenuItem
} from '@devseed-ui/dropdown';
import { disabled, themeVal, rgba, glsp } from '@devseed-ui/theme-provider';
import ShadowScrollbar from '@devseed-ui/shadow-scrollbar';

import Try from './try-render';

/**
 * Override Dropdown styles to play well with the shadow scrollbar.
 */
const DropdownWithScroll = styled(Dropdown)`
  padding: 0;

  ${DropTitle} {
    margin: 0;
    padding: ${glsp(1, 1, 0, 1)};
  }

  ${DropMenu} {
    margin: 0;
  }
`;

export const DropMenuItemEnhanced = styled(DropMenuItem)`
  ${({ focused }) =>
    focused &&
    css`
      color: ${themeVal('color.link')};
      background-color: ${rgba(themeVal('color.link'), 0.12)};
      opacity: 1;
    `}

  ${({ active }) =>
    active &&
    css`
      &,
      &:visited {
        background-color: ${rgba(themeVal('color.link'), 0.08)};
        color: ${themeVal('color.link')};
      }

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 0.25rem;
        height: 100%;
        background: ${themeVal('color.link')};
        content: '';
        pointer-events: none;
      }

      &::after {
        display: none;
      }
    `}

  ${({ disabled: d }) =>
    d &&
    css`
      ${disabled()};
    `}
`;

export const getMenuClickHandler = (fn, menuItem) => {
  return (event) => {
    // Prevent the default action unless is a link.
    if (!menuItem.href && !menuItem.to) {
      event.preventDefault();
    }
    fn?.(menuItem.id, { menuItem, event });
  };
};

const shadowScrollbarProps = {
  autoHeight: true,
  autoHeightMax: 320
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
 * @prop {string|function} triggerLabel Label for the trigger when no option is
 * selected. If a function is used it allows for custom rendering
 * @prop {array|object} menu List of menus according to Menu definition
 * @prop {function} onSelect Handler for when an element is selected. The event
 * will be prevented unless there's an href property set.
 */
const DropdownMenu = React.forwardRef((props, ref) => {
  const {
    className,
    menu: menuInput,
    activeItem,
    dropTitle,
    withChevron,
    triggerProps = {},
    triggerLabel,
    onSelect,
    alignment,
    direction
  } = props;

  // Normalize menu, adding the menu Id to each item. This is useful for referencing.
  const dropMenu = useMemo(() => {
    const arrayMenu = castArray(menuInput);
    // Map menu items adding menu id and removing empty.
    return arrayMenu
      .map((menu) => {
        const menuItems = menu.items
          .filter(Boolean)
          .map((item) => ({ ...item, menuId: menu.id }));
        // If there are no items remove the menu altogether.
        return menuItems.length
          ? {
              ...menu,
              items: menuItems
            }
          : null;
      })
      .filter(Boolean);
  }, [menuInput]);

  const activeMenuItems = useMemo(() => {
    const active = castArray(activeItem);
    const allItems = dropMenu.flatMap((m) => m.items);
    const items = allItems.filter((menuItem) => active.includes(menuItem.id));
    return items;
  }, [dropMenu, activeItem]);

  const getLabel = () => {
    if (typeof triggerLabel === 'function') {
      return triggerLabel(activeMenuItems);
    }

    if (activeMenuItems.length) {
      return activeMenuItems.map((i) => i.label).join(' & ');
    }

    return triggerLabel;
  };

  const isItemActive = (id) => {
    return activeMenuItems.some((i) => i.id === id);
  };

  return (
    <DropdownWithScroll
      ref={ref}
      className={className}
      alignment={alignment}
      direction={direction}
      triggerElement={(props) => (
        <Button
          variation='base-plain'
          title='Open dropdown'
          useIcon={withChevron && ['chevron-down--small', 'after']}
          {...triggerProps}
          {...props}
        >
          {getLabel()}
        </Button>
      )}
    >
      <ShadowScrollbar scrollbarsProps={shadowScrollbarProps}>
        <DropTitle>{dropTitle}</DropTitle>
        {dropMenu.map((menu) => (
          <DropMenu
            key={menu.id}
            selectable={menu.selectable}
            iconified={menu.iconified}
          >
            {menu.items.map((menuItem) => {
              const {
                id,
                icon,
                title,
                label,
                keepOpen,
                render,
                /* eslint-disable-next-line no-unused-vars */
                menuId, // Remove from the arg spreading.
                ...rest
              } = menuItem;

              const closeProp = keepOpen
                ? {}
                : { 'data-dropdown': 'click.close' };

              const itemProps = {
                active: isItemActive(id),
                ...closeProp
              };

              return (
                <li key={id}>
                  <Try
                    fn={render}
                    {...itemProps}
                    menuItem={menuItem}
                    onSelect={onSelect}
                  >
                    <DropMenuItemEnhanced
                      useIcon={icon}
                      title={title}
                      {...itemProps}
                      {...rest}
                      onClick={getMenuClickHandler(onSelect, menuItem)}
                    >
                      {label}
                    </DropMenuItemEnhanced>
                  </Try>
                </li>
              );
            })}
          </DropMenu>
        ))}
      </ShadowScrollbar>
    </DropdownWithScroll>
  );
});

DropdownMenu.propTypes = {
  className: T.string,
  menu: T.oneOfType([T.array, T.object]),
  withChevron: T.bool,
  activeItem: T.oneOfType([T.array, T.string]),
  dropTitle: T.string,
  triggerProps: T.object,
  triggerLabel: T.oneOfType([T.func, T.string]),
  alignment: T.string,
  direction: T.string,
  onSelect: T.func
};

DropdownMenu.defaultProps = {
  alignment: 'center',
  direction: 'down'
};

export default DropdownMenu;
