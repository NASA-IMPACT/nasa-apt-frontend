import isHotkey from 'is-hotkey';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import castArray from 'lodash.castarray';
import { getAbove, getRenderElements } from '@udecode/slate-plugins';

import { getPathForRootBlockInsert, modKey } from '../common/utils';
import EquationElement from './equation-element';
import { isFocusedAnd } from '../common/is-focused-compose';
import { isInNodeType } from '../common/is-node-type';

export * from './equation-modal';
export * from './with-equation-modal';

// Plugin type.
export const EQUATION = 'equation';
export const EQUATION_INLINE = 'equation-inline';

/**
 * Check if the current selection is inside a EQUATION node
 *
 * @param {Editor} editor The slate editor instance
 * @returns boolean
 */
const isInEquation = (editor) =>
  isInNodeType(editor, EQUATION) || isInNodeType(editor, EQUATION_INLINE);

/**
 * Returns true if the node is an inline equation
 *
 * @param {Node} node The slate editor instance
 * @returns boolean
 */
export const isInlineEquation = (node) => node.type === 'equation-inline';

/**
 * Remove the EQUATION at selection
 * @param {Editor} editor The slate editor instance
 */
const deleteEquation = (editor) => {
  if (isInEquation(editor)) {
    const entry =
      getAbove(editor, { match: { type: EQUATION } }) ||
      getAbove(editor, { match: { type: EQUATION_INLINE } });
    if (entry) {
      Transforms.removeNodes(editor, {
        at: entry[1]
      });
    }
  }
};

/**
 * Insert an equation.
 *
 * @param {Editor} editor Slate editor instance.
 */
export const insertEquation = (editor, equation, isInline) => {
  const node = {
    type: isInline ? EQUATION_INLINE : EQUATION,
    children: [{ text: equation }]
  };

  const { selection } = editor.equationModal.getData();
  Transforms.select(editor, selection);

  if (isInline) {
    Transforms.insertNodes(editor, node);
  } else {
    const path = getPathForRootBlockInsert(editor);
    Transforms.insertNodes(editor, node, { at: path });
    Transforms.select(editor, path);
  }
};

export const updateEquation = (editor, equation, isInline, element) => {
  const node = {
    type: isInline ? EQUATION_INLINE : EQUATION,
    children: [{ text: equation }]
  };

  const nodePath = ReactEditor.findPath(editor, element);
  // replace existing equation, we first add the updated equation and
  // then remove the outdated one
  Transforms.insertNodes(editor, node, { at: nodePath });

  // Adding a new inline node adds an empty text node after the equation, we need to
  // remove the node after that.
  const nodeOffset = isInline ? 2 : 1;
  const removeElementIndex = nodePath[nodePath.length - 1] + nodeOffset;
  const parentPath = nodePath.slice(0, -1);
  Transforms.removeNodes(editor, { at: [...parentPath, removeElementIndex] });
};

/**
 * Callback on plugin use through shortcut or button
 *
 * @param {Editor} editor Slate editor instance.
 * @param {String} btnId The button that triggered the use.
 */
export const onEquationUse = (editor, btnId) => {
  const selection = editor.selection;

  switch (btnId) {
    case 'equation':
      editor.equationModal.show({ selection });
      break;
    case 'edit-equation':
      editor.equationModal.show({ selection });
      break;
    case 'delete-equation':
      deleteEquation(editor);
      break;
  }
};

// Plugin definition for slate-plugins framework.
export const EquationPlugin = {
  voidTypes: [EQUATION, EQUATION_INLINE],
  inlineTypes: [EQUATION_INLINE],
  name: 'LaTeX equation',
  renderElement: getRenderElements([
    { type: EQUATION_INLINE, component: EquationElement },
    { type: EQUATION, component: EquationElement }
  ]),
  onKeyDown: (e, editor) => {
    castArray(EquationPlugin.toolbar).forEach((btn) => {
      if (isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        EquationPlugin.onUse(editor, btn.id);
      }
    });
    castArray(EquationPlugin.contextToolbar).forEach((btn) => {
      if (btn.isInContext?.(editor) && isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        EquationPlugin.onUse(editor, btn.id);
      }
    });
  },
  // Definition for the toolbar and keyboard shortcut.
  toolbar: {
    id: EQUATION,
    icon: 'pi',
    hotkey: 'mod+J',
    label: 'Equation',
    tip: (key) => `Equation (${modKey(key)})`
  },
  contextToolbar: [
    {
      id: 'edit-equation',
      icon: 'pencil',
      hotkey: 'mod+Shift+E',
      label: 'Edit equation',
      tip: (key) => `Edit equation (${modKey(key)})`,
      isInContext: isFocusedAnd(isInEquation)
    },
    {
      id: 'delete-equation',
      icon: 'trash-bin',
      hotkey: 'mod+Shift+D',
      label: 'Remove equation',
      tip: (key) => `Remove equation (${modKey(key)})`,
      isInContext: isFocusedAnd(isInEquation)
    }
  ],
  onUse: onEquationUse
};
