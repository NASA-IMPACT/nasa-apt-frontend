import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
import isHotkey from 'is-hotkey';
import {
  DEFAULTS_LIST,
  deserializeList,
  onKeyDownList,
  renderElementList,
  toggleList,
  withList as withList$
} from '@udecode/slate-plugins';

import { modKey } from '../common/utils';

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

// Plugin definition for slate-plugins framework.
// This is a recreation of the ListPlugin to include additional keyboard
// shortcuts.
export const ListPlugin = {
  renderElement: renderElementList(pluginOptions),
  deserialize: deserializeList(pluginOptions),
  onKeyDown: (e, editor) => {
    onKeyDownList(pluginOptions)(e, editor);

    if (isHotkey(toolbarUl.hotkey, e)) {
      e.preventDefault();
      toggleUnorderedList(editor);
    }

    if (isHotkey(toolbarOl.hotkey, e)) {
      e.preventDefault();
      toggleOrderedList(editor);
    }
  }
};

// Function for list handling composition.
// Re-export. See README.md for rationale.
export const withList = withList$();

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

// Definition for the toolbar and keyboard shortcut.
export const toolbarUl = {
  id: 'unordered-list',
  icon: 'list',
  hotkey: 'mod+Shift+8',
  label: 'Unordered list',
  tip: (key) => `List (${modKey(key)})`
};

// Definition for the toolbar and keyboard shortcut.
export const toolbarOl = {
  id: 'ordered-list',
  icon: 'list-numbered',
  hotkey: 'mod+Shift+9',
  label: 'Ordered list',
  tip: (key) => `Numbered list (${modKey(key)})`
};
