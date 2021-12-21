import { Element, Text, Node, Transforms } from 'slate';
import {
  withTable as withTable$,
  ELEMENT_TD,
  ELEMENT_TH,
  ELEMENT_PARAGRAPH
} from '@udecode/slate-plugins';

export const withTable = (inputEditor) => {
  // Use slate-plugins' with table and extend.
  // See README.md for rationale.
  const editor = withTable$()(inputEditor);

  const { normalizeNode } = editor;

  // Normalize the table structure to ensure that we don't end up with a text
  // element inside the TD. In google chrome when the cell contents are selected
  // with a double/triple click and then deleted, the P node inside the TD gets
  // deleted, leaving the TD with an empty text. This happens because the
  // withTable$ clears the TD contents when the selection starts and ends in
  // different cells. If it started/ended in the same cell, only the text would
  // be deleted, but in chrome (for some reason) the start of the selection is
  // the TD but the end is the beginning of the following element, leading the
  // whole TD being cleared.
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (
      Element.isElement(node) &&
      (node.type === ELEMENT_TH || node.type === ELEMENT_TD)
    ) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Text.isText(child)) {
          Transforms.wrapNodes(
            editor,
            {
              type: ELEMENT_PARAGRAPH
            },
            { at: childPath }
          );
        }
        return;
      }
    }
    return normalizeNode(entry);
  };

  return editor;
};
