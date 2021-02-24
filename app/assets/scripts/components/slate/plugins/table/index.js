import { modKey } from '../common/utils';

// Definition for the toolbar and keyboard shortcut.
export const toolbarTable = {
  id: 'table',
  icon: 'table',
  hotkey: 'mod+H',
  label: 'Table',
  tip: (key) => `Table (${modKey(key)})`
};
