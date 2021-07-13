import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Heading } from '@devseed-ui/typography';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { Button } from '@devseed-ui/button';

import DocumentDashboardEntry from './document-dashboard-entry';
import { DocumentsList, DocumentsListItem } from '../../styles/documents/list';
import { EmptyHub } from '../common/empty-states';

import { useAtbds } from '../../context/atbds-list';

const DashboardCuratorInner = styled.div`
  display: grid;
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};
`;

const Empty = styled(EmptyHub)`
  grid-column: 1;
`;

function DashboardCurator() {
  const { atbds, fetchAtbds } = useAtbds();

  useEffect(() => {
    fetchAtbds();
  }, [fetchAtbds]);

  return (
    <DashboardCuratorInner>
      {atbds.status === 'loading' && <GlobalLoading />}
      <Heading size='medium' as='h2'>
        Documents
      </Heading>
      {atbds.status === 'succeeded' && !atbds.data?.length && (
        <Empty>
          <p>
            APT is a repository for scientific documents, but none exist yet
          </p>
        </Empty>
      )}

      {atbds.status === 'succeeded' && atbds.data?.length && (
        <DocumentsList>
          {atbds.data.map((atbd) => (
            <DocumentsListItem key={atbd.id}>
              <DocumentDashboardEntry atbd={atbd} />
            </DocumentsListItem>
          ))}
        </DocumentsList>
      )}
    </DashboardCuratorInner>
  );
}

export default DashboardCurator;
