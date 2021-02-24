const isMac = navigator.appVersion.indexOf('Mac') !== -1;

export const modKey = (shortcut) => {
  const k = isMac ? '⌘' : 'Ctrl';
  return shortcut.replace(/^mod/, k);
};
