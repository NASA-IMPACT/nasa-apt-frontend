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
import { ProgressEntry, ProgressList, ProgressListItem, ProgressTracker } from '../../../styles/progress-tracker';

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
              <h2>Progress tracker</h2>
              <ProgressTracker>
                <ProgressList>
                  <ProgressListItem>
                    <ProgressEntry>
                      <h1>Entry 1</h1>
                      <p>Lorem ipsum dolor</p>
                    </ProgressEntry>
                  </ProgressListItem>

                  <ProgressListItem>
                    <ProgressEntry>
                      <h1>Entry 2</h1>
                      <p>Lorem ipsum dolor</p>
                    </ProgressEntry>
                  </ProgressListItem>

                  <ProgressListItem>
                    <ProgressEntry>
                      <h1>Entry 3</h1>
                      <p>Lorem ipsum dolor</p>
                    </ProgressEntry>
                  </ProgressListItem>
                </ProgressList>
              </ProgressTracker>
            </Prose>
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default SandboxElements;
