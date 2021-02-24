import { modKey } from '../common/utils';

// Definition for the toolbar and keyboard shortcut.
export const toolbarImage = {
  id: 'image',
  icon: 'picture',
  hotkey: 'mod+I',
  label: 'Image',
  tip: (key) => `Image (${modKey(key)})`
};
