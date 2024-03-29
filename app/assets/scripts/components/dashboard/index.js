import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Heading } from '@devseed-ui/typography';
import { glsp, visuallyHidden } from '@devseed-ui/theme-provider';

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
import { useContextualAbility } from '../../a11n';
import DashboardNoRole from './dash-no-role';
import Insight from '../common/insight';

import { useUser } from '../../context/user';
import { useAtbds } from '../../context/atbds-list';
import { useStatusColors } from '../../utils/use-status-colors';
import {
  DRAFT,
  getDocumentStatusLabel,
  isDraftEquivalent,
  isPublished,
  isReviewEquivalent,
  OPEN_REVIEW,
  PUBLISHED
} from '../documents/status';
import { round } from '../../utils/format';
import CreateDocumentButton from '../documents/create-document-button';

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

const WelcomeBlockProse = styled(Prose)`
  font-size: 1.25rem;
  line-height: 1.75rem;
`;

const WelcomeBlockTitle = styled(Heading)`
  font-size: 2rem;
  line-height: 2.5rem;
  margin: 0;
`;

const InsightsBlock = styled.section`
  grid-column: content-7 / content-end;
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp()};
`;

const InsightsBlockTitle = styled(Heading)`
  ${visuallyHidden()}
  margin: 0;
`;

const InsightsBlockContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
`;

const DocumentsBlock = styled.section`
  grid-column: content-start / content-end;
  display: grid;
  gap: ${glsp(1.5)};
`;

export const DocumentsBlockTitle = styled(Heading).attrs({
  as: 'h2'
})`
  font-size: 1.75rem;
  line-height: 2.25rem;
  margin: 0;
`;

function UserDashboard() {
  const { user } = useUser();
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
    <>
      <App pageTitle='Dashboard'>
        <Inpage>
          <InpageHeader>
            <InpageHeadline>
              <InpageTitle>Dashboard</InpageTitle>
            </InpageHeadline>
            <InpageActions>
              <CreateDocumentButton />
            </InpageActions>
          </InpageHeader>
          <InpageBody>
            <DashboardCanvas>
              <WelcomeBlock>
                <WelcomeBlockTitle>
                  Welcome back, {user.name}!
                </WelcomeBlockTitle>
                <WelcomeBlockProse>
                  <p>
                    Here&apos;s what is happening in your APT account today.
                  </p>
                  {!conAccessContributorDash && !conAccessCuratorDash && (
                    <>
                      <p>
                        Your account is not yet approved by an APT
                        Administrator, this action can take up to 1 business
                        day. If you have not been approved after this time,
                        please send a message via the feedback button with your
                        name, email and the day/time you signed up.
                      </p>
                      <p>
                        You can still access <strong>published</strong>{' '}
                        documents.
                      </p>
                    </>
                  )}
                </WelcomeBlockProse>
              </WelcomeBlock>
              {conAccessCuratorDash && <CuratorInsights />}
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
    </>
  );
}

export default UserDashboard;

const inisghtsA11y = {
  DRAFT: {
    title: () => 'Documents in draft',
    description: () =>
      'Donut chart showing the percentage of documents in draft.',
    segmentTitle: () => 'Draft',
    segmentDescription: ({ value, total }) =>
      `Colored chart segment spanning ${round(
        (value / total) * 100
      )}% of the whole, which corresponds to ${value} document${
        value !== 1 ? 's' : ''
      } in draft out of ${total} total.`
  },
  OPEN_REVIEW: {
    title: () => 'Documents in review',
    description: () =>
      'Donut chart showing the percentage of documents in review.',
    segmentTitle: () => 'In review',
    segmentDescription: ({ value, total }) =>
      `Colored chart segment spanning ${round(
        (value / total) * 100
      )}% of the whole, which corresponds to ${value} document${
        value !== 1 ? 's' : ''
      } in review out of ${total} total.`
  },
  PUBLICATION: {
    title: () => 'Documents in publication',
    description: () =>
      'Donut chart showing the percentage of documents in publication.',
    segmentTitle: () => 'In publication',
    segmentDescription: ({ value, total }) =>
      `Colored chart segment spanning ${round(
        (value / total) * 100
      )}% of the whole, which corresponds to ${value} document${
        value !== 1 ? 's' : ''
      } in publication out of ${total} total.`
  },
  PUBLISHED: {
    title: () => 'Published documents',
    description: () =>
      'Donut chart showing the percentage of published documents.',
    segmentTitle: () => 'Published',
    segmentDescription: ({ value, total }) =>
      `Colored chart segment spanning ${round(
        (value / total) * 100
      )}% of the whole, which corresponds to ${value} published document${
        value !== 1 ? 's' : ''
      } out of ${total} total.`
  }
};

function CuratorInsights() {
  const { atbds } = useAtbds();
  const { statusMapping } = useStatusColors();

  const statCount = useMemo(() => {
    if (!atbds.data) return;

    const initial = {
      total: 0,
      DRAFT: 0,
      OPEN_REVIEW: 0,
      PUBLICATION: 0,
      PUBLISHED: 0
    };
    return atbds.data.reduce((acc, doc) => {
      return doc.versions.reduce((docAcc, ver) => {
        return {
          total: docAcc.total + 1,
          DRAFT: docAcc.DRAFT + Number(isDraftEquivalent(ver)),
          OPEN_REVIEW: docAcc.OPEN_REVIEW + Number(isReviewEquivalent(ver)),
          PUBLISHED: docAcc.PUBLISHED + Number(isPublished(ver))
        };
      }, acc);
    }, initial);
  }, [atbds.data]);

  if (!atbds.data) return null;

  return (
    <InsightsBlock>
      <InsightsBlockTitle>Insights</InsightsBlockTitle>
      <InsightsBlockContent>
        {[DRAFT, OPEN_REVIEW, PUBLISHED].map((status) => (
          <Insight
            key={status}
            id={status.toLowerCase()}
            total={statCount.total}
            value={statCount[status]}
            segmentColor={statusMapping[status]}
            description={getDocumentStatusLabel(status)}
            a11y={inisghtsA11y[status]}
          />
        ))}
      </InsightsBlockContent>
    </InsightsBlock>
  );
}
