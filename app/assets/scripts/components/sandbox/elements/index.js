import React from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { glsp } from '@devseed-ui/theme-provider';

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

const Headx = styled.h1`
  position: relative;
  font-size: 3rem;
  line-height: 3.5rem;
  display: flex;
  flex-flow: row-reverse nowrap;
  align-items: baseline;

  span + span {
    position: absolute;
    right: calc(100% + ${glsp(0.5)});
    z-index: 2;
    display: inline-block;
    line-height: inherit;
    white-space: nowrap;
    overflow: hidden;
    opacity: 0;
    transition: all 0.24s ease-in-out 0.16s;

    > * {
      vertical-align: 0.64em;

      &:not(:last-child) {
        margin-right: ${glsp(0.25)};
      }
    }
  }

  &:hover {
    span + span {
      opacity: 1;
      transition-delay: 0s;
    }
  }
`;

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

              <Headx as='h2'>
                <span>
                  Testing a really long title with side options lorem ipsum
                  dolor sit amet consectetur adipiscing elit ellentesque
                  vehicula non ipsum tincidunt hendrerit
                </span>
                <span>
                  <Button
                    to='/dashboard'
                    variation='base-plain'
                    title='Visit the welcome page'
                    hideText
                    size='small'
                    useIcon='link'
                  >
                    Dashboard
                  </Button>

                  <Button
                    to='/dashboard'
                    variation='base-plain'
                    title='Visit the welcome page'
                    hideText
                    size='small'
                    useIcon='speech-balloon'
                  >
                    Dashboard
                  </Button>
                </span>
              </Headx>

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
                    <TrackerItem status='complete'>
                      <TrackerEntry>
                        <SubTrackerEntryTitle>Sub entry 1</SubTrackerEntryTitle>
                      </TrackerEntry>
                    </TrackerItem>
                    <TrackerItem status='complete'>
                      <TrackerEntry>
                        <SubTrackerEntryTitle>Sub entry 2</SubTrackerEntryTitle>
                      </TrackerEntry>
                    </TrackerItem>
                  </SubTracker>
                </TrackerItem>
                <TrackerItem status='progress'>
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
                <TrackerItem>
                  <TrackerEntry>
                    <TrackerEntryTitle>Four</TrackerEntryTitle>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Pellentesque vehicula non ipsum tincidunt hendrerit. In et
                      libero urna. Cras luctus, lorem ac commodo placerat, augue
                      leo eleifend nisi, vel sollicitudin felis orci ut leo.
                    </p>
                  </TrackerEntry>
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
