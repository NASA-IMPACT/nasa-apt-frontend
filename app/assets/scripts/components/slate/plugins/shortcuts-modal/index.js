import isHotkey from 'is-hotkey';

export * from './shortcuts-modal';

/**
 * Callback on plugin use through shortcut or button
 *
 * @param {Editor} editor Slate editor instance.
 * @param {String} btnId The button that triggered the use.
 */
const onShortcutModalUse = (editor) => {
  editor.simpleModal.show({ id: 'shortcut-modal' });
};

export const SHORTCUTS_HOTKEY = "mod+'";

// Plugin definition for slate-plugins framework.
export const ShortcutsModalPlugin = {
  onKeyDown: (e, editor) => {
    if (isHotkey(SHORTCUTS_HOTKEY, e)) {
      e.preventDefault();
      ShortcutsModalPlugin.onUse(editor, 'shortcut-modal');
    }
  },
  onUse: onShortcutModalUse
};
