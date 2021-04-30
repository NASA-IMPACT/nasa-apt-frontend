import castArray from 'lodash.castarray';
import { Transforms, Node, Element, Editor } from 'slate';

import { Caption } from './caption';

export * from './caption';

// Caption Element
export const CAPTION = 'caption';

// Caption settings.
export const DEFAULTS_CAPTION = {
  caption: {
    type: CAPTION,
    component: Caption
  }
};

/**
 * Empty caption node.
 * @returns Slate Element
 */
export const getEmptyCaptionNode = () => ({
  type: CAPTION,
  children: [{ text: '' }]
});

/**
 * Normalizer to handle captions.
 *
 * @param {Editor} editor Slate editor instance.
 */
export const withCaption = (editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // If the element is a caption, ensure its children are valid. Caption
    // children must be either text or inline elements.
    if (Element.isElement(node) && node.type === CAPTION) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && !editor.isInline(child)) {
          Transforms.unwrapNodes(editor, { at: childPath });
          return;
        }
      }
    }
    return normalizeNode(entry);
  };

  return editor;
};

/**
 * Normalizer to handle blocks with caption.
 * Captions will not appear randomly in the document. They will always be paired
 * with other elements like tables and images. In these cases a parent wrapper
 * block will house the element we want and a caption. Always in this order, and
 * always 2 children.
 *
 * @param {array|object} elements Array of elements that follow the layout to
 * handle captions.
 * @param {string} elements[].parent Type the parent node should have
 * @param {string} elements[].element Type the element node (other than the
 * caption) should have
 *
 * @returns {function} editor enhancer function.
 */
export const withCaptionLayout = (elements) => (editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    for (const { parent, element } of castArray(elements)) {
      if (Element.isElement(node) && node.type === parent) {
        // "Parent" blocks can have 2 children max, an "element" and a caption.
        if (node.children.length > 2) {
          Transforms.removeNodes(editor, { at: path.concat(2) });
          return;
        }

        // If the first child is not an "element", remove the "parent"
        // altogether.
        const firstChild = Node.child(node, 0);
        if (firstChild.type !== element) {
          Transforms.removeNodes(editor, { at: path });
          return;
        }

        // If we only have a child insert an empty caption.
        if (node.children.length === 1) {
          Transforms.select(editor, Editor.end(editor, path));
          Transforms.insertNodes(editor, getEmptyCaptionNode(), {
            at: path.concat(1)
          });
          return;
        }

        // If the second child is not a caption node, set is as such. The
        // caption normalizer will then kick in an ensure the children are
        // valid.
        const captionNode = Node.child(node, 1);
        if (captionNode.type !== CAPTION) {
          Transforms.setNodes(
            editor,
            { type: CAPTION },
            { at: path.concat(1) }
          );
          return;
        }
      }
    }

    return normalizeNode(entry);
  };

  return editor;
};
