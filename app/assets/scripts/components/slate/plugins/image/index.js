import isHotkey from 'is-hotkey';
import castArray from 'lodash.castarray';

import ToolbarImageButton from './toolbar-image-button';

import { modKey } from '../common/utils';
import {
  deleteImageBlock,
  isInImageBlock,
  renderElementImageBlock,
  IMAGE
} from './helpers';
import { isFocusedAnd } from '../common/is-focused-compose';

export * from './helpers';

/**
 * Callback on plugin use through shortcut or button
 *
 * @param {Editor} editor Slate editor instance.
 * @param {String} btnId The button that triggered the use.
 */
export const onImageUse = (editor, btnId) => {
  switch (btnId) {
    case 'delete-image':
      deleteImageBlock(editor);
      break;
  }
};

// Plugin definition for slate-plugins framework.
export const ImageBlockPlugin = {
  renderElement: renderElementImageBlock(),
  voidTypes: [IMAGE],
  onKeyDown: (e, editor) => {
    castArray(ImageBlockPlugin.toolbar).forEach((btn) => {
      if (isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        ImageBlockPlugin.onUse(editor, btn.id);
      }
    });
    castArray(ImageBlockPlugin.contextToolbar).forEach((btn) => {
      if (btn.isInContext?.(editor) && isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        ImageBlockPlugin.onUse(editor, btn.id);
      }
    });
  },
  toolbar: {
    // Because of the implementation details related with file uploading, the
    // the "onUse" code of this toolbar action is in the component itself.
    id: 'image',
    icon: 'picture',
    hotkey: 'mod+I',
    label: 'Image',
    tip: (key) => `Image (${modKey(key)})`,
    // Custom render this item to support file uploading.
    render: ToolbarImageButton
  },
  contextToolbar: [
    {
      id: 'delete-image',
      icon: 'trash-bin',
      hotkey: 'mod+Shift+D',
      label: 'Remove image',
      tip: (key) => `Remove image (${modKey(key)})`,
      isInContext: isFocusedAnd(isInImageBlock)
    }
  ],
  onUse: onImageUse
};
