import React, { useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';
import ReactTooltip from 'react-tooltip';

import EditorToolbar from './editor-toolbar';
import DebugPanel from './debug-panel';
// Slate custom plugins.
// See slate/plugins/README
import { EditableWithPlugins, pipe } from './plugins/common';
import { ExitBreakPlugin, SoftBreakPlugin } from './plugins/block-breaks';
// import { ResetBlockTypePlugin } from './plugins/reset-block-type';
import { ParagraphPlugin } from './plugins/paragraph';
import {
  ListPlugin,
  toggleOrderedList,
  toggleUnorderedList,
  toolbarOl,
  toolbarUl,
  withList
} from './plugins/list';
import {
  EquationPlugin,
  insertEquation,
  toolbarEquation
} from './plugins/equation';
// import { withInlineVoid } from '@udecode/slate-plugins';

const plugins = [
  ParagraphPlugin,
  ListPlugin,
  EquationPlugin,
  // ResetBlockTypePlugin,
  SoftBreakPlugin,
  ExitBreakPlugin
];

const withPlugins = [withReact, withList /*, withInlineVoid({ plugins })*/];

export default function FullEditor() {
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  // Keep track of state for the value of the editor.
  // Move up.
  const [value, setValue] = useState([
    {
      // Root level has no type and is the first child of the Editor.
      // This is needed for the block breaks to work.
      children: [
        {
          type: 'p',
          children: [{ text: 'A line of text in a paragraph.' }]
        }
      ]
    }
  ]);

  const onToolbarAction = (btnId) => {
    console.log('toolbarBtn click', btnId);
    switch (btnId) {
      case toolbarUl.id:
        toggleUnorderedList(editor);
        break;
      case toolbarOl.id:
        toggleOrderedList(editor);
        break;
      case toolbarEquation.id:
        insertEquation(editor);
        break;
    }
  };

  // Render the Slate context.
  return (
    <Slate editor={editor} value={value} onChange={(v) => setValue(v)}>
      <DebugPanel value={value} onChange={(v) => setValue(v)} />
      <ReactTooltip place='top' type='dark' effect='solid' />

      <EditorToolbar onAction={onToolbarAction} />
      <EditableWithPlugins plugins={plugins} />
    </Slate>
  );
}
