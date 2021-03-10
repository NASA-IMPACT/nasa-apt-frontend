import isHotkey from 'is-hotkey';
import castArray from 'lodash.castarray';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import {
  ELEMENT_LINK,
  findNode,
  isCollapsed,
  LinkPlugin as LinkPlugin$,
  renderElementLink,
  someNode,
  unwrapNodes,
  upsertLinkAtSelection,
  withLink as withLink$,
  wrapLink
} from '@udecode/slate-plugins';

import { modKey } from '../common/utils';
import { useEffect, useReducer, useState } from 'react';

export const LINK = 'link';

/**
 * Callback on plugin use through shortcut or button
 *
 * @param {Editor} editor Slate editor instance.
 * @param {String} btnId The button that triggered the use.
 */
export const onLinkUse = (editor) => {
  console.log('onue');
  const { selection } = editor;
  editor.linkEditor = {
    selection,
    active: true
  };
  editor.onChange();
};

export const LinkPlugin = {
  ...LinkPlugin$(),
  renderElement: renderElementLink(),
  onKeyDown: (e, editor) => {
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

export const withLinkEditor = (editor) => {
  editor.linkEditor = {
    active: false
  };

  return editor;
};

const linkEditorInitialState = {
  // Store whether the Link Editor is visible.
  visible: false,
  // Editor selection at the time the Link Editor is displayed. When the link
  // editor is shown, the slate editor loses focus (since the Link Editor input
  // gets focused). Once the link address is confirmed we need to know what the
  // user had selected to know where to insert the link.
  selection: null,
  // The selection rect is the DOM selection bounding rect. This is used to
  // calculate the position where the Link Editor has to be shown.
  selectionRect: null,
  // Original url value to display in the Link Editor. This is extracted from
  // the slate element when an existing link is being edited. It will be empty
  // otherwise. This could be a simple variable that gets returned since there's
  // no need to react to its changes, but using state is more inline with react
  // practices.
  value: ''
};

const linkEditorReducer = (state, action) => {
  switch (action.type) {
    case 'show':
      return {
        visible: true,
        selection: action.selection,
        selectionRect: action.selectionRect,
        value: action.value
      };
    case 'reset':
      return linkEditorInitialState;
    default:
      return state;
  }
};

export const useLinkEditor = () => {
  const [linkEditorState, dispatch] = useReducer(
    linkEditorReducer,
    linkEditorInitialState
  );

  const resetEditor = () => dispatch({ type: 'reset' });

  const onLinkEditorAction = (editor, action, payload) => {
    switch (action) {
      case 'cancel':
        resetEditor();
        break;
      case 'confirm':
        {
          // Reselect value.
          Transforms.select(editor, linkEditorState.selection);
          // Upsert the link.
          upsertLinkAtSelection(editor, payload.value, { wrap: true });
          // Refocus the editor.
          ReactEditor.focus(editor);
          // Reset the link editor to hide it
          resetEditor();
        }
        break;
      case 'remove':
        {
          unwrapNodes(editor, {
            at: linkEditorState.selection,
            match: { type: ELEMENT_LINK }
          });
          resetEditor();
        }
        break;
    }
  };

  const onLinkEditorActivate = (editor) => {
    const rect = getCurrentSelectionRect();
    dispatch({
      type: 'show',
      selection: editor.selection,
      selectionRect: rect,
      value: ''
    });
  };

  const onChangeLinkEditor = (editor) => {
    if (!editor.selection) {
      // When there's no selection, it means that the focus is on the link
      // editor. If there is a selection, then the user clicked elsewhere and we
      // dismiss the tooltip editor.
      return;
    }

    // Is the caret on a link?
    const linkUnderCaret = findNode(editor, { match: { type: ELEMENT_LINK } });
    // Selection can't be expanded.
    const caretOnLink = !!linkUnderCaret && isCollapsed(editor.selection);

    if (caretOnLink) {
      const node = ReactEditor.toDOMNode(editor, linkUnderCaret[0]);
      const rect = node.getBoundingClientRect();
      dispatch({
        type: 'show',
        selection: editor.selection,
        selectionRect: rect,
        value: linkUnderCaret[0].url
      });
    } else {
      resetEditor();
    }
  };

  return {
    isVisible: linkEditorState.visible,
    selectionRect: linkEditorState.selectionRect,
    value: linkEditorState.value,
    onActivate: onLinkEditorActivate,
    onAction: onLinkEditorAction,
    onChangeLinkEditor
  };
};

export const withLink = withLink$();

const getCurrentSelectionRect = () => {
  const domSelection = window.getSelection();
  if (!domSelection || domSelection.rangeCount < 1) return;

  const domRange = domSelection.getRangeAt(0);
  const rect = domRange.getBoundingClientRect();

  return rect;
};
