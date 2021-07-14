import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';
import { format } from 'date-fns';
import { Button } from '@devseed-ui/button';

import { DocumentStatusPill } from '../common/status-pill';
import { Link } from '../../styles/clean/link';
import VersionsMenu from '../documents/versions-menu';
import Datetime, { DATETIME_FORMAT } from '../common/date';
import { CollaboratorsMenu } from '../documents/collaborators-menu';
import {
  DocumentEntry,
  DocumentEntryActions,
  DocumentEntryBreadcrumbMenu,
  DocumentEntryHeader,
  DocumentEntryHeadline,
  DocumentEntryHgroup,
  DocumentEntryNav,
  DocumentEntryMeta,
  DocumentEntryTitle
} from '../../styles/documents/list';
import ContextualDocAction from './document-item-ctx-action';
import Tip from '../common/tooltip';

import { atbdView } from '../../utils/url-creator';

const UpdatedTime = ({ atbd, date }) => {
  return (
    <Tip title={format(date, DATETIME_FORMAT)}>
      <Button
        forwardedAs={Link}
        size='small'
        useIcon='clock'
        to={atbdView(atbd)}
        title='View document'
      >
        Updated <Datetime date={date} useDistanceToNow />
      </Button>
    </Tip>
  );
};

UpdatedTime.propTypes = {
  atbd: T.object,
  date: T.object
};

function DocumentDashboardEntry(props) {
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
          <DocumentEntryMeta>
            <li>
              <DocumentStatusPill atbdVersion={lastVersion} />
            </li>
            <li>
              <UpdatedTime atbd={atbd} date={updateDate} />
            </li>
            <li>
              <CollaboratorsMenu
                triggerProps={useMemo(() => ({ size: 'small' }), [])}
              />
            </li>
            <li>
              <Button
                forwardedAs={Link}
                size='small'
                useIcon='speech-balloon'
                to='/'
                title='View comments'
              >
                8 comments
              </Button>
            </li>
          </DocumentEntryMeta>
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

DocumentDashboardEntry.propTypes = {
  atbd: T.object,
  onDocumentAction: T.func
};

export default DocumentDashboardEntry;
