import isHotkey from 'is-hotkey';
import castArray from 'lodash.castarray';
import {
  addRow,
  deleteRow,
  addColumn,
  getAbove,
  deleteColumn,
  ELEMENT_TABLE
} from '@udecode/slate-plugins';
import { errorToast } from '../../../common/toasts';

import { modKey } from '../common/utils';
import {
  deleteTableBlock,
  insertTableBlock,
  isInTable,
  isInTableBlock,
  renderElementTableBlock,
  TABLE
} from './helpers';
import { isFocusedAnd } from '../common/is-focused-compose';

export * from './helpers';
export * from './with-table';

/**
 * Callback on plugin use through shortcut or button
 *
 * @param {Editor} editor Slate editor instance.
 * @param {String} btnId The button that triggered the use.
 */
export const onTableUse = (editor, btnId) => {
  switch (btnId) {
    case 'table':
      insertTableBlock(editor);
      break;
    case 'delete-table':
      deleteTableBlock(editor);
      break;
    case 'add-row':
      addRow(editor);
      break;
    case 'delete-row':
      deleteRow(editor);
      break;
    case 'add-column':
      {
        const table = getAbove(editor, {
          match: {
            type: ELEMENT_TABLE
          }
        });

        const tableEl = Array.isArray(table) ? table[0] : table;
        const tableColumnLength = tableEl.children?.[0]?.children?.length ?? 0;

        const maxColumns = 10;
        if (tableColumnLength < maxColumns) {
          addColumn(editor);
        } else {
          errorToast(`Max number of columns (${maxColumns}) reached!`);
        }
      }
      break;
    case 'delete-column':
      deleteColumn(editor);
      break;
  }
};

// Plugin definition for slate-plugins framework.
export const TableBlockPlugin = {
  name: 'Table',
  renderElement: renderElementTableBlock(),
  onKeyDown: (e, editor) => {
    castArray(TableBlockPlugin.toolbar).forEach((btn) => {
      if (isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        TableBlockPlugin.onUse(editor, btn.id);
      }
    });
    castArray(TableBlockPlugin.contextToolbar).forEach((btn) => {
      if (btn.isInContext?.(editor) && isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        TableBlockPlugin.onUse(editor, btn.id);
      }
    });
  },
  toolbar: {
    id: TABLE,
    icon: 'table',
    hotkey: 'mod+H',
    label: 'Table',
    tip: (key) => `Table (${modKey(key)})`
  },
  contextToolbar: [
    {
      id: 'add-row',
      icon: 'table-add-row',
      hotkey: 'mod+Shift+Down',
      label: 'Add row',
      tip: (key) => `Add row (${modKey(key)})`,
      isInContext: isFocusedAnd(isInTable)
    },
    {
      id: 'delete-row',
      icon: 'table-subtract-row',
      hotkey: 'mod+Shift+Up',
      label: 'Remove row',
      tip: (key) => `Remove row (${modKey(key)})`,
      isInContext: isFocusedAnd(isInTable)
    },
    {
      id: 'add-column',
      icon: 'table-add-column',
      hotkey: 'mod+Shift+Right',
      label: 'Add column',
      tip: (key) => `Add column (${modKey(key)})`,
      isInContext: isFocusedAnd(isInTable)
    },
    {
      id: 'delete-column',
      icon: 'table-subtract-column',
      hotkey: 'mod+Shift+Left',
      label: 'Remove column',
      tip: (key) => `Remove column (${modKey(key)})`,
      isInContext: isFocusedAnd(isInTable)
    },
    {
      id: 'delete-table',
      icon: 'trash-bin',
      hotkey: 'mod+Shift+D',
      label: 'Remove table',
      tip: (key) => `Remove table (${modKey(key)})`,
      isInContext: isFocusedAnd(isInTableBlock)
    }
  ],
  onUse: onTableUse
};
