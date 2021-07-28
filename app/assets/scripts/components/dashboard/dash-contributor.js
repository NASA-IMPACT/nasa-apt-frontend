import React, { useEffect } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Heading, headingAlt } from '@devseed-ui/typography';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { Button } from '@devseed-ui/button';

import {
  TabContent,
  TabItem,
  TabsManager,
  TabsNav,
  useTabs
} from '../common/tabs';
import DocumentDashboardEntry from './document-dashboard-entry';
import { DocumentsList, DocumentsListItem } from '../../styles/documents/list';
import { EmptyHub } from '../common/empty-states';

import { useAtbds } from '../../context/atbds-list';
import { useDocumentCreate } from '../documents/single-edit/use-document-create';
import { useDocumentHubMenuAction } from './use-document-menu-action';
import { PUBLISHED } from '../documents/status';

const DashboardContributorInner = styled.div`
  display: grid;
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};
`;

const EmptyTab = styled(EmptyHub)`
  grid-column: 1;
`;

const DocsNav = styled.nav`
  display: grid;
  grid-template-columns: 1fr min-content;
`;

const Filters = styled.ul`
  display: grid;
  grid-auto-columns: max-content;
  grid-gap: ${glsp()};
  min-height: 2rem;
  box-shadow: 0 ${themeVal('layout.border')} 0 0 ${themeVal('color.baseAlphaC')};

  > * {
    grid-row: 1;
    display: flex;
    flex-flow: row nowrap;
    gap: ${glsp(0.125)};
    align-items: center;
    margin-top: ${glsp(-1)};
  }
`;

const FilterLabel = styled.span`
  ${headingAlt()}
`;

const authorTabNav = [
  {
    id: 'leading',
    label: 'Leading'
  },
  {
    id: 'contrib',
    label: 'Contributions'
  },
  {
    id: 'reviews',
    label: 'Reviews'
  },
  {
    id: 'public',
    label: 'Public'
  }
];

function DashboardContributor() {
  return (
    <DashboardContributorInner>
      <TabsManager>
        <Heading size='medium'>Documents</Heading>
        <DocsNav>
          <TabsNav>
            {authorTabNav.map((t) => (
              <TabItem key={t.id} label={t.label} tabId={t.id}>
                {t.label}
              </TabItem>
            ))}
          </TabsNav>
          <Filters>
            <li>
              <FilterLabel>Status</FilterLabel>
              <Button title='Filter' useIcon={['chevron-down--small', 'after']}>
                All
              </Button>
            </li>
            <li>
              <FilterLabel>Order</FilterLabel>
              <Button
                title='Order by'
                useIcon={['chevron-down--small', 'after']}
              >
                Recent
              </Button>
            </li>
          </Filters>
        </DocsNav>
        <TabContent tabId='leading'>
          <TabDocuments role='owner' />
        </TabContent>
        <TabContent tabId='contrib'>
          <TabDocuments role='author' />
        </TabContent>
        <TabContent tabId='reviews'>
          <TabDocuments role='reviewer' />
        </TabContent>
        <TabContent tabId='public'>
          <TabDocuments status={PUBLISHED} />
        </TabContent>
      </TabsManager>
    </DashboardContributorInner>
  );
}

export default DashboardContributor;

const TabDocuments = (props) => {
  const { role, status } = props;
  const { activeTab } = useTabs();
  const { atbds, fetchAtbds } = useAtbds({
    role,
    status
  });

  const onCreateClick = useDocumentCreate();

  const onDocumentAction = useDocumentHubMenuAction();

  useEffect(() => {
    if (atbds.status === 'idle') {
      fetchAtbds({ role, status });
    }
  }, [atbds.status, fetchAtbds, role, status]);

  if (atbds.status === 'loading') {
    return <GlobalLoading />;
  }

  // Different empty states according o the selected tab.
  if (atbds.status === 'succeeded' && !atbds.data?.length) {
    switch (activeTab) {
      case 'leading':
        return (
          <EmptyTab>
            <p>
              You are not the lead author of any documents, but can always
              create one.
            </p>
            <Button
              variation='primary-raised-dark'
              title='Create new document'
              useIcon='plus--small'
              onClick={onCreateClick}
            >
              Create document
            </Button>
          </EmptyTab>
        );
      case 'contrib':
        return (
          <EmptyTab>
            <p>
              You haven&apos;t been invited as the co-author of any document,
              but can always create your own.
            </p>
            <Button
              variation='primary-raised-dark'
              title='Create new document'
              useIcon='plus--small'
              onClick={onCreateClick}
            >
              Create document
            </Button>
          </EmptyTab>
        );
      case 'reviews':
        return (
          <EmptyTab>
            <p>You have no documents to review.</p>
          </EmptyTab>
        );
      case 'public':
        return (
          <EmptyTab>
            <p>There are no published documents on APT</p>
          </EmptyTab>
        );
    }
  }

  if (atbds.status === 'succeeded' && atbds.data?.length) {
    return (
      <DocumentsList>
        {atbds.data.map((atbd) => (
          <DocumentsListItem key={atbd.id}>
            <DocumentDashboardEntry
              atbd={atbd}
              onDocumentAction={onDocumentAction}
            />
          </DocumentsListItem>
        ))}
      </DocumentsList>
    );
  }

  return null;
};

TabDocuments.propTypes = {
  role: T.string,
  status: T.string
};
