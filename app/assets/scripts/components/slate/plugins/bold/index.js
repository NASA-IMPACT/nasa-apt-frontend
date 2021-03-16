import { BoldPlugin as BoldPlugin$, MARK_BOLD } from '@udecode/slate-plugins';
import isHotkey from 'is-hotkey';
import castArray from 'lodash.castarray';

import { modKey } from '../common/utils';
import { toggleMark } from '../common/marks';
import { isSelectionActionAllowed } from '../../editor-toolbar';

export const BoldPlugin = {
  // Start with slate-plugin default and extend.
  ...BoldPlugin$(),
  onKeyDown: (e, editor) => {
    if (!isSelectionActionAllowed(editor)) {
      // If the selection actions are not allowed, return.
      return;
    }

    // Ensure that all toolbar hotkeys run.
    castArray(BoldPlugin.floatToolbar).forEach((btn) => {
      if (isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        BoldPlugin.onUse(editor, btn.id);
      }
    });
  },
  floatToolbar: {
    id: MARK_BOLD,
    icon: 'area',
    hotkey: 'mod+B',
    label: 'Bold',
    tip: (key) => `Bold (${modKey(key)})`
  },
  /**
   * Callback on plugin use through shortcut or button
   *
   * @param {Editor} editor Slate editor instance.
   * @param {String} btnId The button that triggered the use.
   */
  onUse: (editor) => {
    toggleMark(editor, 'bold');
  }
};
