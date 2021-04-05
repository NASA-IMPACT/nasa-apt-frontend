import React, { useMemo } from 'react';
import T from 'prop-types';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';

import { EditorToolbar, EditorFloatingToolbar } from './editor-toolbar';
import composeDebugEditor from './plugins/debug-editor/compose-debug-editor';

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

export default function FullEditor(props) {
  const { onChange, value } = props;
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);
  window.editor = editor;

  // Render the Slate context.
  return (
    <EditorWrapper>
      <Slate editor={editor} value={value} onChange={onChange}>
        <EditorToolbar plugins={plugins} />
        <EditorFloatingToolbar plugins={plugins} />
        <EditorLinkToolbar />

        <EditableDebug
          plugins={plugins}
          value={value}
          onDebugChange={onChange}
        />
      </Slate>
    </EditorWrapper>
  );
}

FullEditor.propTypes = {
  onChange: T.func,
  value: T.array
};

export function ReadEditor(props) {
  const { value } = props;
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  // Render the Slate context.
  return (
    <Slate editor={editor} value={value}>
      <EditableWithPlugins plugins={plugins} value={value} readOnly />
    </Slate>
  );
}

ReadEditor.propTypes = {
  value: T.array
};
