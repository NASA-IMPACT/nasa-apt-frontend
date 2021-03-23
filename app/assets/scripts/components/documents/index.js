import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';

import App from '../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageActions,
  InpageBody
} from '../../styles/inpage';
import Constrainer from '../../styles/constrainer';
import Prose from '../../styles/typography/prose';

import { useAtbds } from '../../context/atbds-list';

const InpageBodyScroll = styled(InpageBody)`
  padding: 0;
  overflow: auto;

  ${Constrainer} {
    padding-top: 3rem;
    padding-bottom: 30rem;
  }
`;

function Documents() {
  const context = useAtbds();

  useEffect(() => {
    context.fetchAtbds();
  }, []);

  return (
    <App pageTitle='Documents'>
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
            <Prose>
              <p>Hello world!</p>
            </Prose>
          </Constrainer>
        </InpageBodyScroll>
      </Inpage>
    </App>
  );
}

export default Documents;
