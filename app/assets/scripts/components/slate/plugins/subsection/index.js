import isHotkey from 'is-hotkey';
import { Editor, Transforms, Node } from 'slate';
import castArray from 'lodash.castarray';
import { getAbove, getNodes, getRenderElement } from '@udecode/slate-plugins';

import { modKey } from '../common/utils';
import { isFocusedAnd } from '../common/is-focused-compose';
import { isInNodeType } from '../common/is-node-type';

import SubSection from './sub-section';

// Plugin type.
export const SUB_SECTION = 'sub-section';

/**
 * Check if the current selection is inside a SUB_SECTION node
 *
 * @param {Editor} editor The slate editor instance
 * @returns boolean
 */
export const isInSubsection = (editor) => isInNodeType(editor, SUB_SECTION);

/**
 * Remove the SUB_SECTION at selection
 * @param {Editor} editor The slate editor instance
 */
export const deleteSubSection = (editor) => {
  if (isInSubsection(editor)) {
    const entry = getAbove(editor, { match: { type: SUB_SECTION } });
    if (entry) {
      Transforms.removeNodes(editor, {
        at: entry[1]
      });
    }
  }
};

/**
 * Insert a subsection heading.
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
export const onSubsectionUse = (editor, btnId) => {
  switch (btnId) {
    case 'heading':
      insertSubSection(editor);
      break;
    case 'delete-heading':
      deleteSubSection(editor);
      break;
  }
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
    icon: 'heading',
    hotkey: 'mod+L',
    label: 'Heading',
    tip: (key) => `Heading (${modKey(key)})`
  },
  contextToolbar: {
    id: 'delete-heading',
    icon: 'trash-bin',
    hotkey: 'mod+Shift+D',
    label: 'Remove heading',
    tip: (key) => `Remove heading (${modKey(key)})`,
    isInContext: isFocusedAnd(isInSubsection)
  },
  onUse: onSubsectionUse
};

/**
 * Enhances the slate editor to add subsections ids.
 * It ensures the ids are unique for all the document.
 *
 * @param {Editor} editor The slate editor.
 */
export const withSubsectionId = (editor) => {
  const { onChange } = editor;

  editor.onChange = () => {
    // Get all the subsections to normalize.
    Editor.withoutNormalizing(editor, () => {
      const nodes = [
        ...getNodes(editor, { match: { type: SUB_SECTION }, at: [] })
      ];

      let idTracker = {};

      nodes.forEach(([node, path]) => {
        // Create the node id from the content.
        const nodeContent = Node.string(node);
        const nodeId = nodeContent.toLowerCase().replace(/[^a-z0-9]/g, '-');

        // Track the id so there are not two equal ones.
        idTracker[nodeId] =
          typeof idTracker[nodeId] === 'undefined' ? 0 : idTracker[nodeId] + 1;

        // Add id count if not unique.
        const newId =
          nodeId + (idTracker[nodeId] ? `-${idTracker[nodeId]}` : '');

        Transforms.setNodes(editor, { id: newId }, { at: path });
      });
    });
    return onChange();
  };

  return editor;
};
