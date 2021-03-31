import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Button } from '@devseed-ui/button';
import { GlobalLoading } from '@devseed-ui/global-loading';

import App from '../../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageActions,
  InpageBody
} from '../../../styles/inpage';
import {
  HubList,
  HubListItem,
  HubEntry,
  HubEntryHeader,
  HubEntryHeadline,
  HubEntryTitle,
  HubEntryMeta,
  HubEntryDetails,
  HubEntryHeadNav,
  HubEntryBreadcrumbMenu,
  HubEntryActions
} from '../../../styles/hub';
import { ContentBlock } from '../../../styles/content-block';
import StatusPill from '../../common/status-pill';
import { Link } from '../../../styles/clean/link';
import VersionsMenu from '../versions-menu';
import AtbdActionsMenu from '../atbd-actions-menu';

import { useAtbds } from '../../../context/atbds-list';
import { atbdEdit } from '../../../utils/url-creator';
import { createProcessToast } from '../../common/toasts';
import { calculateAtbdCompleteness } from '../completeness';

function Documents() {
  const { fetchAtbds, createAtbd, atbds } = useAtbds();
  const history = useHistory();

  useEffect(() => {
    fetchAtbds();
  }, []);

  if (atbds.error) {
    // This is a serious server error. By throwing it will be caught by the
    // error boundary. There's no recovery from this error.
    throw atbds.error;
  }

  const onCreateClick = async () => {
    const processToast = createProcessToast('Creating new ATBD');
    const result = await createAtbd();

    if (result.error) {
      processToast.error(`An error occurred: ${result.error.message}`);
    } else {
      processToast.success('ATBD successfully created');
      history.push(atbdEdit(result.data));
    }
  };

  return (
    <App pageTitle='Documents'>
      {atbds.status === 'loading' && <GlobalLoading />}
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Documents</InpageTitle>
          </InpageHeadline>
          <InpageActions>
            <Button
              variation='achromic-plain'
              title='Create new ATBD'
              onClick={onCreateClick}
            >
              Create new
            </Button>
          </InpageActions>
        </InpageHeader>
        <InpageBody>
          <ContentBlock>
            {atbds.status === 'succeeded' && !atbds.data?.length && (
              <div>
                There are no documents. You can start by creating one.
                <Button
                  to='/'
                  variation='primary-raised-dark'
                  title='Create new'
                >
                  Create new
                </Button>
              </div>
            )}
            {atbds.status === 'succeeded' && atbds.data?.length && (
              <HubList>
                {atbds.data.map((atbd) => {
                  const lastVersion = atbd.versions[atbd.versions.length - 1];

                  const { percent } = calculateAtbdCompleteness(lastVersion);

                  return (
                    <HubListItem key={atbd.id}>
                      <HubEntry>
                        <HubEntryHeader>
                          <HubEntryHeadline>
                            <HubEntryTitle>
                              <Link
                                to={`/documents/${atbd.alias || atbd.id}/${
                                  lastVersion.version
                                }`}
                                title='View document'
                              >
                                {atbd.title}
                              </Link>
                            </HubEntryTitle>
                            <HubEntryHeadNav role='navigation'>
                              <HubEntryBreadcrumbMenu>
                                <li>
                                  <VersionsMenu
                                    atbdId={atbd.alias || atbd.id}
                                    versions={atbd.versions}
                                  />
                                </li>
                              </HubEntryBreadcrumbMenu>
                            </HubEntryHeadNav>
                          </HubEntryHeadline>
                          {lastVersion.status === 'Draft' && (
                            <HubEntryMeta>
                              <dt>Status</dt>
                              <dd>
                                <StatusPill
                                  status={lastVersion.status}
                                  completeness={percent}
                                />
                              </dd>
                            </HubEntryMeta>
                          )}
                          <HubEntryDetails>
                            <dt>By</dt>
                            <dd>George J. Huffman et al.</dd>
                            <dt>On</dt>
                            <dd>
                              <time dateTime='2021-02-07'>Feb 7, 2021</time>
                            </dd>
                          </HubEntryDetails>
                          <HubEntryActions>
                            <AtbdActionsMenu
                              atbd={atbd}
                              atbdVersion={lastVersion}
                            />
                          </HubEntryActions>
                        </HubEntryHeader>
                      </HubEntry>
                    </HubListItem>
                  );
                })}
              </HubList>
            )}
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Documents;
