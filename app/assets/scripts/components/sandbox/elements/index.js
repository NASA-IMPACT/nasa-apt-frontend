import React from 'react';

import App from '../../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../../styles/inpage';
import { ContentBlock } from '../../../styles/content-block';
import Prose from '../../../styles/typography/prose';
import StatusPill from '../../common/status-pill';

function SandboxElements() {
  return (
    <App pageTitle='Sandbox/Elements'>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Elements</InpageTitle>
          </InpageHeadline>
        </InpageHeader>
        <InpageBody>
          <ContentBlock>
            <Prose>
              <h2>Status</h2>
              <div>
                <StatusPill
                  status='Draft'
                  fillPercent={50}
                  completeness='50%'
                />
                <StatusPill
                  status='In closed review'
                  fillPercent={100 / 3}
                  completeness='1/3'
                />
                <StatusPill status='In review' />
                <StatusPill status='In publication' />
                <StatusPill status='In publication' statusIcon='page' />
                <StatusPill status='In publication' statusIcon='page-tick' />
                <StatusPill status='Published' statusIcon='page-tick' />
              </div>
            </Prose>
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default SandboxElements;
