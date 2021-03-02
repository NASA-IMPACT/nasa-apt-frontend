import isHotkey from 'is-hotkey';
import { Transforms } from 'slate';
import castArray from 'lodash.castarray';
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

/**
 * Callback on plugin use through shortcut or button
 *
 * @param {Editor} editor Slate editor instance.
 * @param {String} btnId The button that triggered the use.
 */
export const onSubsectionUse = (editor) => {
  insertSubSection(editor);
};

// Plugin definition for slate-plugins framework.
export const SubSectionPlugin = {
  renderElement: getRenderElement({
    type: SUB_SECTION,
    component: SubSection
  }),
  onKeyDown: (e, editor) => {
    castArray(SubSectionPlugin.toolbar).forEach((btn) => {
      if (isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        SubSectionPlugin.onUse(editor, btn.id);
      }
    });
  },
  toolbar: {
    id: SUB_SECTION,
    icon: 'pilcrow',
    hotkey: 'mod+L',
    label: 'Sub Section',
    tip: (key) => `Sub Section (${modKey(key)})`
  },
  onUse: onSubsectionUse
};
