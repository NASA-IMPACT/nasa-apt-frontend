import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import {
  ELEMENT_LINK,
  DEFAULTS_LINK,
  getRenderElement,
  LinkPlugin as LinkPlugin$,
  unwrapNodes,
  upsertLinkAtSelection,
  someNode,
  isUrl,
  withRemoveEmptyNodes
} from '@udecode/slate-plugins';
import isHotkey from 'is-hotkey';
import castArray from 'lodash.castarray';

import { modKey } from '../common/utils';
import { LinkElement } from './link-element';
import { isSelectionActionAllowed } from '../../editor-toolbar';

export * from './with-link-editor';
export * from './link-editor-toolbar';

export const LINK = ELEMENT_LINK;

// Function for link handling composition.
// Override Link's module withLink function to prevent errors when pasting links.
export const withLink = (editor) => {
  const { insertData, insertText } = editor;

  const link = {
    ...DEFAULTS_LINK.link,
    isUrl: isUrl,
    component: LinkElement
  };

  // Editor hook for pasted data.
  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text) {
      // If we're already over a node just add text to the link.
      if (someNode(editor, { match: { type: link.type } })) {
        return insertText(text);
      }

      if (isUrl(text)) {
        return upsertLinkAtSelection(editor, text, {
          link
        });
      }
    }

    insertData(data);
  };

  editor = withRemoveEmptyNodes({ type: link.type })(editor);

  return editor;
};

/**
 * Return the Bounding Rect of the current DOM selection.
 */
const getCurrentSelectionRect = () => {
  const domSelection = window.getSelection();
  if (!domSelection || domSelection.rangeCount < 1) return;

  const domRange = domSelection.getRangeAt(0);
  const rect = domRange.getBoundingClientRect();

  return rect;
};

/**
 * Callback on plugin use through shortcut or button
 *
 * @param {Editor} editor Slate editor instance.
 * @param {String} btnId The button that triggered the use.
 */
export const onLinkUse = (editor) => {
  const rect = getCurrentSelectionRect();
  const { selection } = editor;

  Transforms.collapse(editor);

  editor.linkEditor.show({
    selection,
    selectionRect: rect,
    value: '',
    origin: 'user'
  });
};

export const LinkPlugin = {
  ...LinkPlugin$(),
  renderElement: getRenderElement({
    type: LINK,
    component: LinkElement
  }),
  onKeyDown: (e, editor) => {
    if (!isSelectionActionAllowed(editor)) {
      // If the selection actions are not allowed, return.
      return;
    }

    // Ensure that all toolbar hotkeys run.
    castArray(LinkPlugin.floatToolbar).forEach((btn) => {
      if (isHotkey(btn.hotkey, e)) {
        e.preventDefault();
        LinkPlugin.onUse(editor, btn.id);
      }
    });
  },
  floatToolbar: {
    id: LINK,
    icon: 'link',
    hotkey: 'mod+K',
    label: 'Link',
    tip: (key) => `Link (${modKey(key)})`
  },
  onUse: onLinkUse
};

/**
 * Set the http protocol if it is missing.
 * @param {String} link The link to check.
 * @returns {String} The link with http protocol.
 */
function setHttp(link) {
  if (!link) {
    return link;
  }

  let newLink = link;

  if (!link.startsWith('http://') && !link.startsWith('https://')) {
    newLink = `https://${link}`;
  }

  return newLink;
}

export const onLinkEditorAction = (editor, action, payload) => {
  switch (action) {
    case 'cancel':
      // Reset the link editor to hide it.
      editor.linkEditor.reset();
      break;
    case 'confirm':
      {
        // Reselect value.
        Transforms.select(editor, editor.linkEditor.getData().selection);
        // Upsert the link.
        upsertLinkAtSelection(editor, setHttp(payload.value), { wrap: true });
        // Refocus the editor.
        ReactEditor.focus(editor);
        // Reset the link editor to hide it.
        editor.linkEditor.reset();
      }
      break;
    case 'remove':
      {
        unwrapNodes(editor, {
          at: editor.linkEditor.getData().selection,
          match: { type: LINK }
        });
        // Reset the link editor to hide it.
        editor.linkEditor.reset();
      }
      break;
  }
};
