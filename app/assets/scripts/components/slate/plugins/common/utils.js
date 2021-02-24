const isMac = navigator.appVersion.indexOf('Mac') !== -1;

/**
 * Returns the correct shortcut text depending on the mod key.
 * Mac: ⌘
 * Other: Ctrl
 *
 * @param {string} shortcut Keyboard shortcut definition.
 */
export const modKey = (shortcut) => {
  const k = isMac ? '⌘' : 'Ctrl';
  return shortcut.replace(/^mod/, k);
};
