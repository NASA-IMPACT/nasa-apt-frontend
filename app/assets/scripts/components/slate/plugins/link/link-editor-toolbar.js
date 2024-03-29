import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSlate } from 'slate-react';
import styled from 'styled-components';
import { isUrl } from '@udecode/slate-plugins';
import { visuallyHidden } from '@devseed-ui/theme-provider';
import {
  Toolbar,
  ToolbarIconButton,
  VerticalDivider
} from '@devseed-ui/toolbar';
import { Button } from '@devseed-ui/button';

import {
  FormGroup,
  FormGroupHeader,
  FormLabel,
  FormGroupBody,
  FormInput as FormInput$
} from '@devseed-ui/form';

import useOutsideClick from '../common/use-outside-click';
import { onLinkEditorAction as onAction } from '.';
import { FloatingControl } from '../../floating-control';

const ToolbarLinkHeader = styled(FormGroupHeader)`
  ${visuallyHidden}
`;

// Keeping transition: all breaks the focus. This happens because with
// transition: all, the position also gets queued for animation, and the browser
// can't focus the field until that is finished, effectively discarding the
// focus event.
const FormInput = styled(FormInput$)`
  transition: border 0.24s ease 0s;
`;

export function EditorLinkToolbar() {
  const editor = useSlate();

  const {
    visible: active,
    selectionRect: at,
    value
  } = editor.linkEditor.getData();

  // Toolbar ref. Needed for outside click events and positioning.
  const ref = useRef(null);
  // Field ref needed for keypress events like Enter and Esc.
  const fieldRef = useRef(null);
  const [draftValue, setDraftValue] = useState('');
  // Because of how the FloatingControl animation works, when this component
  // mounts, the children are not necessarily mounted. We can use the prop
  // onChildrenMountState to be notified of the children state, and have to
  // track it on the state so the component can re-render.
  const [childrenMountedState, setChildrenMountedState] = useState(false);

  const outsideClickListener = useCallback(
    (event) => {
      // If the click outside originates in the link button of the floating
      // toolbar, ignore it. Since the toolbar takes a bit to show up (in part
      // because of the css transition on the visibility property) the outside
      // click fires and it is for all intents and purposes clicking outside
      // (the triggering link). In this case we ignore it.
      if (event.target.classList.contains('fl_toolbar-a')) return;

      if (active) {
        // Cancel
        onAction(editor, 'cancel');
      }
    },
    [active, editor]
  );

  const onFieldKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Confirm
      onAction(editor, 'confirm', { value: draftValue });
    } else if (e.key === 'Escape') {
      e.preventDefault();
      // Cancel
      onAction(editor, 'cancel');
    }
  };

  // Listener for outside clicks
  useOutsideClick({ ref, listener: outsideClickListener });

  useEffect(() => {
    let id;
    // Focus when the link editor activates but only if its value is empty. In
    // this case it will not autofocus when clicking on an existing link.
    if (active && fieldRef.current && !value) {
      // Because the toolbar takes a bit to appear we need a timeout otherwise
      // when we try to focus the field is not in view.
      id = setTimeout(() => {
        fieldRef.current.focus();
      }, 150);
    }
    return () => {
      id && clearTimeout(id);
    };
  }, [childrenMountedState, fieldRef, active, value]);

  // Reset the field value when input changes.
  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  const isValidUrl = isUrl(draftValue);

  return (
    <FloatingControl
      visible={active}
      anchor={at}
      ref={ref}
      onChildrenMountState={setChildrenMountedState}
    >
      <FormGroup>
        <ToolbarLinkHeader>
          <FormLabel htmlFor='link-editor-url'>Input</FormLabel>
        </ToolbarLinkHeader>
        <FormGroupBody>
          <FormInput
            ref={fieldRef}
            type='text'
            id='link-editor-url'
            onKeyDown={onFieldKeyDown}
            placeholder='Enter link URL'
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
          />
        </FormGroupBody>
      </FormGroup>
      <Toolbar>
        <ToolbarIconButton
          useIcon='tick--small'
          onClick={() => onAction(editor, 'confirm', { value: draftValue })}
          title='Save link'
        >
          Confirm
        </ToolbarIconButton>
        <Button
          forwardedAs='a'
          href={isValidUrl ? draftValue : '#'}
          useIcon='expand-top-right'
          disabled={!isValidUrl}
          target='_blank'
          hideText
          rel='noopener noreferrer'
          title='Visit link'
        >
          Visit
        </Button>
        <VerticalDivider />
        <ToolbarIconButton
          useIcon='trash-bin'
          onClick={() => onAction(editor, 'remove')}
          title='Remove link'
        >
          Remove
        </ToolbarIconButton>
      </Toolbar>
    </FloatingControl>
  );
}
