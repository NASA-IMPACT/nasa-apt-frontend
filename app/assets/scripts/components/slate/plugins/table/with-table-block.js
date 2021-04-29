import { Editor, Transforms, Node, Element } from 'slate';
import { withTable as withTable$ } from '@udecode/slate-plugins';

import { CAPTION, getEmptyCaptionNode } from '../caption';
import { TABLE, TABLE_BLOCK } from './helpers';

/**
 * Normalizer to handle table blocks
 *
 * @param {Editor} editor Slate editor instance.
 */
export const withTableBlock = (editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TABLE_BLOCK) {
      // Table blocks can have 2 children max, a table and a caption.
      if (node.children.length > 2) {
        Transforms.removeNodes(editor, { at: path.concat(2) });
        return;
      }

      // If the first child is not a table, remove the table block altogether.
      const tableNode = Node.child(node, 0);
      if (tableNode.type !== TABLE) {
        Transforms.removeNodes(editor, { at: path });
        return;
      }

      // If we only have a child insert an empty caption.
      if (node.children.length === 1) {
        Transforms.select(editor, Editor.end(editor, path));
        Transforms.insertNodes(editor, getEmptyCaptionNode(), {
          at: path.concat(1)
        });
        return;
      }

      // If the second child is not a caption node, set is as such. The caption
      // normalizer will then kick in an ensure the children are valid.
      const captionNode = Node.child(node, 1);
      if (captionNode.type !== CAPTION) {
        Transforms.setNodes(editor, { type: CAPTION }, { at: path.concat(1) });
        return;
      }
    }

    return normalizeNode(entry);
  };

  // Apply the slate-plugin table normalizations.
  return withTable$()(editor);
};
