import isHotkey from 'is-hotkey';
import { Transforms } from 'slate';
import castArray from 'lodash.castarray';
import { getAbove, getRenderElement } from '@udecode/slate-plugins';

import { getPathForRootBlockInsert, modKey } from '../common/utils';
import EquationElement from './equation-element';
import { isFocusedAnd } from '../common/is-focused-compose';
import { isInNodeType } from '../common/is-node-type';

export * from './equation-modal';
export * from './with-equation-modal';

// Plugin type.
export const EQUATION = 'equation';

/**
 * Check if the current selection is inside a EQUATION node
 *
 * @param {Editor} editor The slate editor instance
 * @returns boolean
 */
const isInEquation = (editor) => isInNodeType(editor, EQUATION);

/**
 * Remove the EQUATION at selection
 * @param {Editor} editor The slate editor instance
 */
const deleteEquation = (editor) => {
  if (isInEquation(editor)) {
    const entry = getAbove(editor, { match: { type: EQUATION } });
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
export const upsertEquation = (editor, equation, nodePath) => {
  const node = {
    type: EQUATION,
    children: [{ text: equation }]
  };

  if (nodePath) {
    Transforms.removeNodes(editor, { at: nodePath });
    Transforms.insertNodes(editor, node, { at: nodePath });
  } else {
    const { selection } = editor.equationModal.getData();
    Transforms.select(editor, selection);

    const path = getPathForRootBlockInsert(editor);
    Transforms.insertNodes(editor, node, { at: path });
    Transforms.select(editor, path);
  }
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
    case 'info-latex':
      editor.simpleModal.show({ id: 'latex-modal' });
      break;
  }
};

// Plugin definition for slate-plugins framework.
export const EquationPlugin = {
  voidTypes: [EQUATION],
  name: 'LaTeX equation',
  renderElement: getRenderElement({
    type: EQUATION,
    component: EquationElement
  }),
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
      id: 'info-latex',
      icon: 'circle-information',
      hotkey: 'mod+Shift+I',
      label: 'LaTeX cheatsheet',
      tip: (key) => `LaTeX cheatsheet (${modKey(key)})`,
      isInContext: isFocusedAnd(isInEquation)
    },
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
