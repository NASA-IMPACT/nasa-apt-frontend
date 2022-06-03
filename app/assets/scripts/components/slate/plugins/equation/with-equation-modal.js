import { createOp } from '../common/create-change-operation';

const equationModalInitialState = {
  // Store whether the Modal is visible.
  visible: false,
  // Editor selection at the time the equation modal is displayed. When the
  // equation modal is shown, the slate editor loses focus. Once the equation
  // insertion is confirmed we need to know what the user had selected to know
  // where to insert the equation.
  selection: null,
  element: null
};

/**
 * Enhances the slate editor with support for the equation modal and
 * normalization.
 *
 * @param {Editor} editor The slate editor.
 */
export const withEquationModal = (editor) => {
  // Store the data in a scoped ref so it is not exposed in the slate editor.
  const equationModalDataRef = { current: equationModalInitialState };

  // Add the equationModal.
  editor.equationModal = {
    // Store the operation to be applied on the next onChange cycle.
    operation: createOp(),
    reset: () => {
      editor.equationModal.operation = createOp('reset');
      // Trigger a change event.
      editor.onChange();
    },
    show: (data) => {
      // Create an operation, storing some data to be used later.
      editor.equationModal.operation = createOp('show', {
        selection: data.selection,
        element: data.element
      });
      // Trigger a change event.
      editor.onChange();
    },
    getData: () => {
      return equationModalDataRef.current;
    }
  };

  // Handler for the equations modal operations.
  // If an operation is handled, it should return true. This signals the
  // onChange cycle that we're done and moves to the next one.
  const handleEquationModalOperation = (editor) => {
    const { type, args } = editor.equationModal.operation;
    // If there's nothing to handle, just return.
    if (!type) return false;

    switch (type) {
      case 'reset':
        equationModalDataRef.current = equationModalDataRef;
        break;
      case 'show': {
        // Use the data from the operation's args to do things. In this case to
        // make the equation modal visible.
        const { selection } = args[0];

        const path = [...selection.anchor.path];
        const element = path.slice(0, -1).reduce((path, index) => {
          return path.children[index];
        }, editor);

        equationModalDataRef.current = {
          visible: true,
          selection,
          element: element.type === 'equation' ? element : null
        };
        break;
      }
    }

    // Since the operation was handled, clean it up.
    editor.referenceModal.operation = createOp();
    return true;
  };

  const { onChange } = editor;
  // Enhance the slate editor's onChange method to include the equationModal
  // operation handling.
  editor.onChange = () => {
    // Handle equationModal as first thing.
    handleEquationModalOperation(editor);
    return onChange();
  };

  return editor;
};
