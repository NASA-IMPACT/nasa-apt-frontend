import React from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';

import App from '../../common/app';
import StatusPill from '../../common/status-pill';
import { Link } from '../../../styles/clean/link';
import { VerticalDivider } from '@devseed-ui/toolbar';
import {
  Inpage,
  InpageHeadline,
  InpageTitle,
  InpageMeta,
  InpageHeadNav,
  BreadcrumbMenu,
  InpageActions,
  InpageBody,
  InpageSubtitle,
  StickyInpageHeader
} from '../../../styles/inpage';
import Constrainer from '../../../styles/constrainer';
import StickyElement from '../../common/sticky-element';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;

  ${Constrainer} {
    padding-top: 3rem;
    padding-bottom: 3rem;

    > *:not(:last-child) {
      margin-bottom: 1rem;
    }
  }
`;

const FakeEditor = styled.div`
  background: #ccc;
`;

const FakeEditorToolbar = styled.div`
  background: #999;
  text-align: center;
`;

const FakeEditorBody = styled.div`
  height: 20rem;
`;

function SandboxStickyStructure() {
  return (
    <App pageTitle='Sandbox/Structure'>
      <Inpage>
        <StickyInpageHeader data-element='inpage-header'>
          <InpageHeadline>
            <InpageTitle>
              GPM Integrated Multi-Satellite Retrievals for GPM (IMERG)
              Algorithm Theoretical Basis Document
            </InpageTitle>
            <InpageHeadNav role='navigation'>
              <BreadcrumbMenu>
                <li>
                  <strong>V1.0</strong>
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
            <InpageSubtitle as='dd'>
              <Link to='/sandbox' title='Visit Sandbox hub'>
                Sandbox
              </Link>
            </InpageSubtitle>
            <dt>Status</dt>
            <dd>
              <StatusPill status='draft' completeness={56} />
            </dd>
            <dt>Discussion</dt>
            <dd>
              <a href='#' title='View threads'>
                2 unsolved threads
              </a>
            </dd>
          </InpageMeta>
          <InpageActions>
            <Button to='/' variation='achromic-plain' title='Create new'>
              Button 1A
            </Button>
            <VerticalDivider variation='light' />
            <Button to='/' variation='achromic-plain' title='Create new'>
              Button 2A
            </Button>
            <Button to='/' variation='achromic-plain' title='Create new'>
              Button 2B
            </Button>
          </InpageActions>
        </StickyInpageHeader>
        <InpageBodyScroll>
          <Constrainer>
            <FakeEditor data-sticky='boundary'>
              <StickyElement
                bottomOffset={84}
                topOffset={-84}
                boundaryElement='[data-sticky="boundary"]'
                hideOnBoundaryHit={false}
              >
                <FakeEditorToolbar>The toolbar</FakeEditorToolbar>
              </StickyElement>
              <FakeEditorBody>The body</FakeEditorBody>
            </FakeEditor>

            <p style={{ height: '800px', border: '1px dashed #ccc' }}>
              big content block
            </p>
          </Constrainer>
        </InpageBodyScroll>
      </Inpage>
    </App>
  );
}

export default SandboxStickyStructure;
