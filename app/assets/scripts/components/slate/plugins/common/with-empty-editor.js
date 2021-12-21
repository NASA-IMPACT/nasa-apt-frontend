import { Text, Transforms } from 'slate';
import { ELEMENT_PARAGRAPH, getNode } from '@udecode/slate-plugins';

const firstChildPath = [0, 0];

export const withEmptyEditor = (editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const node = getNode(editor, firstChildPath);

    // We want to ensure that when the editor only has 1 child, it must be a
    // node. If it is a leaf, normalize to a paragraph.
    if (editor.children[0].children.length === 1 && Text.isText(node)) {
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

  return editor;
};
