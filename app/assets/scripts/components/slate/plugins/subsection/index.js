import isHotkey from 'is-hotkey';
import { Transforms } from 'slate';
import { getRenderElement } from '@udecode/slate-plugins';

import { modKey } from '../common/utils';
import SubSection from './sub-section';

// Plugin type.
export const SUB_SECTION = 'sub-section';

/**
 * Insert an equation.
 *
 * @param {Editor} editor Slate editor instance.
 */
export const insertSubSection = (editor) => {
  const node = {
    type: SUB_SECTION,
    children: [{ text: '' }]
  };

  Transforms.insertNodes(editor, node, {
    // By using the mode highest and a match for !!type we ensure that we insert
    // this at the root level, after an element with a type, which will be
    // anyone except the Editor's first child.
    // This is needed to ensure a subsection doesn't end up inside a list.
    match: (n) => !!n.type,
    mode: 'highest'
  });
};

// Plugin definition for slate-plugins framework.
export const SubSectionPlugin = {
  renderElement: getRenderElement({
    type: SUB_SECTION,
    component: SubSection
  }),
  onKeyDown: (e, editor) => {
    if (isHotkey(toolbarSubSection.hotkey, e)) {
      e.preventDefault();
      insertSubSection(editor);
    }
  }
};

// Definition for the toolbar and keyboard shortcut.
export const toolbarSubSection = {
  id: SUB_SECTION,
  icon: 'pilcrow',
  hotkey: 'mod+L',
  label: 'Sub Section',
  tip: (key) => `Sub Section (${modKey(key)})`
};
