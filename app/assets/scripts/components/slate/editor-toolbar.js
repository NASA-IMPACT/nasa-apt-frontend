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
  Toolbar,
  ToolbarLabel,
  ToolbarIconButton,
  VerticalDivider
} from '@devseed-ui/toolbar';

import Tip from '../common/tooltip';
import PortalContainer from './plugins/common/portal-container';
import { modKey, REDO_HOTKEY, UNDO_HOTKEY } from './plugins/common/utils';
import { isMarkActive } from './plugins/common/marks';
import { SUB_SECTION } from './plugins/subsection';
import { EQUATION } from './plugins/equation';

const EditorActions = styled.div`
  display: grid;
  grid-gap: ${glsp()};
  grid-template-columns: 1fr min-content;
  background-color: ${themeVal('color.baseAlphaA')};
  border-radius: ${themeVal('shape.rounded')} ${themeVal('shape.rounded')} 0 0;
  box-shadow: 0 1px 0 0 ${themeVal('color.baseAlphaC')};
  padding: ${glsp(0.25, 1)};
  transition: all 0.24s ease 0s;
  clip-path: polygon(0 0, 100% 0, 100% 200%, 0% 200%);

  .is-sticky & {
    border-radius: 0;
    box-shadow: 0 1px 0 0 ${themeVal('color.baseAlphaB')},
      ${themeVal('boxShadow.elevationD')};
  }

  > * {
    grid-row: 1;
  }
`;

export const FloatingToolbar = styled.div`
  position: absolute;
  top: 90%;
  z-index: 9999;
  display: grid;
  grid-gap: ${glsp(0.25)};
  margin-top: ${glsp(-0.5)};
  padding: ${glsp(0.5)};
  background-color: ${themeVal('color.surface')};
  box-shadow: ${themeVal('boxShadow.elevationD')};
  border-radius: ${themeVal('shape.rounded')};
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
  visibility: ${({ isHidden }) => (isHidden ? 'hidden' : 'visible')};
  transition: visibility 120ms linear, opacity 120ms ease-out,
    left 75ms ease-out;

  > * {
    grid-row: 1;
  }
`;

// Display the toolbar buttons for the plugins that define a toolbar.
export function EditorToolbar(props) {
  const { plugins } = props;
  const editor = useSlate();

  const contextualActions = plugins.reduce((acc, p) => {
    if (!p.contextToolbar) return acc;

    return acc.concat(
      castArray(p.contextToolbar)
        .filter(
          ({ isInContext }) =>
            typeof isInContext === 'function' && isInContext(editor)
        )
        .map((btn) => (
          <Tip key={btn.id} title={btn.tip(btn.hotkey)}>
            <ToolbarIconButton
              useIcon={btn.icon}
              disabled={btn.isDisabled?.(editor)}
              onMouseDown={getPreventDefaultHandler(p.onUse, editor, btn.id)}
            >
              {btn.label}
            </ToolbarIconButton>
          </Tip>
        ))
    );
  }, []);

  return (
    <EditorActions>
      <Toolbar>
        <ToolbarLabel>Insert</ToolbarLabel>
        {plugins.reduce((acc, p) => {
          if (!p.toolbar) return acc;

          return acc.concat(
            castArray(p.toolbar).map((btn) => (
              <Tip key={btn.id} title={btn.tip(btn.hotkey)}>
                <ToolbarIconButton
                  useIcon={btn.icon}
                  disabled={btn.isDisabled?.(editor)}
                  onMouseDown={getPreventDefaultHandler(
                    p.onUse,
                    editor,
                    btn.id
                  )}
                >
                  {btn.label}
                </ToolbarIconButton>
              </Tip>
            ))
          );
        }, [])}

        {!!contextualActions.length && (
          <React.Fragment>
            <VerticalDivider />
            <ToolbarLabel>Options</ToolbarLabel>
            {contextualActions}
          </React.Fragment>
        )}
      </Toolbar>

      <Toolbar>
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
        <VerticalDivider />
        <Tip title='Show keyboard shortcuts'>
          <ToolbarIconButton useIcon='keyboard'>
            Keyboard shortcuts
          </ToolbarIconButton>
        </Tip>
      </Toolbar>
    </EditorActions>
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
        <Toolbar>
          {plugins.reduce((acc, p) => {
            if (!p.floatToolbar) return acc;

            return acc.concat(
              castArray(p.floatToolbar).map((btn) => (
                <Tip key={btn.id} title={btn.tip(btn.hotkey)}>
                  <ToolbarIconButton
                    className={`fl_toolbar-${btn.id}`}
                    useIcon={btn.icon}
                    active={isMarkActive(editor, btn.id)}
                    onMouseDown={getPreventDefaultHandler(
                      p.onUse,
                      editor,
                      btn.id
                    )}
                  >
                    {btn.label}
                  </ToolbarIconButton>
                </Tip>
              ))
            );
          }, [])}
        </Toolbar>
      </FloatingToolbar>
    </PortalContainer>
  );
}

EditorFloatingToolbar.propTypes = {
  plugins: T.array
};
