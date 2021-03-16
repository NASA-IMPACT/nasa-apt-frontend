import {
  MARK_SUBSCRIPT,
  MARK_SUPERSCRIPT,
  renderLeafSubscript,
  renderLeafSuperscript
} from '@udecode/slate-plugins';
import isHotkey from 'is-hotkey';
import castArray from 'lodash.castarray';

import { modKey } from '../common/utils';
import { toggleMark } from '../common/marks';
import { isSelectionActionAllowed } from '../../editor-toolbar';

export const SubSupScriptPlugin = {
  renderLeaf: (data) => {
    const { children, leaf } = data;
    // Bring together the Subscript and Superscript plugins from slate-plugins.
    if (leaf[MARK_SUBSCRIPT]) {
      return renderLeafSubscript()(data);
    } else if (leaf[MARK_SUPERSCRIPT]) {
      return renderLeafSuperscript()(data);
    }

    return children;
  },
  onKeyDown: (e, editor) => {
    if (!isSelectionActionAllowed(editor)) {
      // If the selection actions are not allowed, return.
      return;
    }

    // Ensure that all toolbar hotkeys run.
    castArray(SubSupScriptPlugin.floatToolbar).forEach((btn) => {
      if (isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        SubSupScriptPlugin.onUse(editor, btn.id);
      }
    });
  },
  floatToolbar: [
    {
      id: MARK_SUBSCRIPT,
      icon: 'expand-down-right',
      hotkey: 'mod+,',
      label: 'Subscript',
      tip: (key) => `Subscript (${modKey(key)})`
    },
    {
      id: MARK_SUPERSCRIPT,
      icon: 'expand-top-right',
      hotkey: 'mod+.',
      label: 'Superscript',
      tip: (key) => `Superscript (${modKey(key)})`
    }
  ],
  /**
   * Callback on plugin use through shortcut or button
   *
   * @param {Editor} editor Slate editor instance.
   * @param {String} btnId The button that triggered the use.
   */
  onUse: (editor, btnId) => {
    switch (btnId) {
      case MARK_SUBSCRIPT:
        return toggleMark(editor, 'subscript', MARK_SUPERSCRIPT);
      case MARK_SUPERSCRIPT:
        return toggleMark(editor, 'superscript', MARK_SUBSCRIPT);
    }
  }
};
