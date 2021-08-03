import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Heading } from '@devseed-ui/typography';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { GlobalLoading } from '@devseed-ui/global-loading';

import DocumentDashboardEntry from './document-dashboard-entry';
import { DocumentsList, DocumentsListItem } from '../../styles/documents/list';
import { EmptyHub } from '../common/empty-states';
import DocListSettings, { useDocListSettings } from './document-list-settings';
import DocCountIndicator from './document-count-indicator';

import { useAtbds } from '../../context/atbds-list';
import { useDocumentHubMenuAction } from './use-document-menu-action';

const DashboardCuratorInner = styled.div`
  display: grid;
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};
`;

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

  const preparedAtbds =
    atbds.status === 'succeeded' &&
    !!atbds.data?.length &&
    applyListSettings(atbds.data);

  return (
    <DashboardCuratorInner>
      {atbds.status === 'loading' && <GlobalLoading />}
      <Heading size='medium'>Documents</Heading>
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
    </DashboardCuratorInner>
  );
}

export default DashboardCurator;
