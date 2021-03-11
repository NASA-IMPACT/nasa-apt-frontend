import { ReactEditor } from 'slate-react';
import { ELEMENT_LINK, findNode, isCollapsed } from '@udecode/slate-plugins';

const linkEditorInitialState = {
  // Store whether the Link Editor is visible.
  visible: false,
  // Editor selection at the time the Link Editor is displayed. When the link
  // editor is shown, the slate editor loses focus (since the Link Editor input
  // gets focused). Once the link address is confirmed we need to know what the
  // user had selected to know where to insert the link.
  selection: null,
  // The selection rect is the DOM selection bounding rect. This is used to
  // calculate the position where the Link Editor has to be shown.
  selectionRect: null,
  // Original url value to display in the Link Editor. This is extracted from
  // the slate element when an existing link is being edited. It will be empty
  // otherwise.
  value: ''
};

/**
 * Creates an operation to be applied in the next onChange cycle.
 *
 * @param {string} type Type of operation.
 * @param  {...any} args Arguments for the operation.
 */
const createOp = (type = null, ...args) => ({
  type,
  args
});

/**
 * Enhances the slate editor with link editing capabilities
 * @param {Editor} editor The slate editor.
 */
export const withLinkEditor = (editor) => {
  // Store the data in a scoped ref so it is not exposed in the slate editor.
  const linkEditorDataRef = { current: linkEditorInitialState };

  // Add the linkEditor.
  editor.linkEditor = {
    // Store the operation to be applied on the next onChange cycle.
    operation: createOp(),
    reset: () => {
      editor.linkEditor.operation = createOp('reset');
      // Trigger a change event.
      editor.onChange();
    },
    show: (data) => {
      // Create an operation, storing some data to be used later.
      editor.linkEditor.operation = createOp('show', {
        selection: data.selection,
        selectionRect: data.selectionRect,
        value: data.value
      });
      // Trigger a change event.
      editor.onChange();
    },
    getData: () => {
      return linkEditorDataRef.current;
    }
  };

  // Handler for the link Editor operations.
  // If an operation is handled, it should return true. This signals the
  // onChange cycle that we're done and moves to the next one.
  const handleLinkEditorOperation = (editor) => {
    const { type, args } = editor.linkEditor.operation;
    // If there's nothing to handle, just return.
    if (!type) return false;

    switch (type) {
      case 'reset':
        linkEditorDataRef.current = linkEditorInitialState;
        break;
      case 'show': {
        // Use the data from the operation's args to do things. In this case to
        // make the link editor visible.
        const { selection, selectionRect, value } = args[0];
        linkEditorDataRef.current = {
          visible: true,
          selection,
          selectionRect,
          value
        };
        break;
      }
    }

    // Since the operation was handled, clean it up.
    editor.linkEditor.operation = createOp();
    return true;
  };

  // Enhance the slate editor's onChange method to include the linkEditor
  // operation handling.
  const { onChange } = editor;
  editor.onChange = () => {
    // Handle linkEditor as first thing.
    if (handleLinkEditorOperation(editor)) {
      return onChange();
    }

    if (!editor.selection) {
      // When there's no selection, it means that the focus is on the link
      // editor. If there is a selection, then the user clicked elsewhere and we
      // dismiss the tooltip editor.
      return onChange();
    }

    // A link editor can also be shown when the caret is over a link. The best
    // way to check for this is to use the editor's onChange method which fires
    // on every cursor change.

    // Is the caret on a link?
    const linkUnderCaret = findNode(editor, { match: { type: ELEMENT_LINK } });
    // Selection can't be expanded.
    const caretOnLink = !!linkUnderCaret && isCollapsed(editor.selection);

    if (caretOnLink) {
      const node = ReactEditor.toDOMNode(editor, linkUnderCaret[0]);
      const rect = node.getBoundingClientRect();
      editor.linkEditor.show({
        selection: editor.selection,
        selectionRect: rect,
        value: linkUnderCaret[0].url
      });
      // The link Editor methods trigger a onChange event, We don't have to do
      // anything else here.
    } else {
      editor.linkEditor.reset();
      // The link Editor methods trigger a onChange event, We don't have to do
      // anything else here.
    }
  };

  return editor;
};
