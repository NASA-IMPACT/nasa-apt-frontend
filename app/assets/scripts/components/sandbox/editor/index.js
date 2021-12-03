import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import App from '../../common/app';
import { RichTextEditor } from '../../slate/editor';
import { Link } from '../../../styles/clean/link';
import {
  Inpage,
  StickyInpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageSubtitle,
  InpageBody,
  InpageHeadHgroup
} from '../../../styles/inpage';
import Constrainer from '../../../styles/constrainer';
import { hugeDoc, references } from './dummy';
import { RichContextProvider } from '../../slate/plugins/common/rich-context';
import { InlineRichTextEditor } from '../../slate/inline-editor';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} > h2 {
    margin: 2rem 0 1rem 0;
  }
`;

const inlineFormattingOptions = ['bold', 'italic', 'underline', 'subsupscript'];

function SandboxEditor() {
  // Keep track of state for the value of the editor.
  // Move up.
  const [value, setValue] = useState({
    // Root level has no type and is the first child of the Editor.
    // This is needed for the block breaks to work.
    children: [
      ...hugeDoc,
      {
        type: 'p',
        children: [{ text: 'A line of text in a paragraph.' }]
      }
    ]
  });

  const [value2, setValue2] = useState({
    // Root level has no type and is the first child of the Editor.
    // This is needed for the block breaks to work.
    children: 'invalid'
  });

  const [valueInline, setValueInline] = useState({
    type: 'p',
    children: [{ text: '' }]
  });

  const onReferenceUpsert = useCallback((val) => {
    // eslint-disable-next-line no-console
    console.log('Upserted reference', val);
  }, []);

  return (
    <App pageTitle='Sandbox/Editor'>
      <Inpage>
        <StickyInpageHeader data-element='inpage-header'>
          <InpageHeadline>
            <InpageHeadHgroup>
              <InpageTitle>Editor</InpageTitle>
            </InpageHeadHgroup>
            <InpageSubtitle>
              <Link to='/sandbox' title='Visit Sandbox hub'>
                Sandbox
              </Link>
            </InpageSubtitle>
          </InpageHeadline>
        </StickyInpageHeader>
        <InpageBodyScroll>
          <Constrainer>
            <h2>Inline editor</h2>
            <InlineRichTextEditor
              formattingOptions={inlineFormattingOptions}
              value={valueInline}
              onChange={(v) => {
                setValueInline(v);
              }}
            />

            <h2>Rich text editor</h2>
            <RichContextProvider
              context={{ references, onReferenceUpsert, atbd: { id: 1 } }}
            >
              <RichTextEditor
                value={value}
                onChange={(v) => {
                  setValue(v);
                }}
              />
            </RichContextProvider>

            <h2>Rich text editor - error value</h2>
            <RichTextEditor
              value={value2}
              onChange={(v) => {
                setValue2(v);
              }}
            />
          </Constrainer>
        </InpageBodyScroll>
      </Inpage>
    </App>
  );
}

export default SandboxEditor;
