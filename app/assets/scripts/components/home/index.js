import React from 'react';
import styled from 'styled-components';

import App from '../common/app';

import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../styles/inpage';

import Constrainer from '../../styles/constrainer';
import Prose from '../../styles/typography/prose';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} {
    padding-top: 3rem;
    padding-bottom: 30rem;
  }
`;

function Home() {
  return (
    <App pageTitle='Welcome'>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Welcome</InpageTitle>
          </InpageHeadline>
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

export default Home;
