import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, visuallyHidden } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import collecticon from '@devseed-ui/collecticons';

import StatusPill from '../common/status-pill';
import { Link } from '../../styles/clean/link';
import VersionsMenu from '../documents/versions-menu';
import Datetime from '../common/date';
import { ContributorsMenu } from './contributors-menu';
import {
  DocumentEntry,
  DocumentEntryActions,
  DocumentEntryBreadcrumbMenu,
  DocumentEntryDetails,
  DocumentEntryHeader,
  DocumentEntryHeadline,
  DocumentEntryHeadNav,
  DocumentEntryTitle
} from '../../styles/documents/list';
import ContextualDocAction from './document-item-ctx-action';

const UpdatedTimeSelf = styled.span`
  font-size: 0.875rem;

  ::before {
    ${collecticon('clock')}
    margin-right: ${glsp(0.25)};
  }
`;

const CommentCount = styled.span`
  font-size: 0.875rem;

  ::before {
    ${collecticon('speech-balloon')}
    margin-right: ${glsp(0.25)};
  }

  > span {
    ${visuallyHidden()}
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
    <DocumentEntry>
      <DocumentEntryHeader>
        <DocumentEntryHeadline>
          <DocumentEntryTitle>
            <Link to={'/'} title='View document'>
              Lorem Ipsum
            </Link>
          </DocumentEntryTitle>
          <DocumentEntryHeadNav role='navigation'>
            <DocumentEntryBreadcrumbMenu>
              <li>
                <VersionsMenu
                  atbdId={123}
                  versions={[{ version: 'v2.1' }, { version: 'v2.2' }]}
                />
              </li>
            </DocumentEntryBreadcrumbMenu>
          </DocumentEntryHeadNav>
          <StatusPill status={'draft'} completeness={10} />
        </DocumentEntryHeadline>
        <DocumentEntryDetails>
          <li>
            <UpdatedTime date={new Date()} />
          </li>
          <li>
            <ContributorsMenu />
          </li>
          <li>
            <CommentCount>
              8 <span>comments</span>
            </CommentCount>
          </li>
        </DocumentEntryDetails>
        <DocumentEntryActions>
          <ContextualDocAction action='approve-review' />
          <Button variation='base-plain' useIcon='ellipsis-vertical' hideText>
            Opt
          </Button>
          {/* <AtbdActionsMenu
            origin='hub'
            atbd={atbd}
            atbdVersion={lastVersion}
            onSelect={onAction}
          /> */}
        </DocumentEntryActions>
      </DocumentEntryHeader>
    </DocumentEntry>
  );
}

AtbdDashboardEntry.propTypes = {
  atbd: T.object,
  onDocumentAction: T.func
};

export default AtbdDashboardEntry;
