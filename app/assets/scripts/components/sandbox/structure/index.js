import React from 'react';
import { Button } from '@devseed-ui/button';
import styled from 'styled-components';

import App from '../../common/app';

import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageMeta,
  InpageHeadNav,
  BreadcrumbMenu,
  InpageActions,
  InpageBody
} from '../../../styles/inpage';

import Constrainer from '../../../styles/constrainer';
import Prose from '../../../styles/typography/prose';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} {
    padding-top: 3rem;
    padding-bottom: 30rem;
  }
`;

function SandboxStructure() {
  return (
    <App pageTitle='Sandbox/Structure'>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Structure</InpageTitle>
            <InpageHeadNav>
              <BreadcrumbMenu>
                <li>
                  <Button to='/' variation='achromic-plain' title='Create new'>
                    V2.2
                  </Button>
                </li>
                <li>
                  <Button to='/' variation='achromic-plain' title='Create new'>
                    Viewing
                  </Button>
                </li>
              </BreadcrumbMenu>
            </InpageHeadNav>
          </InpageHeadline>
          <InpageMeta>
            <dt>Under</dt>
            <dd>Sandbox</dd>
            <dt>Status</dt>
            <dd>Draft: 56%</dd>
            <dt>Discussion</dt>
            <dd>2 unsolved threads</dd>
          </InpageMeta>
          <InpageActions>
            <Button to='/' variation='achromic-plain' title='Create new'>
              Button
            </Button>
          </InpageActions>
        </InpageHeader>
        <InpageBodyScroll>
          <Constrainer>
            <Prose>
              <p>Hello world!</p>
            </Prose>
          </Constrainer>
        </InpageBodyScroll>
      </Inpage>
    </App>
  );
}

export default SandboxStructure;
