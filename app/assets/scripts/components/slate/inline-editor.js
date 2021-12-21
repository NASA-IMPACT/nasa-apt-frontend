import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';

import { EditorFloatingToolbar } from './editor-toolbar';
import { editorEmptyValue, validateSlateValue } from './editor-values';
import composeDebugEditor from './plugins/debug-editor/compose-debug-editor';

// Slate custom plugins.
// See slate/plugins/README
import {
  InlineEditableWithPlugins,
  EditorWrapper,
  withHistory,
  withInlineVoid,
  pipe
} from './plugins/common';
import { withEmptyEditor } from './plugins/common/with-empty-editor';
import { useScrollToCaret, withSingleLine } from './plugins/single-line';
import { ParagraphPlugin } from './plugins/paragraph';
import {
  withLink,
  withLinkEditor,
  EditorLinkToolbar,
  LinkPlugin
} from './plugins/link';
import { BoldPlugin } from './plugins/bold';
import { ItalicPlugin } from './plugins/italic';
import { UnderlinePlugin } from './plugins/underline';
import { SubSupScriptPlugin } from './plugins/subsupscript';

const EditableDebug = composeDebugEditor(InlineEditableWithPlugins);

export function InlineRichTextEditor(props) {
  const {
    id,
    onChange: inputOnChange,
    value: inputVal,
    formattingOptions
  } = props;

  const { editor, plugins } = useMemo(() => {
    const opts = formattingOptions || [];
    let plugins = [ParagraphPlugin];

    let withPlugins = [
      withReact,
      withHistory,
      withSingleLine,
      withEmptyEditor,
      withInlineVoid({ plugins })
    ];

    if (opts.includes('link')) {
      plugins = plugins.concat(LinkPlugin);
      withPlugins = withPlugins.concat(withLink, withLinkEditor);
    }

    if (opts.includes('bold')) {
      plugins = plugins.concat(BoldPlugin);
    }

    if (opts.includes('italic')) {
      plugins = plugins.concat(ItalicPlugin);
    }

    if (opts.includes('underline')) {
      plugins = plugins.concat(UnderlinePlugin);
    }

    if (opts.includes('subsupscript')) {
      plugins = plugins.concat(SubSupScriptPlugin);
    }

    return {
      plugins,
      editor: pipe(createEditor(), ...withPlugins)
    };
  }, [formattingOptions]);

  const handleScrollToCaret = useScrollToCaret(editor);

  // The editor needs to work with an array, but we store the value as an object
  // which is the first and only child.
  const value = validateSlateValue([inputVal])
    ? [inputVal]
    : [editorEmptyValue];

  const onChange = useCallback(
    (v) => {
      handleScrollToCaret();
      inputOnChange(v[0]);
    },
    [inputOnChange, handleScrollToCaret]
  );

  // Render the Slate context.
  return (
    <EditorWrapper>
      <Slate editor={editor} value={value} onChange={onChange}>
        <EditorFloatingToolbar plugins={plugins} />
        {plugins.includes(LinkPlugin) && <EditorLinkToolbar />}

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

InlineRichTextEditor.propTypes = {
  id: T.string,
  onChange: T.func,
  value: T.object,
  formattingOptions: T.array
};
