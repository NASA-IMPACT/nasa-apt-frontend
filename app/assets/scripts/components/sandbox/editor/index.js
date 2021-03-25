import React from 'react';
import styled from 'styled-components';

import App from '../../common/app';
import FullEditor from '../../slate/editor';

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

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} {
    padding-top: 3rem;
    padding-bottom: 30rem;
  }
`;

function SandboxEditor() {
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
            <FullEditor />
          </Constrainer>
        </InpageBodyScroll>
      </Inpage>
    </App>
  );
}

export default SandboxEditor;
