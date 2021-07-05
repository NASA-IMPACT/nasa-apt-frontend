import { useCallback, useEffect, useState } from 'react';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

// From https://github.com/ianstormtaylor/slate/issues/419#issuecomment-590135015
export function withSingleLine(editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length > 1) {
        Transforms.mergeNodes(editor);
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
}

export function useScrollToCaret(editor) {
  const [selection, setSelection] = useState({
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 0 }
  });

  useEffect(() => {
    if (!selection || !ReactEditor.isFocused(editor)) return;

    const editorDOM = ReactEditor.toDOMNode(editor, editor);
    if (!editorDOM) return;
    const padding = 5;
    const editorRects = editorDOM.getClientRects();
    const caretTextDom = ReactEditor.toDOMRange(editor, selection);
    const caretTextRects = caretTextDom.getBoundingClientRect();

    if (caretTextRects && editorRects.length > 0) {
      // Start of a selection.
      const caretXStart =
        caretTextRects.left - editorRects[0].left + editorDOM.scrollLeft;
      const caretXEnd = caretXStart + caretTextRects.width;

      if (caretXEnd - editorDOM.clientWidth + padding > editorDOM.scrollLeft) {
        editorDOM.scrollTo(caretXEnd - editorDOM.clientWidth + padding, 0);
      } else if (caretXStart - padding < editorDOM.scrollLeft) {
        editorDOM.scrollTo(caretXStart - padding, 0);
      }
    }
  }, [editor, selection]);

  const handleScrollToCaret = useCallback(() => {
    setSelection(editor.selection);
  }, [editor]);

  return handleScrollToCaret;
}
