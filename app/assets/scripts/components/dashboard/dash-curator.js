import React, { useEffect } from 'react';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
import { GlobalLoading } from '@devseed-ui/global-loading';

import DocumentDashboardEntry from './document-dashboard-entry';
import { DocumentsList, DocumentsListItem } from '../../styles/documents/list';
import { EmptyHub } from '../common/empty-states';
import DocListSettings, { useDocListSettings } from './document-list-settings';
import DocCountIndicator from './document-count-indicator';

import { computeAtbdVersion, useAtbds } from '../../context/atbds-list';
import { useDocumentHubMenuAction } from './use-document-menu-action';
import { useThreadStats } from '../../context/threads-list';
import { DocumentsBlockTitle } from '.';

const Empty = styled(EmptyHub)`
  grid-column: 1;
`;

const DocsNav = styled.nav`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-row-gap: ${glsp()};
`;

function DashboardCurator() {
  const { atbds, fetchAtbds } = useAtbds();
  // Thread stats - function for initial fetching which stores the documents for
  // which stats are being fetched. Calls to the the refresh (exported by
  // useThreadStats) function will use the same stored document.
  const { fetchThreadsStatsForAtbds } = useThreadStats();
  const onDocumentAction = useDocumentHubMenuAction();
  const {
    listSettingsValues,
    listSettingsSetter,
    applyListSettings,
    applyListSettingsFilters
  } = useDocListSettings();

  useEffect(() => {
    if (atbds.status === 'idle') {
      fetchAtbds();
    }
  }, [atbds.status, fetchAtbds]);

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

  const preparedAtbds =
    atbds.status === 'succeeded' &&
    !!atbds.data?.length &&
    applyListSettings(atbds.data);

  return (
    <>
      {atbds.status === 'loading' && <GlobalLoading />}
      <DocumentsBlockTitle>Documents</DocumentsBlockTitle>
      {atbds.status === 'succeeded' && !atbds.data?.length && (
        <Empty>
          <p>
            APT is a repository for scientific documents, but none exist yet.
          </p>
        </Empty>
      )}

      {atbds.status === 'succeeded' && !!atbds.data?.length && (
        <React.Fragment>
          <DocsNav>
            <DocListSettings
              values={listSettingsValues}
              onSelect={listSettingsSetter}
            />
            <DocCountIndicator
              applyListSettingsFilters={applyListSettingsFilters}
            />
          </DocsNav>
          <DocumentsList>
            {preparedAtbds.length ? (
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
              <Empty>
                <p>There are no documents that match the current filters.</p>
              </Empty>
            )}
          </DocumentsList>
        </React.Fragment>
      )}
    </>
  );
}

export default DashboardCurator;
