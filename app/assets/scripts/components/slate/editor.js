import React, { useCallback, useMemo } from 'react';
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

export const editorEmptyValue = {
  // Root level has no type and is the first and only child of the Editor.
  // This is needed for the block breaks to work.
  children: [
    {
      type: 'p',
      children: [{ text: '' }]
    }
  ]
};

export default function FullEditor(props) {
  const { id, onChange: inputOnChange, value: inputVal } = props;
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  // The editor needs to work with an array, but we store the value as an object
  // which is the first and only child.
  const value = [inputVal];
  const onChange = useCallback((v) => inputOnChange(v[0]), [inputOnChange]);

  // Render the Slate context.
  return (
    <EditorWrapper>
      <Slate editor={editor} value={value} onChange={onChange}>
        <EditorToolbar plugins={plugins} />
        <EditorFloatingToolbar plugins={plugins} />
        <EditorLinkToolbar />

        <EditableDebug
          id={id}
          plugins={plugins}
          value={value}
          onDebugChange={onChange}
        />
      </Slate>
    </EditorWrapper>
  );
}

FullEditor.propTypes = {
  id: T.string,
  onChange: T.func,
  value: T.object
};

export function ReadEditor(props) {
  const { id, value: inputVal } = props;
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  const value = [inputVal];

  // Render the Slate context.
  return (
    <Slate editor={editor} value={value}>
      <EditableWithPlugins id={id} plugins={plugins} value={value} readOnly />
    </Slate>
  );
}

ReadEditor.propTypes = {
  id: T.string,
  value: T.object
};
