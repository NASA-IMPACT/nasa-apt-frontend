import React from 'react';

import App from '../common/app';
import {
  Inpage,
  StickyInpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../styles/inpage';
import { ContentBlock } from '../../styles/content-block';
import Prose from '../../styles/typography/prose';

function About() {
  return (
    <App pageTitle='About'>
      <Inpage>
        <StickyInpageHeader>
          <InpageHeadline>
            <InpageTitle>About</InpageTitle>
          </InpageHeadline>
        </StickyInpageHeader>
        <InpageBody>
          <ContentBlock>
            <Prose>
              <p>Hello world!</p>
            </Prose>
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default About;
