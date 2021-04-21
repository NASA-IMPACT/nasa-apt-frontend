import { Editor, Transforms, Text } from 'slate';
import castArray from 'lodash.castarray';

// This file re-implements the toggleMark functionality from slate-plugins at:
// https://github.com/udecode/slate-plugins/blob/6bffd46979a844ff4e9eaa7cbd4dab9fa2533b5c/packages/slate-plugins/src/common/transforms/toggleMark.ts
// Slate plugins uses the Slate editor marks api which is being deprecated and had some bugs.
// Here the same functionality is implemented with the updated api.
// Some of the code borrowed from https://github.com/ianstormtaylor/slate/blob/b0f35f6dbe8a1d583fffed61fd3fb53e43875940/site/examples/hovering-toolbar.tsx#L44-L59

/**
 * Check whether the mark is active in the selection.
 *
 * @param {editor} editor slate editor
 * @param {string} type mark to check
 */
export const isMarkActive = (editor, type) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n[type] === true,
    mode: 'all'
  });
  return !!match;
};

/**
 * Set the state for a mark in the selection.
 *
 * @param {editor} editor slate editor
 * @param {string} type mark for which to change the state
 * @param {bool} isActive Whether or not the mark is active.
 */
const setMarkState = (editor, type, isActive = null) => {
  Transforms.setNodes(
    editor,
    { [type]: isActive },
    { match: Text.isText, split: true }
  );
};

/**
 * Add/remove marks in the selection.
 *
 * @param {editor} editor slate editor
 * @param {string} type mark to toggle
 * @param {array|string} clear marks to clear when adding mark
 */
export const toggleMark = (editor, type, clear = []) => {
  const isActive = isMarkActive(editor, type);

  if (isActive) {
    setMarkState(editor, type, null);
    return;
  }
  const clears = castArray(clear);
  clears.forEach((clearType) => {
    setMarkState(editor, clearType, null);
  });

  setMarkState(editor, type, true);
};
