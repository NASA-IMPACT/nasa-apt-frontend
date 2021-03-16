const IS_APPLE =
  typeof window != 'undefined' &&
  /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);

/**
 * Returns the correct shortcut text depending on the mod key.
 * Mac: ⌘
 * Other: Ctrl
 *
 * @param {string} shortcut Keyboard shortcut definition.
 */
export const modKey = (shortcut) => {
  const k = IS_APPLE ? '⌘' : 'Ctrl';
  return shortcut.replace(/^mod/, k);
};

/**
 * Checks if the mod key was active in the event.
 * Mac: ⌘
 * Other: Ctrl
 *
 * @param {object} event React event
 */
export const isModKey = (event) => {
  return IS_APPLE ? event.metaKey : event.ctrlKey;
};

export const UNDO_HOTKEY = 'mod+Z';
export const REDO_HOTKEY = IS_APPLE ? 'mod+Shift+Z' : 'mod+Y';
