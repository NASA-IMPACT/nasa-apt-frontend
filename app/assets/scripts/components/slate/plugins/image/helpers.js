import { Editor, Transforms } from 'slate';
import {
  getRenderElements,
  getAbove,
  ELEMENT_IMAGE
} from '@udecode/slate-plugins';

import { DEFAULTS_CAPTION, getEmptyCaptionNode } from '../caption';
import ImageBlock from './image-block';
import Image from './image';

import { isInNodeType } from '../common/is-node-type';
import { getPathForRootBlockInsert } from '../common/utils';

// Plugin type.
export const IMAGE = ELEMENT_IMAGE;
export const IMAGE_BLOCK = 'image-block';

/**
 * Check if the current selection is inside a IMAGE_BLOCK node
 *
 * @param {Editor} editor The slate editor instance
 * @returns boolean
 */
export const isInImageBlock = (editor) => isInNodeType(editor, IMAGE_BLOCK);

/**
 * Remove the IMAGE_BLOCK at selection
 * @param {Editor} editor The slate editor instance
 */
export const deleteImageBlock = (editor) => {
  if (isInImageBlock(editor)) {
    const entry = getAbove(editor, { match: { type: IMAGE_BLOCK } });
    if (entry) {
      Transforms.removeNodes(editor, {
        at: entry[1]
      });
    }
  }
};

/**
 * Insert a IMAGE_BLOCK.
 *
 * @param {Editor} editor Slate editor instance.
 */
export const insertImageBlock = (editor) => {
  const imageBlockNode = getEmptyImageBlockNode();

  const path = getPathForRootBlockInsert(editor);
  Transforms.insertNodes(editor, imageBlockNode, { at: path });
  Transforms.select(editor, path);

  // Select the image so the caption is not automatically focused and the
  // placeholder is shown.
  const imageBlockPath = getAbove(editor, {
    match: { type: IMAGE_BLOCK }
  })?.[1];

  imageBlockPath &&
    Transforms.select(editor, Editor.start(editor, imageBlockPath));

  return imageBlockNode;
};

/**
 * Empty image node.
 * @returns Slate Element
 */
const getEmptyImageNode = () => ({
  type: IMAGE,
  uploading: 0,
  children: [{ text: '' }]
});

/**
 * Empty image block node.
 * @returns Slate Element
 */
export const getEmptyImageBlockNode = () => ({
  type: IMAGE_BLOCK,
  children: [getEmptyImageNode(), getEmptyCaptionNode()]
});

/**
 * Render function for the image block elements.
 */
export const renderElementImageBlock = () => {
  const { caption } = DEFAULTS_CAPTION;
  const image = {
    type: IMAGE,
    component: Image
  };
  const imageBlock = {
    type: IMAGE_BLOCK,
    component: ImageBlock
  };

  return getRenderElements([caption, imageBlock, image]);
};
