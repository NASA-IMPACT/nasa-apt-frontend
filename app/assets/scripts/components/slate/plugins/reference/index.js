import { modKey } from '../common/utils';

// Definition for the toolbar and keyboard shortcut.
export const toolbarReference = {
  id: 'reference',
  icon: 'book-bookmark',
  hotkey: 'mod+E',
  label: 'Reference',
  tip: (key) => `Reference (${modKey(key)})`
};
