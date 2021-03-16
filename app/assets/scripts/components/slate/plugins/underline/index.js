import {
  UnderlinePlugin as UnderlinePlugin$,
  MARK_UNDERLINE
} from '@udecode/slate-plugins';
import isHotkey from 'is-hotkey';
import castArray from 'lodash.castarray';

import { modKey } from '../common/utils';
import { toggleMark } from '../common/marks';
import { isSelectionActionAllowed } from '../../editor-toolbar';

export const UnderlinePlugin = {
  // Start with slate-plugin default and extend.
  ...UnderlinePlugin$(),
  onKeyDown: (e, editor) => {
    if (!isSelectionActionAllowed(editor)) {
      // If the selection actions are not allowed, return.
      return;
    }

    // Ensure that all toolbar hotkeys run.
    castArray(UnderlinePlugin.floatToolbar).forEach((btn) => {
      if (isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        UnderlinePlugin.onUse(editor, btn.id);
      }
    });
  },
  floatToolbar: {
    id: MARK_UNDERLINE,
    icon: 'equal--small',
    hotkey: 'mod+U',
    label: 'Underline',
    tip: (key) => `Underline (${modKey(key)})`
  },
  /**
   * Callback on plugin use through shortcut or button
   *
   * @param {Editor} editor Slate editor instance.
   * @param {String} btnId The button that triggered the use.
   */
  onUse: (editor) => {
    toggleMark(editor, 'underline');
  }
};
