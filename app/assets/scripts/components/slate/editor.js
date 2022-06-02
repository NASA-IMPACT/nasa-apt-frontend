import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';

import { EditorToolbar, EditorFloatingToolbar } from './editor-toolbar';
import StickyElement from '../common/sticky-element';
import { editorErrorValue, validateSlateValue } from './editor-values';
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
import {
  ShortcutsModalPlugin,
  ShortcutsModal
} from './plugins/shortcuts-modal';
import { withSimpleModal } from './plugins/common/with-simple-modal';
import { withEmptyEditor } from './plugins/common/with-empty-editor';
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
import {
  ReferencePlugin,
  ReferencesModal,
  withReferenceModal
} from './plugins/reference';
import {
  TABLE,
  TableBlockPlugin,
  TABLE_BLOCK,
  withTable
} from './plugins/table';
import { withCaption, withCaptionLayout } from './plugins/caption';
import { IMAGE, ImageBlockPlugin, IMAGE_BLOCK } from './plugins/image';
import { LatexModal } from './plugins/equation/latex-cheatsheet-modal';

const EditableDebug = composeDebugEditor(EditableWithPlugins);

const plugins = [
  // The current slate-plugins version in use (0.75.2) uses in turn a slate
  // version (0.59) that has a bug when it comes to spellcheck.
  // Spellcheck is only supported in browsers with beforeinput dom event, and
  // slate is considering all versions of firefox to not have this feature
  // (which was fixed in a more recent version). Because of this it sets the
  // spellCheck property as undefined, which means it is reset to the browser's
  // default (in more recent slate versions this is set to false). This is turn
  // shows the spellcheck as enabled but it doesn't work, causing severe errors
  // en some cases.
  // This element is rendered for the first editor child (the ine without a
  // type) and includes a forced disable for the spellcheck.
  {
    /* eslint-disable react/display-name, react/prop-types */
    renderElement: ({ element, children }) =>
      !element.type && <div spellCheck={false}>{children}</div>
    /* eslint-enable */
  },
  ShortcutsModalPlugin,
  ParagraphPlugin,
  ListPlugin,
  EquationPlugin,
  SubSectionPlugin,
  ReferencePlugin,
  TableBlockPlugin,
  ImageBlockPlugin,
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
  withEmptyEditor,
  withSimpleModal,
  withInlineVoid({ plugins }),
  withList,
  withLink,
  withLinkEditor,
  withReferenceModal,
  withSubsectionId,
  withCaption,
  withCaptionLayout([
    {
      parent: TABLE_BLOCK,
      element: TABLE
    },
    {
      parent: IMAGE_BLOCK,
      element: IMAGE
    }
  ]),
  withTable
];

// TODO: Calculate dynamically.
const HEADER_HEIGHT = 92;

export function RichTextEditor(props) {
  const {
    id,
    onChange: inputOnChange,
    value: inputVal,
    excludePlugins
  } = props;
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  const usePlugins = useMemo(() => {
    return plugins.filter((plugin) => !excludePlugins.includes(plugin));
  }, [excludePlugins]);

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
          bottomOffset={HEADER_HEIGHT}
          topOffset={-HEADER_HEIGHT}
          boundaryElement='[data-sticky="boundary"]'
          hideOnBoundaryHit={false}
        >
          <EditorToolbar plugins={usePlugins} />
        </StickyElement>
        <EditorFloatingToolbar plugins={usePlugins} />
        <EditorLinkToolbar />
        <ReferencesModal />
        <ShortcutsModal plugins={usePlugins} />
        <LatexModal />

        <EditableDebug
          id={id}
          plugins={usePlugins}
          value={value}
          onDebugChange={onChange}
        />
      </Slate>
    </EditorWrapper>
  );
}

RichTextEditor.propTypes = {
  id: T.string,
  onChange: T.func,
  value: T.object,
  excludePlugins: T.array
};

RichTextEditor.defaultProps = {
  excludePlugins: []
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
