import React, { useEffect } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
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
import DocListSettings, { useDocListSettings } from './document-list-settings';
import DocCountIndicator from './document-count-indicator';

import { computeAtbdVersion, useAtbds } from '../../context/atbds-list';
import { useDocumentCreate } from '../documents/single-edit/use-document-create';
import { useDocumentHubMenuAction } from './use-document-menu-action';
import { PUBLISHED } from '../documents/status';
import { useThreadStats } from '../../context/threads-list';
import { DocumentsBlockTitle } from '.';

const EmptyTab = styled(EmptyHub)`
  grid-column: 1;
`;

const DocsNav = styled.nav`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-row-gap: ${glsp()};
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
  const {
    resetListSettings,
    listSettingsValues,
    listSettingsSetter,
    applyListSettings,
    applyListSettingsFilters
  } = useDocListSettings();

  return (
    <React.Fragment>
      <TabsManager onTabChange={resetListSettings}>
        <DocumentsBlockTitle>Documents</DocumentsBlockTitle>
        <DocumentNavigation
          listSettingsValues={listSettingsValues}
          listSettingsSetter={listSettingsSetter}
          applyListSettingsFilters={applyListSettingsFilters}
        />
        <TabContent tabId='leading'>
          <TabDocuments
            role='owner'
            listSettings={listSettingsValues}
            applyListSettings={applyListSettings}
          />
        </TabContent>
        <TabContent tabId='contrib'>
          <TabDocuments
            role='author'
            listSettings={listSettingsValues}
            applyListSettings={applyListSettings}
          />
        </TabContent>
        <TabContent tabId='reviews'>
          <TabDocuments
            role='reviewer'
            listSettings={listSettingsValues}
            applyListSettings={applyListSettings}
          />
        </TabContent>
        <TabContent tabId='public'>
          <TabDocuments
            status={PUBLISHED}
            listSettings={listSettingsValues}
            applyListSettings={applyListSettings}
          />
        </TabContent>
      </TabsManager>
    </React.Fragment>
  );
}

export default DashboardContributor;

// Moving the <DocsNav> to a separate component to access the tabs context
// provided by the TabManager.
const DocumentNavigation = (props) => {
  const {
    listSettingsValues,
    listSettingsSetter,
    applyListSettingsFilters
  } = props;

  const { activeTab } = useTabs();

  return (
    <DocsNav>
      <TabsNav>
        {authorTabNav.map((t) => (
          <TabItem key={t.id} label={t.label} tabId={t.id}>
            {t.label}
          </TabItem>
        ))}
      </TabsNav>
      <DocListSettings
        alignment='right'
        origin={`tab-${activeTab}`}
        values={listSettingsValues}
        onSelect={listSettingsSetter}
      />
      <DocCountIndicator applyListSettingsFilters={applyListSettingsFilters} />
    </DocsNav>
  );
};

DocumentNavigation.propTypes = {
  listSettingsValues: T.object,
  listSettingsSetter: T.func,
  applyListSettingsFilters: T.func
};

const TabDocuments = (props) => {
  const { role, status, applyListSettings } = props;
  const { activeTab } = useTabs();
  // Thread stats - function for initial fetching which stores the documents for
  // which stats are being fetched. Calls to the the refresh (exported by
  // useThreadStats) function will use the same stored document.
  const { fetchThreadsStatsForAtbds } = useThreadStats();
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

  // Fetch the thread stats list to show in the button.
  // We do the fetching here, at a higher level, and then request the values
  // when rendering each line.
  useEffect(() => {
    if (atbds.status === 'succeeded') {
      const atbdList = atbds.data.map((a) =>
        computeAtbdVersion(a, a.versions.last)
      );
      fetchThreadsStatsForAtbds(atbdList);
    }
  }, [atbds, fetchThreadsStatsForAtbds]);

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
    const preparedAtbds = applyListSettings(atbds.data);

    return preparedAtbds.length ? (
      <DocumentsList>
        {preparedAtbds.map((atbd) => (
          <DocumentsListItem key={atbd.id}>
            <DocumentDashboardEntry
              atbd={atbd}
              onDocumentAction={onDocumentAction}
            />
          </DocumentsListItem>
        ))}
      </DocumentsList>
    ) : (
      <EmptyTab>
        <p>There are no documents that match the current filters.</p>
      </EmptyTab>
    );
  }

  return null;
};

TabDocuments.propTypes = {
  role: T.string,
  status: T.string,
  applyListSettings: T.func
};
