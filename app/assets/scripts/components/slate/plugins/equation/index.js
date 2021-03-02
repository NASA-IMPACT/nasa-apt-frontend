import isHotkey from 'is-hotkey';
import { Transforms } from 'slate';
import castArray from 'lodash.castarray';
import { getRenderElement } from '@udecode/slate-plugins';

import { modKey } from '../common/utils';
import EquationEditor from './equation-editor';

// Plugin type.
export const EQUATION = 'equation';

/**
 * Insert an equation.
 *
 * @param {Editor} editor Slate editor instance.
 */
export const insertEquation = (editor) => {
  const node = {
    type: EQUATION,
    children: [{ text: '\\LaTeX~equation' }]
  };

  Transforms.insertNodes(editor, node, {
    // By using the mode highest and a match for !!type we ensure that we insert
    // this at the root level, after an element with a type, which will be
    // anyone except the Editor's first child.
    // This is needed to ensure an equation doesn't end up inside a list.
    match: (n) => !!n.type,
    mode: 'highest'
  });
};

/**
 * Callback on plugin use through shortcut or button
 *
 * @param {Editor} editor Slate editor instance.
 * @param {String} btnId The button that triggered the use.
 */
export const onEquationUse = (editor) => {
  insertEquation(editor);
};

// Plugin definition for slate-plugins framework.
export const EquationPlugin = {
  renderElement: getRenderElement({
    type: EQUATION,
    component: EquationEditor
  }),
  onKeyDown: (e, editor) => {
    castArray(EquationPlugin.toolbar).forEach((btn) => {
      if (isHotkey(btn.hotkey, e)) {
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
  onUse: onEquationUse
};
