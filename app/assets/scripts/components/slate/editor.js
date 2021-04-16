import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';

import { EditorToolbar, EditorFloatingToolbar } from './editor-toolbar';
import StickyElement from '../common/sticky-element';
import composeDebugEditor from './plugins/debug-editor/compose-debug-editor';

// Slate custom plugins.
// See slate/plugins/README
import {
  EditableWithPlugins,
  EditorWrapper,
  ReadableWithPlugins,
  withInlineVoid,
  withHistory,
  pipe
} from './plugins/common';
import { ExitBreakPlugin, SoftBreakPlugin } from './plugins/block-breaks';
import { ParagraphPlugin } from './plugins/paragraph';
import { ListPlugin, withList } from './plugins/list';
import { EquationPlugin } from './plugins/equation';
import { SubSectionPlugin, withSubsectionId } from './plugins/subsection';
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
import { ReferencePlugin, ReferencesModal } from './plugins/reference';
import { withReferenceModal } from './plugins/reference/with-reference-modal';

const EditableDebug = composeDebugEditor(EditableWithPlugins);

const plugins = [
  ParagraphPlugin,
  ListPlugin,
  EquationPlugin,
  SubSectionPlugin,
  ReferencePlugin,
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
  withLinkEditor,
  withReferenceModal,
  withSubsectionId
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

const editorErrorValue = {
  children: [
    {
      type: 'p',
      children: [
        {
          text: `This field's value was not valid and was replaced with this message to prevent the application from crashing.`,
          italic: true
        }
      ]
    }
  ]
};

/**
 * Validate a slate value following the constraints:
 * Each Node, must be of either Text or Element.
 * A Text node is a object with a text key: { text: 'some' }
 * An Element node is an object with 1 or more children: { children: [Text|Element] }
 * @param {any} value Value to validate
 */
const validateSlateValue = (value) => {
  if (!value) {
    return false;
  }
  // if is an array, length must be greater than 0 and validate each entry.
  if (Array.isArray(value)) {
    return value.length && value.every((child) => validateSlateValue(child));
  }
  // Text node. Valid.
  if (value.text || value.text === '') {
    return true;
  }
  // Has children. Validate them.
  if (value.children) {
    return validateSlateValue(value.children);
  }
  // Anything else is not valid.
  return false;
};

export default function FullEditor(props) {
  const { id, onChange: inputOnChange, value: inputVal } = props;
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  // The editor needs to work with an array, but we store the value as an object
  // which is the first and only child.
  const value = validateSlateValue([inputVal])
    ? [inputVal]
    : [editorErrorValue];
  const onChange = useCallback((v) => inputOnChange(v[0]), [inputOnChange]);

  // Render the Slate context.
  return (
    <EditorWrapper data-sticky='boundary'>
      <Slate editor={editor} value={value} onChange={onChange}>
        <StickyElement
          bottomOffset={84}
          topOffset={-84}
          boundaryElement='[data-sticky="boundary"]'
          hideOnBoundaryHit={false}
        >
          <EditorToolbar plugins={plugins} />
        </StickyElement>
        <EditorFloatingToolbar plugins={plugins} />
        <EditorLinkToolbar />
        <ReferencesModal />

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
      <ReadableWithPlugins
        id={id}
        plugins={plugins}
        value={value}
        readOnly
        style={{}}
      />
    </Slate>
  );
}

ReadEditor.propTypes = {
  id: T.string,
  value: T.object
};
