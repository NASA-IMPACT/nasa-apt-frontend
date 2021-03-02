import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { useSlate } from 'slate-react';
import castArray from 'lodash.castarray';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  Toolbar as Toolbar$,
  ToolbarLabel,
  ToolbarIconButton
} from '@devseed-ui/toolbar';

import { modKey } from './plugins/common/utils';

const Toolbar = styled(Toolbar$)`
  background-color: ${themeVal('color.baseAlphaD')};
  padding: ${glsp(0.25, 1)};
`;

// Display the toolbar buttons for the plugins that define a toolbar.
export default function EditorToolbar(props) {
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
              onClick={() => p.onUse(editor, btn.id)}
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
