import React, { useEffect } from 'react';
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
import Constrainer from '../../../styles/constrainer';
import StatusPill from '../../common/status-pill';
import { Link } from '../../../styles/clean/link';

import { useAtbds } from '../../../context/atbds-list';
import VersionsMenu from '../versions-menu';

function Documents() {
  const { fetchAtbds, atbds } = useAtbds();

  useEffect(() => {
    fetchAtbds();
  }, []);

  return (
    <App pageTitle='Documents'>
      {atbds.status === 'loading' && <GlobalLoading />}
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Documents</InpageTitle>
          </InpageHeadline>
          <InpageActions>
            <Button to='/' variation='achromic-plain' title='Create new'>
              Create new
            </Button>
          </InpageActions>
        </InpageHeader>
        <InpageBody>
          <Constrainer>
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
                                  completeness={80}
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
                            <Button
                              to='/'
                              variation='base-plain'
                              useIcon='ellipsis-vertical'
                              hideText
                              title='Show options'
                            >
                              Options
                            </Button>
                          </HubEntryActions>
                        </HubEntryHeader>
                      </HubEntry>
                    </HubListItem>
                  );
                })}
              </HubList>
            )}
          </Constrainer>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Documents;
