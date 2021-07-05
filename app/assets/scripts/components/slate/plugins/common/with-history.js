import { withHistory as withHistory$ } from 'slate-history';

export function withHistory(editor) {
  withHistory$(editor);

  editor.canUndo = () => {
    // We don't want to consider set_selection operations as undoable.
    return (
      editor.history.undos.flat().filter((op) => op.type !== 'set_selection')
        .length > 0
    );
  };

  editor.canRedo = () => {
    return editor.history.redos.length > 0;
  };

  return editor;
}
