import React, { useState } from 'react';
import styled from 'styled-components';

import App from '../../common/app';
import FullEditor, { ReadEditor } from '../../slate/editor';
import { Link } from '../../../styles/clean/link';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageSubtitle,
  InpageMeta,
  InpageBody
} from '../../../styles/inpage';
import Constrainer from '../../../styles/constrainer';
import { hugeDoc } from '../../slate/plugins/debug-editor/dummy';

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

  return (
    <App pageTitle='Sandbox/Editor'>
      <Inpage>
        <InpageHeader>
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
        </InpageHeader>
        <InpageBodyScroll>
          <Constrainer>
            <FullEditor
              value={value}
              onChange={(v) => {
                setValue(v);
              }}
            />

            <ReadEditor value={value} />
          </Constrainer>
        </InpageBodyScroll>
      </Inpage>
    </App>
  );
}

export default SandboxEditor;
