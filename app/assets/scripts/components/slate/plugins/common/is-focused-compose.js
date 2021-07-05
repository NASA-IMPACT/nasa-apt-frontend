import { ReactEditor } from 'slate-react';

/**
 * Wraps the given function returning true if the editor is focused and the
 * function also returns true.
 *
 * @param {function} fn Function to execute
 * @returns boolean
 */
export const isFocusedAnd = (fn) => (editor) => {
  return ReactEditor.isFocused(editor) && fn(editor);
};
