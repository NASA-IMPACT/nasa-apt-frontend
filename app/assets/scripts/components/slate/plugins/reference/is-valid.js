import { Range } from 'slate';
import { ELEMENT_PARAGRAPH, getBlockAbove } from '@udecode/slate-plugins';

export const ALLOWED_REF_BLOCKS = [ELEMENT_PARAGRAPH];

/**
 * Checks if the block node above the given path allows for reference insertion.
 *
 * @param {Editor} editor The Slate editor instance
 * @param {Path} path Path of the node for which we want to check the block
 * above.
 */
export const isBlockAboveAllowedForRefs = (editor, path) => {
  const [node] = getBlockAbove(editor, { at: path });
  return ALLOWED_REF_BLOCKS.includes(node.type);
};

/**
 * Check if the current selection allows for reference insertion.
 *
 * @param {Editor} editor The Slate editor instance
 */
export const isValidReferenceLocation = (editor) => {
  if (!editor.selection) return false;

  // The reference is inserted at the end of the selection, therefore if the end
  // is not valid, the location is not valid.
  const end = Range.end(editor.selection);
  return isBlockAboveAllowedForRefs(editor, end.path);
};
