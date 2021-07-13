import React, { useCallback } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, visuallyHidden } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import collecticon from '@devseed-ui/collecticons';

import { AtbdStatusPill } from '../common/status-pill';
import { Link } from '../../styles/clean/link';
import VersionsMenu from '../documents/versions-menu';
import Datetime from '../common/date';
import { ContributorsMenu } from './contributors-menu';
import {
  DocumentEntry,
  DocumentEntryActions,
  DocumentEntryBreadcrumbMenu,
  DocumentEntryHeader,
  DocumentEntryHeadline,
  DocumentEntryHgroup,
  DocumentEntryNav,
  DocumentEntryDetails,
  DocumentEntryTitle
} from '../../styles/documents/list';
import ContextualDocAction from './document-item-ctx-action';

import { atbdView } from '../../utils/url-creator';

const UpdatedTime = ({ date }) => {
  return (
    <Button forwardedAs={Link} size='small' useIcon='clock' to='/'>
      Updated on <Datetime date={date} />
    </Button>
  );
};

function AtbdDashboardEntry(props) {
  const { atbd, onDocumentAction } = props;
  const lastVersion = atbd.versions[atbd.versions.length - 1];

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
          <DocumentEntryHgroup>
            <DocumentEntryTitle>
              <Link
                to={atbdView(atbd, lastVersion.version)}
                title='View document'
              >
                {atbd.title}
              </Link>
            </DocumentEntryTitle>
            <DocumentEntryNav role='navigation'>
              <DocumentEntryBreadcrumbMenu>
                <li>
                  <VersionsMenu
                    atbdId={atbd.alias || atbd.id}
                    versions={atbd.versions}
                    size='small'
                  />
                </li>
              </DocumentEntryBreadcrumbMenu>
            </DocumentEntryNav>
          </DocumentEntryHgroup>
          <DocumentEntryDetails>
            <li>
              <AtbdStatusPill atbdVersion={lastVersion} />
            </li>
            <li>
              <UpdatedTime date={updateDate} />
            </li>
            <li>
              <ContributorsMenu />
            </li>
            <li>
              <Button
                forwardedAs={Link}
                size='small'
                useIcon='speech-balloon'
                to='/'
              >
                8 comments
              </Button>
            </li>
          </DocumentEntryDetails>
        </DocumentEntryHeadline>
        <DocumentEntryActions>
          <ContextualDocAction action='approve-review' />
          <Button
            variation='base-plain'
            size='small'
            useIcon='ellipsis-vertical'
            hideText
          >
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
