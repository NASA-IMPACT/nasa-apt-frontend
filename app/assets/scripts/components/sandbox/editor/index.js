import React, { useState } from 'react';
import styled from 'styled-components';

import App from '../../common/app';
import FullEditor from '../../slate/editor';
import { Link } from '../../../styles/clean/link';
import {
  Inpage,
  StickyInpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageSubtitle,
  InpageMeta,
  InpageBody
} from '../../../styles/inpage';
import Constrainer from '../../../styles/constrainer';
import { hugeDoc } from '../../slate/plugins/debug-editor/dummy';
import SafeReadEditor from '../../slate/safe-read-editor';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} {
    padding-top: 3rem;
    padding-bottom: 30rem;
  }
`;

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

  return (
    <App pageTitle='Sandbox/Editor'>
      <Inpage>
        <StickyInpageHeader data-element='inpage-header'>
          <InpageHeadline>
            <InpageTitle>Editor</InpageTitle>
          </InpageHeadline>
          <InpageMeta>
            <dt>Under</dt>
            <InpageSubtitle as='dd'>
              <Link to='/sandbox' title='Visit Sandbox hub'>
                Sandbox
              </Link>
            </InpageSubtitle>
          </InpageMeta>
        </StickyInpageHeader>
        <InpageBodyScroll>
          <Constrainer>
            <FullEditor
              value={value}
              onChange={(v) => {
                setValue(v);
              }}
            />

            <SafeReadEditor value={value} />

            <FullEditor
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
