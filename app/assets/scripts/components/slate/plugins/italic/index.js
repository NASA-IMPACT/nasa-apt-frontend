import {
  ItalicPlugin as ItalicPlugin$,
  MARK_ITALIC
} from '@udecode/slate-plugins';
import isHotkey from 'is-hotkey';
import castArray from 'lodash.castarray';

import { modKey } from '../common/utils';
import { toggleMark } from '../common/marks';
import { isSelectionActionAllowed } from '../../editor-toolbar';

export const ItalicPlugin = {
  // Start with slate-plugin default and extend.
  ...ItalicPlugin$(),
  onKeyDown: (e, editor) => {
    if (!isSelectionActionAllowed(editor)) {
      // If the selection actions are not allowed, return.
      return;
    }

    // Ensure that all toolbar hotkeys run.
    castArray(ItalicPlugin.floatToolbar).forEach((btn) => {
      if (isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        ItalicPlugin.onUse(editor, btn.id);
      }
    });
  },
  floatToolbar: {
    id: MARK_ITALIC,
    icon: 'exclamation--small',
    hotkey: 'mod+I',
    label: 'Italic',
    tip: (key) => `Italic (${modKey(key)})`
  },
  /**
   * Callback on plugin use through shortcut or button
   *
   * @param {Editor} editor Slate editor instance.
   * @param {String} btnId The button that triggered the use.
   */
  onUse: (editor) => {
    toggleMark(editor, 'italic');
  }
};
