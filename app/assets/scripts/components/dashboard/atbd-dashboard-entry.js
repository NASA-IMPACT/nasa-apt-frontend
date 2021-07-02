import React, { useCallback } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import collecticon from '@devseed-ui/collecticons';
import { Tooltip } from 'react-tippy';

import {
  HubEntry,
  HubEntryHeader,
  HubEntryHeadline,
  HubEntryTitle,
  HubEntryMeta,
  HubEntryDetails,
  HubEntryHeadNav,
  HubEntryBreadcrumbMenu,
  HubEntryActions
} from '../../styles/hub';
import StatusPill from '../common/status-pill';
import { Link } from '../../styles/clean/link';
import AtbdActionsMenu from '../documents/atbd-actions-menu';
import Tip from '../common/tooltip';
import VersionsMenu from '../documents/versions-menu';
import Datetime from '../common/date';
import { DropTitle } from '@devseed-ui/dropdown';
import ContributorsDrop from './contributors-drop';

const UpdatedTimeSelf = styled.span`
  font-size: 0.875rem;

  ::before {
    ${collecticon('clock')}
    margin-right: ${glsp(0.25)};
  }
`;

const UpdatedTime = ({ date }) => {
  return (
    <UpdatedTimeSelf>
      Updated on <Datetime date={date} />
    </UpdatedTimeSelf>
  );
};

function AtbdDashboardEntry(props) {
  return (
    <HubEntry>
      <HubEntryHeader>
        <HubEntryHeadline>
          <HubEntryTitle>
            <Link to={'/'} title='View document'>
              Lorem Ipsum
            </Link>
          </HubEntryTitle>
          <HubEntryHeadNav role='navigation'>
            <HubEntryBreadcrumbMenu>
              <li>
                <VersionsMenu atbdId={123} versions={[{ version: 'v2.1' }]} />
              </li>
            </HubEntryBreadcrumbMenu>
          </HubEntryHeadNav>
        </HubEntryHeadline>
        <HubEntryMeta>
          <dt>Status</dt>
          <dd>
            <StatusPill status={'draft'} completeness={10} />
          </dd>
        </HubEntryMeta>
        <HubEntryDetails>
          <dt>On</dt>
          <dd>
            <UpdatedTime date={new Date()} />
          </dd>
          <dt>Contributors</dt>
          <dd>
            <ContributorsDrop />
          </dd>
        </HubEntryDetails>
        <HubEntryActions>
          <Button variation='base-plain' useIcon='ellipsis-vertical' hideText>
            Opt
          </Button>
          {/* <AtbdActionsMenu
            origin='hub'
            atbd={atbd}
            atbdVersion={lastVersion}
            onSelect={onAction}
          /> */}
        </HubEntryActions>
      </HubEntryHeader>
    </HubEntry>
  );
}

AtbdDashboardEntry.propTypes = {
  atbd: T.object,
  onDocumentAction: T.func
};

export default AtbdDashboardEntry;

const Creators = ({ creators }) => {
  if (!creators) return null;

  const creatorsList = creators?.split(' and ');

  if (creatorsList.length > 1) {
    return (
      <React.Fragment>
        <dt>By</dt>
        <dd>
          <Tip title={creators}>{creatorsList[0]} et al.</Tip>
        </dd>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <dt>By</dt>
      <dd>{creators}</dd>
    </React.Fragment>
  );
};

Creators.propTypes = {
  creators: T.string
};
