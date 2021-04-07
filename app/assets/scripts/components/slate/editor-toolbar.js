import React, { useRef } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { useSlate } from 'slate-react';
import {
  getNodes,
  getPreventDefaultHandler,
  isSelectionExpanded,
  useBalloonMove,
  useBalloonShow
} from '@udecode/slate-plugins';
import castArray from 'lodash.castarray';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  Toolbar as Toolbar$,
  ToolbarLabel,
  ToolbarIconButton
} from '@devseed-ui/toolbar';
import { Button } from '@devseed-ui/button';

import Tip from '../common/tooltip';
import PortalContainer from './plugins/common/portal-container';
import { modKey, REDO_HOTKEY, UNDO_HOTKEY } from './plugins/common/utils';
import { isMarkActive } from './plugins/common/marks';
import { SUB_SECTION } from './plugins/subsection';
import { EQUATION } from './plugins/equation';

const Toolbar = styled(Toolbar$)`
  background-color: ${themeVal('color.baseAlphaD')};
  padding: ${glsp(0.25, 1)};
`;

export const FloatingToolbar = styled.div`
  position: absolute;
  z-index: 9999;
  top: 100%;
  white-space: nowrap;
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
  visibility: ${({ isHidden }) => (isHidden ? 'hidden' : 'visible')};
  transition: visibility 120ms linear, opacity 120ms ease-out,
    left 75ms ease-out;
  background-color: ${themeVal('color.surface')};
  border-radius: ${themeVal('shape.rounded')};
  border: 1px solid ${themeVal('color.baseAlphaD')};
  margin-top: ${glsp(-0.5)};
`;

// Display the toolbar buttons for the plugins that define a toolbar.
export function EditorToolbar(props) {
  const { plugins } = props;
  const editor = useSlate();

  return (
    <Toolbar>
      <ToolbarLabel>Insert</ToolbarLabel>
      {plugins.reduce((acc, p) => {
        if (!p.toolbar) return acc;

        return acc.concat(
          castArray(p.toolbar).map((btn) => (
            <Tip key={btn.id} title={btn.tip(btn.hotkey)}>
              <ToolbarIconButton
                useIcon={btn.icon}
                onMouseDown={getPreventDefaultHandler(p.onUse, editor, btn.id)}
              >
                {btn.label}
              </ToolbarIconButton>
            </Tip>
          ))
        );
      }, [])}
      <ToolbarLabel>Actions</ToolbarLabel>
      <Tip title={`Undo (${modKey(UNDO_HOTKEY)})`}>
        <ToolbarIconButton
          useIcon='arrow-semi-spin-ccw'
          disabled={!editor.canUndo()}
          onClick={() => {
            editor.undo();
          }}
        >
          Undo
        </ToolbarIconButton>
      </Tip>
      <Tip title={`Redo (${modKey(REDO_HOTKEY)})`}>
        <ToolbarIconButton
          useIcon='arrow-semi-spin-cw'
          disabled={!editor.canRedo()}
          onClick={() => {
            editor.redo();
          }}
        >
          Redo
        </ToolbarIconButton>
      </Tip>
    </Toolbar>
  );
}

EditorToolbar.propTypes = {
  plugins: T.array
};

// Blocks where selection related actions like inserting links and/or marks are
// not allowed.
export const SELECTION_ACTIONS_DISABLED_BLOCKS = [EQUATION, SUB_SECTION];

/**
 * Tests whether the current selection is a valid one for selection actions like
 * inserting links and/or marks. A selection is valid if it does not intersect
 * disallowed blocks.
 *
 * @param {Editor} editor The slate editor instance
 * @returns boolean
 */
export function isSelectionActionAllowed(editor) {
  if (!isSelectionExpanded(editor)) return false;

  const selectionBlocks = [
    ...getNodes(editor, {
      at: editor.selection,
      match: { type: SELECTION_ACTIONS_DISABLED_BLOCKS }
    })
  ];

  // If any of the exclude blocks are selected, it should be hidden.
  if (selectionBlocks.length) return false;

  return true;
}

const useBalloonShowExcludeBlocks = ({ editor, ref }) => {
  const [hidden] = useBalloonShow({ editor, ref, hiddenDelay: 0 });

  if (!isSelectionActionAllowed(editor)) {
    // If the selection actions are not allowed, the toolbar should be hidden.
    return true;
  }

  return hidden;
};

// Display the toolbar buttons for the plugins that define a toolbar.
export function EditorFloatingToolbar(props) {
  const { plugins } = props;
  const editor = useSlate();
  const ref = useRef(null);

  const hidden = useBalloonShowExcludeBlocks({
    editor,
    ref
  });
  useBalloonMove({ editor, ref, direction: 'top' });

  return (
    <PortalContainer>
      <FloatingToolbar ref={ref} isHidden={hidden}>
        {plugins.reduce((acc, p) => {
          if (!p.floatToolbar) return acc;

          return acc.concat(
            castArray(p.floatToolbar).map((btn) => (
              <Tip key={btn.id} title={btn.tip(btn.hotkey)}>
                <Button
                  useIcon={btn.icon}
                  hideText
                  active={isMarkActive(editor, btn.id)}
                  onMouseDown={getPreventDefaultHandler(
                    p.onUse,
                    editor,
                    btn.id
                  )}
                >
                  {btn.label}
                </Button>
              </Tip>
            ))
          );
        }, [])}
      </FloatingToolbar>
    </PortalContainer>
  );
}

EditorFloatingToolbar.propTypes = {
  plugins: T.array
};
