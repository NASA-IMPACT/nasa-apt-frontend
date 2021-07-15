import React from 'react';
import styled from 'styled-components';
import { Heading } from '@devseed-ui/typography';

import App from '../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageActions
} from '../../styles/inpage';
import { ContentBlock } from '../../styles/content-block';
import DashboardContributor from './dash-contributor';
import DashboardCurator from './dash-curator';
import { Can } from '../../a11n';
import ButtonSecondary from '../../styles/button-secondary';

import { useUser } from '../../context/user';
import { useDocumentCreate } from '../documents/single-edit/use-document-create';

const DashboardContent = styled.section`
  grid-column: content-start / content-end;
`;

function UserDashboard() {
  const { user } = useUser();
  const onCreateClick = useDocumentCreate();

  return (
    <App pageTitle='Dashboard'>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Dashboard</InpageTitle>
          </InpageHeadline>
          <InpageActions>
            <Can do='create' on='documents'>
              <ButtonSecondary
                title='Create new document'
                useIcon='plus--small'
                onClick={onCreateClick}
              >
                Create
              </ButtonSecondary>
            </Can>
          </InpageActions>
        </InpageHeader>
        <InpageBody>
          <ContentBlock>
            <DashboardContent>
              <Heading size='medium'>Welcome {user.name}</Heading>
              <p>Here&apos;s what is happening in your APT account today.</p>
            </DashboardContent>
            <DashboardContent>
              <Can do='access' on='contributor-dashboard'>
                <DashboardContributor />
              </Can>
              <Can do='access' on='curator-dashboard'>
                <DashboardCurator />
              </Can>
            </DashboardContent>
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default UserDashboard;
