import React from 'react';

import { Kbd } from '../../../../styles/typography/code';

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
 * Returns a react Kbd component with the shortcut.
 * Mac: ⌘
 * Other: Ctrl
 *
 * @param {string} shortcut Keyboard shortcut definition.
 */
export const modKey2kbd = (shortcut) => {
  const k = IS_APPLE ? '⌘' : 'Ctrl';
  const pieces = shortcut.replace(/^mod/, k).split(/ ?\+ ?/);

  const c = pieces.length;

  /* eslint-disable react/no-array-index-key */
  return (
    <React.Fragment>
      {pieces.reduce((acc, p, i) => {
        const kbd = <Kbd key={i}>{p}</Kbd>;
        const space = <React.Fragment key={`space-${i}`}> + </React.Fragment>;
        return i === c - 1 ? acc.concat(kbd) : acc.concat(kbd, space);
      }, [])}
    </React.Fragment>
  );
  /* eslint-enable */
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
