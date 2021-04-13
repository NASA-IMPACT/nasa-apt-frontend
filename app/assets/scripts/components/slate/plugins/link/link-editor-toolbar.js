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

import {
  FormGroup,
  FormGroupHeader,
  FormLabel,
  FormGroupBody,
  FormInput as FormInput$
} from '@devseed-ui/form';

import { FloatingToolbar } from '../../editor-toolbar';
import PortalContainer from '../common/portal-container';
import useRectFollow from '../common/use-rect-follow';
import useOutsideClick from '../common/use-outside-click';
import { onLinkEditorAction as onAction } from '.';

const ToolbarLinkHeader = styled(FormGroupHeader)`
  ${visuallyHidden};
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

  const outsideClickListener = useCallback(() => {
    if (active) {
      // Cancel
      onAction(editor, 'cancel');
    }
  }, [active, editor]);

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

  // Element positioning based on the selection DOM client rect.
  useRectFollow({ ref, rect: at });

  // Listener for outside clicks
  useOutsideClick({ ref, listener: outsideClickListener });

  useEffect(() => {
    // Focus when the link editor activates but only if its value is empty. In
    // this case it will not autofocus when clicking on an existing link.
    if (active && fieldRef.current && !value) {
      fieldRef.current.focus();
    }
  }, [fieldRef, active, value]);

  // Reset the field value when input changes.
  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  const isValidUrl = isUrl(draftValue);

  return (
    <PortalContainer>
      <FloatingToolbar ref={ref} isHidden={!active}>
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
          <ToolbarIconButton
            forwardedAs='a'
            href={isValidUrl ? draftValue : '#'}
            useIcon='expand-top-right'
            disabled={!isValidUrl}
            target='_blank'
            rel='noopener noreferrer'
            title='Visit link'
          >
            Visit
          </ToolbarIconButton>
          <VerticalDivider />
          <ToolbarIconButton
            useIcon='trash-bin'
            onClick={() => onAction(editor, 'remove')}
            title='Remove link'
          >
            Remove
          </ToolbarIconButton>
        </Toolbar>
      </FloatingToolbar>
    </PortalContainer>
  );
}
