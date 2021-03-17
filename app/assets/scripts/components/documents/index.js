import React from 'react';
import { Button } from '@devseed-ui/button';
import styled from 'styled-components';

import App from '../common/app';
import Constrainer from '../../styles/constrainer';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageActions,
  InpageBody
} from '../../styles/inpage';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} {
    padding-top: 3rem;
    padding-bottom: 30rem;
  }
`;

function Documents() {
  return (
    <App pageTitle='Sandbox editor' hideFooter>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Documents</InpageTitle>
          </InpageHeadline>
          <InpageActions>
            <Button to='/' variation='achromic-plain' title='Create new'>
              Create new
            </Button>
          </InpageActions>
        </InpageHeader>
        <InpageBodyScroll>
          <Constrainer>
            <p>Hello world!</p>
          </Constrainer>
        </InpageBodyScroll>
      </Inpage>
    </App>
  );
}

export default Documents;
