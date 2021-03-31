import React from 'react';

import App from '../common/app';

import {
  Inpage,
  InpageHeader,
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
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>About</InpageTitle>
          </InpageHeadline>
        </InpageHeader>
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
