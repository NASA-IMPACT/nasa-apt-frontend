import isHotkey from 'is-hotkey';

import { createOp } from '../common/create-change-operation';

export * from './shortcuts-modal';

/**
 * Callback on plugin use through shortcut or button
 *
 * @param {Editor} editor Slate editor instance.
 * @param {String} btnId The button that triggered the use.
 */
const onShortcutModalUse = (editor) => {
  editor.shortcutsModal.show();
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

const modalInitialState = {
  // Store whether the Modal is visible.
  visible: false
};

/**
 * Enhances the slate editor with support for the shortcuts modal.
 *
 * @param {Editor} editor The slate editor.
 */
export const withShortcutsModal = (editor) => {
  // Store the data in a scoped ref so it is not exposed in the slate editor.
  const shortcutsModalDataRef = { current: modalInitialState };

  // Add the shortcutsModal.
  editor.shortcutsModal = {
    // Store the operation to be applied on the next onChange cycle.
    operation: createOp(),
    reset: () => {
      editor.shortcutsModal.operation = createOp('reset');
      // Trigger a change event.
      editor.onChange();
    },
    show: () => {
      // Create an operation, storing some data to be used later.
      editor.shortcutsModal.operation = createOp('show');
      // Trigger a change event.
      editor.onChange();
    },
    getData: () => {
      return shortcutsModalDataRef.current;
    }
  };

  // Handler for the shortcuts modal operations.
  // If an operation is handled, it should return true. This signals the
  // onChange cycle that we're done and moves to the next one.
  const handleModalOperation = (editor) => {
    const { type } = editor.shortcutsModal.operation;
    // If there's nothing to handle, just return.
    if (!type) return false;

    switch (type) {
      case 'reset':
        shortcutsModalDataRef.current = shortcutsModalDataRef;
        break;
      case 'show': {
        // Use the data from the operation's args to do things. In this case to
        // make the shortcuts modal visible.
        shortcutsModalDataRef.current = {
          visible: true
        };
        break;
      }
    }

    // Since the operation was handled, clean it up.
    editor.shortcutsModal.operation = createOp();
    return true;
  };

  const { onChange } = editor;
  // Enhance the slate editor's onChange method to include the shortcuts modal
  // operation handling.
  editor.onChange = () => {
    // Handle shortcuts modal as first thing.
    handleModalOperation(editor);
    return onChange();
  };

  return editor;
};
