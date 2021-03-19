import React, { useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';

import { EditorToolbar, EditorFloatingToolbar } from './editor-toolbar';
import composeDebugEditor from './plugins/debug-editor/compose-debug-editor';
import { hugeDoc } from './plugins/debug-editor/dummy';

// Slate custom plugins.
// See slate/plugins/README
import {
  EditableWithPlugins,
  EditorWrapper,
  withInlineVoid,
  withHistory,
  pipe
} from './plugins/common';
import { ExitBreakPlugin, SoftBreakPlugin } from './plugins/block-breaks';
import { ParagraphPlugin } from './plugins/paragraph';
import { ListPlugin, withList } from './plugins/list';
import { EquationPlugin } from './plugins/equation';
import { SubSectionPlugin } from './plugins/subsection';
import {
  LinkPlugin,
  withLink,
  withLinkEditor,
  EditorLinkToolbar
} from './plugins/link';
import { BoldPlugin } from './plugins/bold';
import { ItalicPlugin } from './plugins/italic';
import { UnderlinePlugin } from './plugins/underline';
import { SubSupScriptPlugin } from './plugins/subsupscript';

const EditableDebug = composeDebugEditor(EditableWithPlugins);

const plugins = [
  ParagraphPlugin,
  ListPlugin,
  EquationPlugin,
  SubSectionPlugin,
  LinkPlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  SubSupScriptPlugin,
  SoftBreakPlugin,
  ExitBreakPlugin
];

const withPlugins = [
  withReact,
  withHistory,
  withInlineVoid({ plugins }),
  withList,
  withLink,
  withLinkEditor
];

export default function FullEditor() {
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);
  window.editor = editor;

  // Keep track of state for the value of the editor.
  // Move up.
  const [value, setValue] = useState([
    {
      // Root level has no type and is the first child of the Editor.
      // This is needed for the block breaks to work.
      children: [
        ...hugeDoc,
        {
          type: 'p',
          children: [{ text: 'A line of text in a paragraph.' }]
        }
      ]
    }
  ]);

  // Render the Slate context.
  return (
    <EditorWrapper>
      <Slate
        editor={editor}
        value={value}
        onChange={(v) => {
          setValue(v);
        }}
      >
        <EditorToolbar plugins={plugins} />
        <EditorFloatingToolbar plugins={plugins} />
        <EditorLinkToolbar />

        <EditableDebug
          plugins={plugins}
          value={value}
          onDebugChange={(v) => setValue(v)}
        />
      </Slate>
    </EditorWrapper>
  );
}
