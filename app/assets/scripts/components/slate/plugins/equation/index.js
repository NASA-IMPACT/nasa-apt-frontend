import isHotkey from 'is-hotkey';
import { Transforms } from 'slate';
import { getRenderElement } from '@udecode/slate-plugins';

import { modKey } from '../common/utils';
import EquationEditor from './equation-editor';

export const EQUATION = 'equation';

export const insertEquation = (editor) => {
  const node = {
    type: EQUATION,
    children: [{ text: 'equation input' }]
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

export const EquationPlugin = {
  renderElement: getRenderElement({
    type: EQUATION,
    component: EquationEditor
  }),
  deserialize: () => {},
  onKeyDown: (e, editor) => {
    if (isHotkey(toolbarEquation.hotkey, e)) {
      e.preventDefault();
      insertEquation(editor);
    }
  }
  // voidTypes: [EQUATION]
};

export const toolbarEquation = {
  id: 'equation',
  icon: 'pi',
  hotkey: 'mod+J',
  label: 'Equation',
  tip: (key) => `Equation (${modKey(key)})`
};
