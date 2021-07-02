import React from 'react';
import { Heading } from '@devseed-ui/typography';
import styled from 'styled-components';

import { TabContent, TabItem, TabsManager, TabsNav } from '../common/tabs';
import AtbdDashboardEntry from './atbd-dashboard-entry';
import { HubList, HubListItem } from '../../styles/hub';

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

function DashboardAuthor() {
  return (
    <React.Fragment>
      <Heading size='medium' as='h2'>
        Documents
      </Heading>
      <TabsManager>
        <TabsNav>
          {authorTabNav.map((t) => (
            <TabItem key={t.id} label={t.label} tabId={t.id}>
              {t.label}
            </TabItem>
          ))}
        </TabsNav>

        <TabContent tabId='leading'>
          <HubList>
            <HubListItem key={1}>
              <AtbdDashboardEntry />
            </HubListItem>
          </HubList>
        </TabContent>
        <TabContent tabId='contrib'>Tab 2 content</TabContent>
      </TabsManager>
    </React.Fragment>
  );
}

export default DashboardAuthor;
