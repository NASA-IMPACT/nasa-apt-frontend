import React, { useCallback } from 'react';
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
import { atbdView } from '../../utils/url-creator';
import { calculateAtbdCompleteness } from '../documents/completeness';

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
  const { atbd, onDocumentAction } = props;
  const lastVersion = atbd.versions[atbd.versions.length - 1];

  const { percent } = calculateAtbdCompleteness(lastVersion);

  // const onAction = useCallback((...args) => onDocumentAction(atbd, ...args), [
  //   onDocumentAction,
  //   atbd
  // ]);

  // The updated at is the most recent between the version updated at and the
  // atbd updated at.
  const updateDate = new Date(
    Math.max(
      new Date(atbd.last_updated_at).getTime(),
      new Date(lastVersion.last_updated_at).getTime()
    )
  );

  return (
    <DocumentEntry>
      <DocumentEntryHeader>
        <DocumentEntryHeadline>
          <DocumentEntryTitle>
            <Link
              to={atbdView(atbd, lastVersion.version)}
              title='View document'
            >
              {atbd.title}
            </Link>
          </DocumentEntryTitle>
          <DocumentEntryHeadNav role='navigation'>
            <DocumentEntryBreadcrumbMenu>
              <li>
                <VersionsMenu
                  atbdId={atbd.alias || atbd.id}
                  versions={atbd.versions}
                />
              </li>
            </DocumentEntryBreadcrumbMenu>
          </DocumentEntryHeadNav>
          <StatusPill status={lastVersion.status} completeness={percent} />
        </DocumentEntryHeadline>
        <DocumentEntryDetails>
          <li>
            <UpdatedTime date={updateDate} />
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
