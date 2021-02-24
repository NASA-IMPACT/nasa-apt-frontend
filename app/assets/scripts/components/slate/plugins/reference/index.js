import { modKey } from '../common/utils';

export const toolbarReference = {
  id: 'reference',
  icon: 'book-bookmark',
  hotkey: 'mod+E',
  label: 'Reference',
  tip: (key) => `Reference (${modKey(key)})`
};
