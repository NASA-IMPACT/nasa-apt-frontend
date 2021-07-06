import { useEffect, useState } from 'react';
import { getSelectionText } from '@udecode/slate-plugins';

/**
 * Returns the client Rect of the current selection
 *
 * @param {object} options Options
 * @param {object} options.editorSlate editor instance
 */
export const useSelectionRect = ({ editor }) => {
  const [selectionRect, setSelectionRect] = useState({});

  const selectionText = getSelectionText(editor);

  useEffect(() => {
    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount < 1) return;

    const domRange = domSelection.getRangeAt(0);
    const { top, left, width } = domRange.getBoundingClientRect();
    setSelectionRect({ top, left, width });
  }, [selectionText.length]);

  return selectionRect;
};
