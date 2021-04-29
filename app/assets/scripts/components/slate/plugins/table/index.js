import isHotkey from 'is-hotkey';
import castArray from 'lodash.castarray';
import {
  addRow,
  deleteRow,
  addColumn,
  deleteColumn
} from '@udecode/slate-plugins';

import { modKey } from '../common/utils';
import {
  deleteTableBlock,
  insertTableBlock,
  isInTable,
  isInTableBlock,
  renderElementTableBlock,
  TABLE
} from './helpers';

export * from './helpers';
export * from './with-table-block';

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
      addColumn(editor);
      break;
    case 'delete-column':
      deleteColumn(editor);
      break;
  }
};

// Plugin definition for slate-plugins framework.
export const TableBlockPlugin = {
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
      icon: 'square',
      hotkey: 'mod+Shift+Down',
      label: 'Add row',
      tip: (key) => `Add row (${modKey(key)})`,
      isInContext: isInTable
    },
    {
      id: 'delete-row',
      icon: 'square',
      hotkey: 'mod+Shift+Up',
      label: 'Remove row',
      tip: (key) => `Remove row (${modKey(key)})`,
      isInContext: isInTable
    },
    {
      id: 'add-column',
      icon: 'square',
      hotkey: 'mod+Shift+Right',
      label: 'Add column',
      tip: (key) => `Add column (${modKey(key)})`,
      isInContext: isInTable
    },
    {
      id: 'delete-column',
      icon: 'square',
      hotkey: 'mod+Shift+Left',
      label: 'Remove column',
      tip: (key) => `Remove column (${modKey(key)})`,
      isInContext: isInTable
    },
    {
      id: 'delete-table',
      icon: 'trash-bin',
      hotkey: 'mod+Shift+D',
      label: 'Remove table',
      tip: (key) => `Remove table (${modKey(key)})`,
      isInContext: isInTableBlock
    }
  ],
  onUse: onTableUse
};
