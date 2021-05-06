import { someNode } from '@udecode/slate-plugins';

/**
 * Check if the current selection is inside the given node type
 *
 * @param {Editor} editor The slate editor instance
 * @param {string} type The node type
 * @returns boolean
 */
export const isInNodeType = (editor, type) =>
  editor.selection && someNode(editor, { match: { type } });
