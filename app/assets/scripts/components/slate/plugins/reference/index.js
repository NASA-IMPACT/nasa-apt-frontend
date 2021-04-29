import isHotkey from 'is-hotkey';
import { Transforms } from 'slate';
import castArray from 'lodash.castarray';
import { getRenderElement } from '@udecode/slate-plugins';

import { modKey } from '../common/utils';
import { isValidReferenceLocation } from './is-valid';

import Reference from './reference';

export * from './reference-modal';
export * from './with-reference-modal';

// Plugin type.
export const REFERENCE = 'ref';

/**
 * Insert a reference.
 *
 * @param {Editor} editor Slate editor instance.
 * @param {Int} refId Reference id
 */
export const insertReference = (editor, refId) => {
  const { selection } = editor.referenceModal.getData();

  // References are inserted at the end of a selection.
  if (selection) {
    Transforms.select(editor, selection);
    Transforms.collapse(editor, { edge: 'end' });
  }

  const node = {
    type: REFERENCE,
    refId,
    children: [{ text: '' }]
  };

  Transforms.insertNodes(editor, node);
};

/**
 * Callback on plugin use through shortcut or button
 *
 * @param {Editor} editor Slate editor instance.
 * @param {String} btnId The button that triggered the use.
 */
export const onReferenceUse = (editor) => {
  if (isValidReferenceLocation(editor)) {
    const selection = editor.selection;
    Transforms.deselect(editor);
    editor.referenceModal.show({ selection });
  }
};

// Plugin definition for slate-plugins framework.
export const ReferencePlugin = {
  voidTypes: [REFERENCE],
  inlineTypes: [REFERENCE],
  renderElement: getRenderElement({
    type: REFERENCE,
    component: Reference
  }),
  onKeyDown: (e, editor) => {
    castArray(ReferencePlugin.toolbar).forEach((btn) => {
      if (isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        ReferencePlugin.onUse(editor, btn.id);
      }
    });
  },
  toolbar: {
    id: REFERENCE,
    icon: 'book-bookmark',
    hotkey: 'mod+E',
    label: 'Reference',
    tip: (key) => `Reference (${modKey(key)})`,
    isDisabled: (editor) => !isValidReferenceLocation(editor)
  },
  onUse: onReferenceUse
};
