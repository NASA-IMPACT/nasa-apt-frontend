import React from 'react';

import App from '../../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../../styles/inpage';
import { ContentBlock, Wrapper } from '../../../styles/content-block';
import Prose from '../../../styles/typography/prose';
import StatusPill from '../../common/status-pill';
import {
  Tracker,
  TrackerItem,
  TrackerEntry,
  TrackerEntryTitle,
  SubTracker,
  SubTrackerEntryTitle
} from '../../../styles/progress-tracker';

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
            </Prose>
            <Wrapper>
              <Tracker>
                <TrackerItem status='complete'>
                  <TrackerEntry>
                    <TrackerEntryTitle>One</TrackerEntryTitle>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Pellentesque vehicula non ipsum tincidunt hendrerit. In et
                      libero urna. Cras luctus, lorem ac commodo placerat, augue
                      leo eleifend nisi, vel sollicitudin felis orci ut leo.
                    </p>
                  </TrackerEntry>
                  <SubTracker>
                    <TrackerItem>
                      <TrackerEntry>
                        <SubTrackerEntryTitle>Sub entry 1</SubTrackerEntryTitle>
                      </TrackerEntry>
                    </TrackerItem>
                    <TrackerItem>
                      <TrackerEntry>
                        <SubTrackerEntryTitle>Sub entry 2</SubTrackerEntryTitle>
                      </TrackerEntry>
                    </TrackerItem>
                  </SubTracker>
                </TrackerItem>
                <TrackerItem>
                  <TrackerEntry>
                    <TrackerEntryTitle>Two</TrackerEntryTitle>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Pellentesque vehicula non ipsum tincidunt hendrerit. In et
                      libero urna. Cras luctus, lorem ac commodo placerat, augue
                      leo eleifend nisi, vel sollicitudin felis orci ut leo.
                    </p>
                  </TrackerEntry>
                </TrackerItem>
                <TrackerItem>
                  <TrackerEntry>
                    <TrackerEntryTitle>Third</TrackerEntryTitle>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Pellentesque vehicula non ipsum tincidunt hendrerit. In et
                      libero urna. Cras luctus, lorem ac commodo placerat, augue
                      leo eleifend nisi, vel sollicitudin felis orci ut leo.
                    </p>
                  </TrackerEntry>
                  <SubTracker>
                    <TrackerItem>
                      <TrackerEntry>
                        <SubTrackerEntryTitle>Sub entry 1</SubTrackerEntryTitle>
                      </TrackerEntry>
                    </TrackerItem>
                    <TrackerItem>
                      <TrackerEntry>
                        <SubTrackerEntryTitle>Sub entry 2</SubTrackerEntryTitle>
                      </TrackerEntry>
                    </TrackerItem>
                  </SubTracker>
                </TrackerItem>
              </Tracker>
            </Wrapper>
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default SandboxElements;
