import isHotkey from 'is-hotkey';
import { Transforms } from 'slate';
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

// Plugin definition for slate-plugins framework.
export const EquationPlugin = {
  renderElement: getRenderElement({
    type: EQUATION,
    component: EquationEditor
  }),
  onKeyDown: (e, editor) => {
    if (isHotkey(toolbarEquation.hotkey, e)) {
      e.preventDefault();
      insertEquation(editor);
    }
  }
};

// Definition for the toolbar and keyboard shortcut.
export const toolbarEquation = {
  id: 'equation',
  icon: 'pi',
  hotkey: 'mod+J',
  label: 'Equation',
  tip: (key) => `Equation (${modKey(key)})`
};
