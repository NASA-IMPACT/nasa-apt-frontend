import { Transforms, Node, Element } from 'slate';

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
