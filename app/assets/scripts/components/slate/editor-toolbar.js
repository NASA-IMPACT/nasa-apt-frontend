import React from 'react';
import T from 'prop-types';
import { useSlate } from 'slate-react';
import castArray from 'lodash.castarray';
import { Toolbar, ToolbarLabel, ToolbarIconButton } from '@devseed-ui/toolbar';

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
    </Toolbar>
  );
}

EditorToolbar.propTypes = {
  plugins: T.array
};
