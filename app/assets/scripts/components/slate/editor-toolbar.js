import React from 'react';
import isHotkey from 'is-hotkey';
import T from 'prop-types';
import { Toolbar, ToolbarLabel, ToolbarIconButton } from '@devseed-ui/toolbar';

import { toolbarOl, toolbarUl } from './plugins/list';
import { toolbarEquation } from './plugins/equation';
import { toolbarImage } from './plugins/image';
import { toolbarReference } from './plugins/reference';
import { toolbarTable } from './plugins/table';
import { toolbarSubSection } from './plugins/subsection';

const blockActions = [
  toolbarUl,
  toolbarOl,
  toolbarTable,
  toolbarEquation,
  toolbarImage,
  toolbarReference,
  toolbarSubSection
];

export const toolbarAction = (event) => {
  for (const btn of blockActions) {
    if (isHotkey(btn.hotkey, event)) {
      return btn.id;
    }
  }
  return null;
};

export default function EditorToolbar(props) {
  const { onAction } = props;

  return (
    <Toolbar>
      <ToolbarLabel>Insert</ToolbarLabel>
      {blockActions.map((btn) => (
        <ToolbarIconButton
          key={btn.id}
          useIcon={btn.icon}
          data-tip={btn.tip(btn.hotkey)}
          onClick={() => onAction(btn.id)}
        >
          {btn.label}
        </ToolbarIconButton>
      ))}
    </Toolbar>
  );
}

EditorToolbar.propTypes = {
  onAction: T.func
};
