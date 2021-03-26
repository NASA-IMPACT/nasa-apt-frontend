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

const HomeInpageHeader = styled(InpageHeader)`
  max-height: 0;
  padding: 0;
  overflow: hidden;
`;

function Home() {
  return (
    <App pageTitle='Welcome'>
      <Inpage>
        <HomeInpageHeader>
          <InpageHeadline>
            <InpageTitle>Welcome</InpageTitle>
          </InpageHeadline>
        </HomeInpageHeader>
        <InpageBody>
          <Constrainer>
            <Prose>
              <p>Hello world!</p>
            </Prose>
          </Constrainer>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Home;
