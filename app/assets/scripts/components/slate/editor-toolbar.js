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

import PortalContainer from './plugins/common/portal-container';
import { modKey } from './plugins/common/utils';
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
  white-space: nowrap;
  visibility: ${({ isHidden }) => (isHidden ? 'hidden' : 'visible')};
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
  transition: top 75ms ease-out, left 75ms ease-out;
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
            <ToolbarIconButton
              key={btn.id}
              useIcon={btn.icon}
              data-tip={btn.tip(btn.hotkey)}
              onMouseDown={getPreventDefaultHandler(p.onUse, editor, btn.id)}
            >
              {btn.label}
            </ToolbarIconButton>
          ))
        );
      }, [])}
      <ToolbarLabel>Actions</ToolbarLabel>
      <ToolbarIconButton
        useIcon='arrow-semi-spin-ccw'
        data-tip={`Undo (${modKey('mod+Z')})`}
        onClick={() => {}}
      >
        Undo
      </ToolbarIconButton>
      <ToolbarIconButton
        useIcon='arrow-semi-spin-cw'
        data-tip={`Undo (${modKey('mod+Shift+Z')})`}
        onClick={() => {}}
      >
        Redo
      </ToolbarIconButton>
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
              <Button
                key={btn.id}
                useIcon={btn.icon}
                hideText
                data-tip={btn.tip(btn.hotkey)}
                active={isMarkActive(editor, btn.id)}
                onMouseDown={getPreventDefaultHandler(p.onUse, editor, btn.id)}
              >
                {btn.label}
              </Button>
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
