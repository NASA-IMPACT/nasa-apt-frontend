import { createOp } from './create-change-operation';

const modalInitialState = {
  // Store whether the Modal is visible.
  visible: false,
  // Id of the modal to display.
  id: null
};

/**
 * Enhances the slate editor with support for the simple modal.
 *
 * @param {Editor} editor The slate editor.
 */
export const withSimpleModal = (editor) => {
  // Store the data in a scoped ref so it is not exposed in the slate editor.
  const simpleModalDataRef = { current: modalInitialState };

  // Add the simpleModal.
  editor.simpleModal = {
    // Store the operation to be applied on the next onChange cycle.
    operation: createOp(),
    reset: () => {
      editor.simpleModal.operation = createOp('reset');
      // Trigger a change event.
      editor.onChange();
    },
    show: (data) => {
      // Create an operation, storing some data to be used later.
      editor.simpleModal.operation = createOp('show', {
        id: data.id
      });
      // Trigger a change event.
      editor.onChange();
    },
    getData: () => {
      return simpleModalDataRef.current;
    }
  };

  // Handler for the simple modal operations.
  // If an operation is handled, it should return true. This signals the
  // onChange cycle that we're done and moves to the next one.
  const handleModalOperation = (editor) => {
    const { type, args } = editor.simpleModal.operation;
    // If there's nothing to handle, just return.
    if (!type) return false;

    switch (type) {
      case 'reset':
        simpleModalDataRef.current = modalInitialState;
        break;
      case 'show': {
        // Use the data from the operation's args to do things. In this case to
        // make the simple modal visible.
        simpleModalDataRef.current = {
          visible: true,
          id: args?.[0]?.id
        };
        break;
      }
    }

    // Since the operation was handled, clean it up.
    editor.simpleModal.operation = createOp();
    return true;
  };

  const { onChange } = editor;
  // Enhance the slate editor's onChange method to include the simple modal
  // operation handling.
  editor.onChange = () => {
    // Handle simple modal as first thing.
    handleModalOperation(editor);
    return onChange();
  };

  return editor;
};
