import React, { useCallback, useEffect, useRef, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { useSlate } from 'slate-react';
import {
  getPreventDefaultHandler,
  toggleMark,
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
import { LinkPlugin } from './plugins/link';

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

// Display the toolbar buttons for the plugins that define a toolbar.
export function EditorFloatingToolbar(props) {
  const editor = useSlate();
  const ref = useRef(null);

  const [hidden] = useBalloonShow({ editor, ref, hiddenDelay: 0 });
  useBalloonMove({ editor, ref, direction: 'top' });

  return (
    <PortalContainer>
      <FloatingToolbar ref={ref} isHidden={hidden}>
        <Button
          onMouseDown={getPreventDefaultHandler(toggleMark, editor, 'bold')}
        >
          B
        </Button>
        <Button>I</Button>
        <Button
          useIcon={LinkPlugin.floatToolbar.icon}
          hideText
          data-tip={LinkPlugin.floatToolbar.tip(LinkPlugin.floatToolbar.hotkey)}
          onMouseDown={getPreventDefaultHandler(
            props.onL,
            editor,
            LinkPlugin.floatToolbar.id
          )}
        >
          {LinkPlugin.floatToolbar.label}
        </Button>
      </FloatingToolbar>
    </PortalContainer>
  );
}

EditorFloatingToolbar.propTypes = {};
