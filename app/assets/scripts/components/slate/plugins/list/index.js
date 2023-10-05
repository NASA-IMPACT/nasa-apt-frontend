import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
import isHotkey from 'is-hotkey';
import castArray from 'lodash.castarray';
import { Range } from 'slate';
import {
  DEFAULTS_LIST,
  deserializeList,
  getBlockAbove,
  onKeyDownList,
  renderElementList,
  toggleList,
  withList as withList$
} from '@udecode/slate-plugins';

import { modKey } from '../common/utils';
import { TABLE_BLOCK } from '../constants';

const Ul = styled.ul`
  list-style: initial;
  padding-left: ${glsp(2)};
`;

const Ol = styled.ol`
  list-style-type: none;
  counter-reset: item;
  margin: 0;
  padding: 0;

  > li {
    display: table;
    counter-increment: item;

    &::before {
      content: counters(item, '.') '. ';
      display: table-cell;
      padding-right: ${glsp(1 / 2)};
    }
  }

  li ol > li:before {
    content: counters(item, '.') ' ';
  }
`;

const pluginOptions = {
  ul: {
    component: Ul
  },
  ol: {
    component: Ol
  }
};

/**
 * Toggle an ordered list.
 *
 * @param {Editor} editor Slate editor instance.
 */
export const toggleOrderedList = (editor) =>
  toggleList(editor, { typeList: DEFAULTS_LIST.ol.type });

/**
 * Toggle an unordered list.
 *
 * @param {Editor} editor Slate editor instance.
 */
export const toggleUnorderedList = (editor) =>
  toggleList(editor, { typeList: DEFAULTS_LIST.ul.type });

/**
 * Callback on plugin use through shortcut or button
 *
 * @param {Editor} editor Slate editor instance.
 * @param {String} btnId The button that triggered the use.
 */
export const onListPluginUse = (editor, btnId) => {
  if (isValidListLocation(editor)) {
    if (btnId === 'unordered-list') {
      toggleUnorderedList(editor);
    }
    if (btnId === 'ordered-list') {
      toggleOrderedList(editor);
    }
  }
};

/**
 * Check if the current selection allows for list insertion.
 *
 * @param {Editor} editor The Slate editor instance
 */
const isValidListLocation = (editor) => {
  if (!editor.selection) return false;

  const [start, end] = Range.edges(editor.selection);
  // Prevent lists inside tables.
  const tableAtStart = getBlockAbove(editor, {
    at: start,
    match: { type: TABLE_BLOCK }
  });
  const tableAtEnd = getBlockAbove(editor, {
    at: end,
    match: { type: TABLE_BLOCK }
  });

  return !tableAtStart && !tableAtEnd;
};

// Plugin definition for slate-plugins framework.
// This is a recreation of the ListPlugin to include additional keyboard
// shortcuts.
export const ListPlugin = {
  renderElement: renderElementList(pluginOptions),
  deserialize: deserializeList(pluginOptions),
  onKeyDown: (e, editor) => {
    onKeyDownList(pluginOptions)(e, editor);

    castArray(ListPlugin.toolbar).forEach((btn) => {
      if (isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        ListPlugin.onUse(editor, btn.id);
      }
    });
  },
  toolbar: [
    // Definition for the toolbar and keyboard shortcut.
    {
      id: 'unordered-list',
      icon: 'list',
      hotkey: 'mod+Shift+8',
      label: 'Unordered list',
      tip: (key) => `List (${modKey(key)})`,
      isDisabled: (editor) => !isValidListLocation(editor)
    },

    // Definition for the toolbar and keyboard shortcut.
    {
      id: 'ordered-list',
      icon: 'list-numbered',
      hotkey: 'mod+Shift+9',
      label: 'Ordered list',
      tip: (key) => `Numbered list (${modKey(key)})`,
      isDisabled: (editor) => !isValidListLocation(editor)
    }
  ],
  onUse: onListPluginUse
};

const VUl = styled.ul`
  list-style: initial;
  padding-left: ${glsp(2)};
`;

const VOl = styled.ol`
  counter-reset: item;
  margin: 0;
  padding: 0;

  > li {
    display: table;
    counter-increment: item;

    &::before {
      content: counters(item, '.') '. ';
      display: table-cell;
      padding-right: ${glsp(1 / 2)};
    }
  }

  li ol > li:before {
    content: counters(item, '.') ' ';
  }
`;

const viewPluginOptions = {
  ul: {
    component: VUl
  },
  ol: {
    component: VOl
  }
};
export const ViewListPlugin = {
  renderElement: renderElementList(viewPluginOptions),
  deserialize: deserializeList(viewPluginOptions)
};

// Function for list handling composition.
// Re-export. See README.md for rationale.
export const withList = withList$();
