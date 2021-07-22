import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Heading } from '@devseed-ui/typography';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { GlobalLoading } from '@devseed-ui/global-loading';

import DocumentDashboardEntry from './document-dashboard-entry';
import { DocumentsList, DocumentsListItem } from '../../styles/documents/list';
import { EmptyHub } from '../common/empty-states';

import { useAtbds } from '../../context/atbds-list';
import { useDocumentHubMenuAction } from './use-document-menu-action';
import { PUBLISHED } from '../documents/status';

const DashboardInner = styled.div`
  display: grid;
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};
`;

const Empty = styled(EmptyHub)`
  grid-column: 1;
`;

function DashboardNoRole() {
  const { atbds, fetchAtbds } = useAtbds({ status: PUBLISHED });
  const onDocumentAction = useDocumentHubMenuAction();

  useEffect(() => {
    fetchAtbds({ status: PUBLISHED });
  }, [fetchAtbds]);

  return (
    <DashboardInner>
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
      )}
    </DashboardInner>
  );
}

export default DashboardNoRole;
