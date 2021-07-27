import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Heading } from '@devseed-ui/typography';
import { glsp } from '@devseed-ui/theme-provider';

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
import Prose from '../../styles/typography/prose';
import DashboardContributor from './dash-contributor';
import DashboardCurator from './dash-curator';
import { Can, useContextualAbility } from '../../a11n';
import ButtonSecondary from '../../styles/button-secondary';

import { useUser } from '../../context/user';
import { useDocumentCreate } from '../documents/single-edit/use-document-create';
import { useAtbds } from '../../context/atbds-list';
import DashboardNoRole from './dash-no-role';
import Insight from '../common/insight';

const DashboardCanvas = styled(ContentBlock)`
  background: transparent;
  align-items: center;
`;

const WelcomeBlock = styled.section`
  grid-column: content-start / content-7;
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp()};
`;

const WelcomeBlockTitle = styled(Heading)`
  margin: 0;
`;

const InsightsBlock = styled.section`
  grid-column: content-7 / content-end;
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp()};
`;

const InsightsBlockTitle = styled(Heading)`
  margin: 0;
`;

const InsightsBlockContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
`;

const DocumentsBlock = styled.section`
  grid-column: content-start / content-end;
`;

function UserDashboard() {
  const { user } = useUser();
  const onCreateClick = useDocumentCreate();
  const { invalidateAtbdListCtx } = useAtbds();
  const ability = useContextualAbility();

  // Invalidate list of documents on unmount to ensure any changes made to a
  // single document are refetched.
  useEffect(() => {
    return () => {
      invalidateAtbdListCtx();
    };
  }, [invalidateAtbdListCtx]);

  const conAccessContributorDash = ability.can(
    'access',
    'contributor-dashboard'
  );
  const conAccessCuratorDash = ability.can('access', 'curator-dashboard');

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
          <DashboardCanvas>
            <WelcomeBlock>
              <WelcomeBlockTitle>Welcome back, {user.name}</WelcomeBlockTitle>
              <Prose>
                <p>Here&apos;s what is happening in your APT account today.</p>
                {!conAccessContributorDash && !conAccessCuratorDash && (
                  <p>
                    Your account has not yet been approved. You can only access{' '}
                    <strong>published</strong> documents.
                  </p>
                )}
              </Prose>
            </WelcomeBlock>
            <InsightsBlock>
              <InsightsBlockTitle>Insights</InsightsBlockTitle>
              <InsightsBlockContent>
                <Insight />
                <Insight />
                <Insight />
                <Insight />
              </InsightsBlockContent>
            </InsightsBlock>
            <DocumentsBlock>
              {conAccessContributorDash && <DashboardContributor />}
              {conAccessCuratorDash && <DashboardCurator />}
              {!conAccessContributorDash && !conAccessCuratorDash && (
                <DashboardNoRole />
              )}
            </DocumentsBlock>
          </DashboardCanvas>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default UserDashboard;
