import { Editor, Transforms } from 'slate';
import {
  DEFAULTS_TABLE,
  ELEMENT_TABLE,
  getEmptyTableNode,
  getRenderElements,
  getAbove
} from '@udecode/slate-plugins';

import { DEFAULTS_CAPTION, getEmptyCaptionNode } from '../caption';
import TableBlock from './table-block';
import { isInNodeType } from '../common/is-node-type';
import { getPathForRootBlockInsert } from '../common/utils';

// Plugin type.
export const TABLE = ELEMENT_TABLE;
export const TABLE_BLOCK = 'table-block';

/**
 * Check if the current selection is inside a TABLE node
 *
 * @param {Editor} editor The slate editor instance
 * @returns boolean
 */
export const isInTable = (editor) => isInNodeType(editor, TABLE);

/**
 * Check if the current selection is inside a TABLE_BLOCK node
 *
 * @param {Editor} editor The slate editor instance
 * @returns boolean
 */
export const isInTableBlock = (editor) => isInNodeType(editor, TABLE_BLOCK);

/**
 * Remove the TABLE_BLOCK at selection
 * @param {Editor} editor The slate editor instance
 */
export const deleteTableBlock = (editor) => {
  if (isInTableBlock(editor)) {
    const tableItem = getAbove(editor, { match: { type: TABLE_BLOCK } });
    if (tableItem) {
      Transforms.removeNodes(editor, {
        at: tableItem[1]
      });
    }
  }
};

/**
 * Insert a TABLE_BLOCK.
 *
 * @param {Editor} editor Slate editor instance.
 */
export const insertTableBlock = (editor) => {
  if (!isInTableBlock(editor)) {
    Transforms.insertNodes(editor, getEmptyTableBlockNode(), {
      at: getPathForRootBlockInsert(editor)
    });

    // Select the first cell of the Table the selection is in.
    const tableBlockPath = getAbove(editor, {
      match: { type: TABLE_BLOCK }
    })?.[1];

    tableBlockPath &&
      Transforms.select(editor, Editor.start(editor, tableBlockPath));
  }
};

/**
 * Empty table block node.
 * @returns Slate Element
 */
export const getEmptyTableBlockNode = () => ({
  type: TABLE_BLOCK,
  children: [getEmptyTableNode(), getEmptyCaptionNode()]
});

/**
 * Render function for the table block elements.
 */
export const renderElementTableBlock = () => {
  const { table, td, th, tr } = DEFAULTS_TABLE;
  const { caption } = DEFAULTS_CAPTION;
  const tableBlock = {
    type: TABLE_BLOCK,
    component: TableBlock
  };

  return getRenderElements([caption, tableBlock, table, th, tr, td]);
};
