import { modKey } from '../common/utils';

export const toolbarImage = {
  id: 'image',
  icon: 'picture',
  hotkey: 'mod+I',
  label: 'Image',
  tip: (key) => `Image (${modKey(key)})`
};
