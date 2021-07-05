import React from 'react';
import { Heading } from '@devseed-ui/typography';
import styled from 'styled-components';

import App from '../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../styles/inpage';
import { ContentBlock } from '../../styles/content-block';

import { useUser } from '../../context/user';

const DashboardContent = styled.div`
  grid-column: content-start / content-end;
`;

function UserDashboard() {
  const { user } = useUser();

  return (
    <App pageTitle='Dashboard'>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Dashboard</InpageTitle>
          </InpageHeadline>
        </InpageHeader>
        <InpageBody>
          <ContentBlock>
            <DashboardContent>
              <Heading size='medium'>Welcome {user.name}</Heading>
              <p>Here&apos;s a summary of what&apos;s going on.</p>
            </DashboardContent>
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default UserDashboard;