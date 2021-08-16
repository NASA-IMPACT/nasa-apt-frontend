import React, { useCallback, useMemo, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Toolbar, ToolbarLabel } from '@devseed-ui/toolbar';

import DropdownMenu, {
  DropMenuItemEnhanced,
  getMenuClickHandler
} from '../common/dropdown-menu';

import {
  getDocumentStatusLabel,
  isDraftEquivalent,
  isReviewEquivalent,
  isPublication,
  isPublished,
  DRAFT,
  OPEN_REVIEW,
  PUBLICATION,
  PUBLISHED
} from '../documents/status';
import { computeAtbdVersion } from '../../context/atbds-list';
import { useContextualAbility } from '../../a11n';
import { statusSwatch } from '../common/status-pill';
import { useStatusColors } from '../../utils/use-status-colors';

const DocsFilters = styled(Toolbar)`
  min-height: 2rem;
  box-shadow: 0 ${themeVal('layout.border')} 0 0 ${themeVal('color.baseAlphaC')};

  > * {
    margin-top: ${glsp(-1)};
  }
`;

const DropMenuStatusItem = styled(DropMenuItemEnhanced)`
  > span {
    flex-grow: 1;

    &::after {
      ${statusSwatch}
      position: absolute;
      top: 0.65em;
      right: ${glsp()};
    }
  }
`;

/**
 * Default active filter.
 */
export const FILTER_STATUS_DEFAULT = 'all';

/**
 * Available filter options.
 * For each option we define:
 * - id (must be from file app/assets/scripts/components/documents/status.js)
 * - filterFn: (doc) => boolean
 */
const statusOptions = [
  {
    id: DRAFT,
    filterFn: isDraftEquivalent
  },
  {
    id: OPEN_REVIEW,
    filterFn: isReviewEquivalent
  },
  {
    id: PUBLICATION,
    filterFn: isPublication
  },
  {
    id: PUBLISHED,
    filterFn: isPublished
  }
];

/**
 * Dropdown menu definition for the status filter.
 */
const statusFilterDropMenu = {
  id: 'filter',
  selectable: true,
  items: [
    {
      id: 'all',
      label: 'All',
      title: 'Show all documents'
    },
    ...statusOptions.map((s) => {
      const l = getDocumentStatusLabel(s.id);
      return {
        id: s.id,
        label: l,
        title: `Show all documents with status: ${l}`,
        /* eslint-disable react/display-name, react/prop-types */
        render: DropMenuStatusItemCmp
        /* eslint-enable react/display-name, react/prop-types */
      };
    })
  ]
};

function DropMenuStatusItemCmp(props) {
  const { statusMapping } = useStatusColors();

  const { menuItem, onSelect } = props;
  return (
    <DropMenuStatusItem
      pillColor={statusMapping[menuItem.id]}
      title={menuItem.title}
      onClick={getMenuClickHandler(onSelect, menuItem)}
      {...props}
    >
      <span>{menuItem.label}</span>
    </DropMenuStatusItem>
  );
}

DropMenuStatusItemCmp.propTypes = {
  onSelect: T.func,
  menuItem: T.object
};

/**
 * Default active order.
 */
export const ORDER_DEFAULT = 'recent';

/**
 * Available order options.
 * For each option we define:
 * - id, label, title -> needed for the dropdown menu.
 * - orderFn: (array, payload) => array  -> The ordering function takes a list
 *   of documents and any contextual payload and must return an ordered document
 *   list.
 */
const orderOptions = [
  {
    id: 'recent',
    label: 'Recent',
    title: 'Order by last update',
    // Ordering by date.
    orderFn: (arr) =>
      [...arr].sort((a, b) => {
        // Ordering must be applied to the latest document version. By using
        // computeAtbdVersion it takes care of calculating the correct
        // last_updated_at.
        const docA = computeAtbdVersion(a, a.versions.last);
        const docB = computeAtbdVersion(b, b.versions.last);
        return docA.last_updated_at < docB.last_updated_at ? 1 : -1;
      })
  },
  {
    id: 'alpha',
    label: 'Alphabetical',
    title: 'Order by document title',
    orderFn: (arr) =>
      [...arr].sort((a, b) => {
        // The title belongs to the ATBD and not to the version therefore
        // there's no need to compute the version.
        return a.title < b.title ? -1 : 1;
      })
  },
  {
    id: 'actions',
    label: 'Actionable',
    title: 'Show documents with actions first',
    // Ordering by action is a tricky one. We must take the latest version into
    // account, since there are no actions available on previous versions (hence
    // the computeAtbdVersion).
    // Then, actions on a document require permissions so we need access to the
    // ability checker (which is passed as a payload to orderFn). The
    // getDocAbilitySortRating will calculate the ability rating, because
    // different action may have more importance and must be shown before.
    orderFn: (arr, { ability }) =>
      [...arr].sort((a, b) => {
        const docA = computeAtbdVersion(a, a.versions.last);
        const docB = computeAtbdVersion(b, b.versions.last);
        const abRatingA = getDocAbilitySortRating(docA, ability);
        const abRatingB = getDocAbilitySortRating(docB, ability);
        // When the ability rating is the same show alphabetically.
        if (abRatingA === abRatingB) return docA.title < docB.title ? -1 : 1;
        return abRatingA < abRatingB ? -1 : 1;
      })
  }
];

/**
 * Dropdown menu definition for the order.
 */
const orderDropMenu = {
  id: 'order',
  selectable: true,
  items: orderOptions
};

/**
 * Toolbar with the Document List Settings comprised of the status filter and
 * order dropdown.
 * @param {object} props Component props
 * @returns Component
 */
function DocListSettings(props) {
  const { values = {}, onSelect, alignment, direction, origin } = props;

  // If we're are in the public tab the settings are different.
  const orderDropMenuFiltered = useMemo(
    () =>
      origin === 'tab-public'
        ? {
            ...orderDropMenu,
            items: orderDropMenu.items.filter((item) => item.id !== 'actions')
          }
        : orderDropMenu,
    [origin]
  );

  const shouldShowFilters = origin !== 'tab-public';

  return (
    <DocsFilters>
      {shouldShowFilters && (
        <React.Fragment>
          <ToolbarLabel>Status</ToolbarLabel>
          <DropdownMenu
            menu={statusFilterDropMenu}
            activeItem={values?.filterStatus}
            alignment={alignment || 'left'}
            direction={direction || 'down'}
            withChevron
            dropTitle='Filter by status'
            onSelect={(id) => onSelect({ ...values, filterStatus: id })}
          />
        </React.Fragment>
      )}
      <React.Fragment>
        <ToolbarLabel>Order</ToolbarLabel>
        <DropdownMenu
          menu={orderDropMenuFiltered}
          activeItem={values?.order}
          alignment={alignment || 'left'}
          direction={direction || 'down'}
          withChevron
          dropTitle='Order'
          onSelect={(id) => onSelect({ ...values, order: id })}
        />
      </React.Fragment>
    </DocsFilters>
  );
}

DocListSettings.propTypes = {
  alignment: T.string,
  direction: T.string,
  onSelect: T.func,
  values: T.shape({
    filterStatus: T.string,
    order: T.string
  }),
  origin: T.string
};

export default DocListSettings;

const intialDocListSettingsState = {
  filterStatus: FILTER_STATUS_DEFAULT,
  order: ORDER_DEFAULT
};

/**
 * Hook to use with the Document list settings.
 * Returns the values and setter to pass to the <DocListSettings /> component
 * and the applyListSettings function with which to filter and order the
 * documents.
 *
 * @returns {object} {
 *  listSettingsValues: object
 *  listSettingsSetter: function
 *  applyListSettings: function
 *  applyListSettingsFilters: function
 *  applyListSettingsOrder: function
 * }
 */
export function useDocListSettings() {
  const ability = useContextualAbility();
  const [docListSettings, setDocListSettings] = useState(
    intialDocListSettingsState
  );

  // Function to reset to initial.
  const resetListSettings = useCallback(
    () => setDocListSettings(intialDocListSettingsState),
    []
  );

  // Function to just apply the filters.
  const applyListSettingsFilters = useCallback(
    (list) =>
      applyListSettingsFiltersFn(list, {
        settings: docListSettings,
        ability
      }),
    [docListSettings, ability]
  );

  // Function to just apply the order.
  const applyListSettingsOrder = useCallback(
    (list) =>
      applyListSettingsOrderFn(list, {
        settings: docListSettings,
        ability
      }),
    [docListSettings, ability]
  );

  // Function to apply all settings.
  const applyListSettings = useCallback(
    (atbds) => applyListSettingsOrder(applyListSettingsFilters(atbds)),
    [applyListSettingsFilters, applyListSettingsOrder]
  );

  return {
    resetListSettings,
    listSettingsValues: docListSettings,
    listSettingsSetter: setDocListSettings,
    applyListSettings,
    applyListSettingsFilters,
    applyListSettingsOrder
  };
}

/**
 * Function to apply the document list settings filters to the document list.
 * Used by the useDocListSettings hook.
 * @param {ops} opts Options object
 */
function applyListSettingsFiltersFn(list, { settings }) {
  const { filterStatus } = settings;
  const { filterFn } = statusOptions.find((s) => s.id === filterStatus) || {};

  return list.filter((doc) => {
    return filterFn ? filterFn(doc.versions.last) : true;
  });
}

/**
 * Function to apply the document list settings ordering to the document list.
 * Used by the useDocListSettings hook.
 * @param {ops} opts Options object
 */
function applyListSettingsOrderFn(list, { settings, ability }) {
  const { order } = settings;
  const { orderFn } = orderOptions.find((o) => o.id === order) || {};

  return orderFn(list, { ability });
}

/**
 * Calculates the ability sort rating for a document.
 *
 * A user may perform actions on a document based on a series of permissions.
 * Not all actions may have the same importance, so this function will return a
 * negative number based on the importance of the action the usr can take. The
 * lower the number the more important the action is. If the usr has no actions
 * available 1 is returned. This function behaves this way to use in .sort()
 * functions.
 *
 * @param {object} doc The atbd
 * @param {object} ability CASL contextual ability
 *
 * @returns number
 */
function getDocAbilitySortRating(doc, ability) {
  return ability.can('req-review', doc) ||
    ability.can('cancel-req-review', doc) ||
    ability.can('set-own-review-done', doc) ||
    ability.can('manage-req-review', doc) ||
    ability.can('open-review', doc) ||
    ability.can('req-publication', doc) ||
    ability.can('cancel-req-publication', doc) ||
    ability.can('manage-req-publication', doc) ||
    ability.can('publish', doc)
    ? -1
    : 1;
}
