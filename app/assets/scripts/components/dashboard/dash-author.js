import React from 'react';
import { Heading } from '@devseed-ui/typography';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { TabContent, TabItem, TabsManager, TabsNav } from '../common/tabs';
import AtbdDashboardEntry from './atbd-dashboard-entry';
import { DocumentsList, DocumentsListItem } from '../../styles/documents/list';

const DashboardAuthorInner = styled.div`
  display: grid;
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};
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

function DashboardAuthor(props) {
  return (
    <DashboardAuthorInner>
      <TabsManager>
        <Heading size='medium' as='h2'>
          Documents
        </Heading>
        <TabsNav>
          {authorTabNav.map((t) => (
            <TabItem key={t.id} label={t.label} tabId={t.id}>
              {t.label}
            </TabItem>
          ))}
        </TabsNav>
        <TabContent tabId='leading'>
          <DocumentsList>
            <DocumentsListItem key={1}>
              <AtbdDashboardEntry />
            </DocumentsListItem>
            <DocumentsListItem key={2}>
              <AtbdDashboardEntry />
            </DocumentsListItem>
          </DocumentsList>
        </TabContent>
        <TabContent tabId='contrib'>Tab 2 content</TabContent>
      </TabsManager>
    </DashboardAuthorInner>
  );
}

export default DashboardAuthor;
