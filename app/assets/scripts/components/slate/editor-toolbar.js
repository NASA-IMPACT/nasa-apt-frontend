import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { ReactEditor, useSlate } from 'slate-react';
import {
  getNodes,
  getPreventDefaultHandler,
  isSelectionExpanded
} from '@udecode/slate-plugins';
import castArray from 'lodash.castarray';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  Toolbar,
  ToolbarLabel,
  ToolbarIconButton,
  VerticalDivider
} from '@devseed-ui/toolbar';

import Tip from '../common/tooltip';
import { FloatingControl } from './floating-control';

import { modKey, REDO_HOTKEY, UNDO_HOTKEY } from './plugins/common/utils';
import { isMarkActive } from './plugins/common/marks';
import { SUB_SECTION } from './plugins/subsection';
import { EQUATION } from './plugins/equation';
import {
  SHORTCUTS_HOTKEY,
  ShortcutsModalPlugin
} from './plugins/shortcuts-modal';
import { useSelectionRect } from './plugins/common/use-selection-rect';

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

const ToolbarGroup = styled.div`
  display: flex;
`;

const ContextualToolbar = styled(Toolbar)`
  position: relative;

  &.contextual-actions-enter {
    opacity: 0;
    left: ${glsp(-3)};
  }
  &.contextual-actions-enter-active {
    transition: opacity 200ms, left 200ms;
    opacity: 1;
    left: 0;
  }
  &.contextual-actions-exit {
    opacity: 1;
    left: 0;
  }
  &.contextual-actions-exit-active {
    transition: opacity 200ms, left 200ms;
    opacity: 0;
    left: ${glsp(-1)};
  }
`;

export const FloatingToolbar = styled.div`
  position: absolute;
  top: 90%;
  z-index: 9999;
  display: grid;
  grid-gap: ${glsp(0.25)};
  margin-top: ${glsp(-0.5)};
  padding: ${glsp(0.25)};
  background-color: ${themeVal('color.surface')};
  box-shadow: ${themeVal('boxShadow.elevationD')};
  border-radius: ${themeVal('shape.rounded')};
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
  visibility: ${({ isHidden }) => (isHidden ? 'hidden' : 'visible')};
  transition: visibility 120ms linear 10ms, opacity 120ms ease-out 10ms;

  > * {
    grid-row: 1;
  }
`;

const ToolbarRenderableItem = (props) => {
  const { editor, btn, toolbarType, plugin, ...rest } = props;

  const mouseEvents = {
    onMouseDown: (e) => {
      // When the user clicks the item we want to reset the toolbarEvent because
      // if the clicked item disappears (like que trash can) the "leave" event
      // is never triggered.
      editor.toolbarEvent = null;
      return getPreventDefaultHandler(plugin.onUse, editor, btn.id)(e);
    },
    ...getHoverEventHandlers(editor, toolbarType, btn)
  };

  if (typeof btn.render === 'function') {
    return btn.render({
      editor,
      plugin,
      item: btn,
      buttonProps: {
        ...mouseEvents
      }
    });
  }

  return (
    <Tip key={btn.id} title={btn.tip(btn.hotkey)}>
      <ToolbarIconButton
        useIcon={btn.icon}
        disabled={!ReactEditor.isFocused(editor) || btn.isDisabled?.(editor)}
        {...mouseEvents}
        {...rest}
      >
        {btn.label}
      </ToolbarIconButton>
    </Tip>
  );
};

ToolbarRenderableItem.propTypes = {
  editor: T.object,
  btn: T.object,
  toolbarType: T.string,
  plugin: T.object
};

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
          <ToolbarRenderableItem
            key={btn.id}
            editor={editor}
            btn={btn}
            toolbarType='contextual'
            plugin={p}
          />
        ))
    );
  }, []);

  return (
    <EditorActions>
      <ToolbarGroup>
        <Toolbar>
          <ToolbarLabel>Insert</ToolbarLabel>
          {plugins.reduce((acc, p) => {
            if (!p.toolbar) return acc;

            return acc.concat(
              castArray(p.toolbar).map((btn) => (
                <ToolbarRenderableItem
                  key={btn.id}
                  editor={editor}
                  btn={btn}
                  toolbarType='main'
                  plugin={p}
                />
              ))
            );
          }, [])}
        </Toolbar>
        <TransitionGroup component={null}>
          {!!contextualActions.length && (
            <Contextual>{contextualActions}</Contextual>
          )}
        </TransitionGroup>
      </ToolbarGroup>

      <Toolbar>
        <Tip title={`Undo (${modKey(UNDO_HOTKEY)})`}>
          <ToolbarIconButton
            useIcon='arrow-semi-spin-ccw'
            disabled={!ReactEditor.isFocused(editor) || !editor.canUndo()}
            onMouseDown={() => {
              editor.undo();
            }}
          >
            Undo
          </ToolbarIconButton>
        </Tip>
        <Tip title={`Redo (${modKey(REDO_HOTKEY)})`}>
          <ToolbarIconButton
            useIcon='arrow-semi-spin-cw'
            disabled={!ReactEditor.isFocused(editor) || !editor.canRedo()}
            onMouseDown={() => {
              editor.redo();
            }}
          >
            Redo
          </ToolbarIconButton>
        </Tip>
        <VerticalDivider />
        <Tip title={`Keyboard shortcuts (${modKey(SHORTCUTS_HOTKEY)})`}>
          <ToolbarIconButton
            useIcon='keyboard'
            onMouseDown={() => {
              ShortcutsModalPlugin.onUse(editor, 'shortcut-modal');
            }}
          >
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

// The contextual toolbar must be a separate component because otherwise the
// animation doesn't work. By being a separate component, the previous children
// are kept and they can be animated.
const Contextual = (props) => {
  const { children, ...rest } = props;
  return (
    <CSSTransition
      mountOnEnter
      unmountOnExit
      timeout={300}
      classNames='contextual-actions'
      {...rest}
    >
      <ContextualToolbar>
        <VerticalDivider />
        <ToolbarLabel>Options</ToolbarLabel>
        {children}
      </ContextualToolbar>
    </CSSTransition>
  );
};

Contextual.propTypes = {
  children: T.node
};

/**
 * Create event handlers for enter and leave events.
 *
 * @description
 * When the user interacts with the toolbar items we store what's happened in a
 * `toolbarEvent` property on the editor and then trigger a change event. This
 * allows any plugin to take advantage of an event on a toolbar item. This is
 * used for example with the table, where we show what happens when the user
 * hovers the contextual action buttons.
 *
 * @param {Editor} editor Slate editor instance
 * @param {string} origin Toolbar where the event originated
 * @param {object} toolbarItem The item interacted with
 *
 * @returns {object} props to spread on the element.
 */
const getHoverEventHandlers = (editor, origin, toolbarItem) => {
  const onMouseEnter = () => {
    editor.toolbarEvent = {
      eventType: 'enter',
      origin,
      item: toolbarItem
    };
    editor.onChange();
  };

  const onMouseLeave = () => {
    editor.toolbarEvent = null;
    editor.onChange();
  };

  return {
    onMouseEnter,
    onMouseLeave
  };
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

// Display the toolbar buttons for the plugins that define a toolbar.
export function EditorFloatingToolbar(props) {
  const { plugins } = props;
  const editor = useSlate();

  const pos = useSelectionRect({ editor });
  // If the selection actions are not allowed, the toolbar should be hidden.
  const isVisible =
    isSelectionExpanded(editor) && isSelectionActionAllowed(editor);

  return (
    <FloatingControl visible={isVisible} anchor={pos}>
      <Toolbar>
        {plugins.reduce((acc, p) => {
          if (!p.floatToolbar) return acc;

          return acc.concat(
            castArray(p.floatToolbar).map((btn) => (
              <ToolbarRenderableItem
                key={btn.id}
                editor={editor}
                btn={btn}
                toolbarType='floating'
                plugin={p}
                className={`fl_toolbar-${btn.id}`}
                active={isMarkActive(editor, btn.id)}
              />
            ))
          );
        }, [])}
      </Toolbar>
    </FloatingControl>
  );
}

EditorFloatingToolbar.propTypes = {
  plugins: T.array
};
