import { Element, Node, Transforms } from 'slate';

import { REFERENCE } from '.';
import { ALLOWED_REF_BLOCKS } from './is-valid';
import { createOp } from '../common/create-change-operation';

const referenceModalInitialState = {
  // Store whether the Modal is visible.
  visible: false,
  // Editor selection at the time the reference modal is displayed. When the
  // reference modal is shown, the slate editor loses focus. Once the reference
  // insertion is confirmed we need to know what the user had selected to know
  // where to insert the reference.
  selection: null
};

/**
 * Enhances the slate editor with support for the reference modal and
 * normalization.
 *
 * @param {Editor} editor The slate editor.
 */
export const withReferenceModal = (editor) => {
  // Store the data in a scoped ref so it is not exposed in the slate editor.
  const referenceModalDataRef = { current: referenceModalInitialState };

  // Add the referenceModal.
  editor.referenceModal = {
    // Store the operation to be applied on the next onChange cycle.
    operation: createOp(),
    reset: () => {
      editor.referenceModal.operation = createOp('reset');
      // Trigger a change event.
      editor.onChange();
    },
    show: (data) => {
      // Create an operation, storing some data to be used later.
      editor.referenceModal.operation = createOp('show', {
        selection: data.selection
      });
      // Trigger a change event.
      editor.onChange();
    },
    getData: () => {
      return referenceModalDataRef.current;
    }
  };

  // Handler for the references modal operations.
  // If an operation is handled, it should return true. This signals the
  // onChange cycle that we're done and moves to the next one.
  const handleReferenceModalOperation = (editor) => {
    const { type, args } = editor.referenceModal.operation;
    // If there's nothing to handle, just return.
    if (!type) return false;

    switch (type) {
      case 'reset':
        referenceModalDataRef.current = referenceModalInitialState;
        break;
      case 'show': {
        // Use the data from the operation's args to do things. In this case to
        // make the reference modal visible.
        const { selection } = args[0];
        referenceModalDataRef.current = {
          visible: true,
          selection
        };
        break;
      }
    }

    // Since the operation was handled, clean it up.
    editor.referenceModal.operation = createOp();
    return true;
  };

  const { onChange, normalizeNode } = editor;
  // Enhance the slate editor's onChange method to include the referenceModal
  // operation handling.
  editor.onChange = () => {
    // Handle referenceModal as first thing.
    handleReferenceModalOperation(editor);
    return onChange();
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // If the node is not a reference, check all children and if there's a
    // reference check that it is allowed.
    if (Element.isElement(node) && node.type !== REFERENCE) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (
          Element.isElement(child) &&
          child.type === REFERENCE &&
          !ALLOWED_REF_BLOCKS.includes(node.type)
        ) {
          Transforms.removeNodes(editor, { at: childPath });
          return;
        }
      }
    }

    // Fall back to the original `normalizeNode` to enforce other constraints.
    normalizeNode(entry);
  };

  return editor;
};
