import { Text, Transforms, Node } from 'slate';
import { ELEMENT_PARAGRAPH, getNode } from '@udecode/slate-plugins';

const firstChildPath = [0, 0];

export const withEmptyEditor = (editor) => {
  const { normalizeNode, deleteBackward } = editor;

  editor.normalizeNode = (entry) => {
    const node = getNode(editor, firstChildPath);

    // We want to ensure that when the editor only has 1 child, it must be a
    // node. If it is a leaf, normalize to a paragraph.
    if (editor.children[0]?.children?.length === 1 && Text.isText(node)) {
      Transforms.wrapNodes(
        editor,
        {
          type: ELEMENT_PARAGRAPH
        },
        { at: firstChildPath }
      );
      return;
    }

    return normalizeNode(entry);
  };

  // Ensure that a P node can be removed when it's the first but not only
  // element, and backspace is pressed. This is needed so that block elements
  // like Tables, Equations, etc can move up.
  editor.deleteBackward = (unit) => {
    if (unit === 'character' && editor.children[0].children.length !== 1) {
      Transforms.removeNodes(editor, {
        at: [0, 0],
        match: (n) => {
          return n.type === ELEMENT_PARAGRAPH && Node.string(n) === '';
        }
      });
    }
    deleteBackward(unit);
  };

  return editor;
};
