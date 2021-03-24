import React, { useEffect } from 'react';
import { Button } from '@devseed-ui/button';

import App from '../common/app';
import Status from '../common/status';

import { Link } from '../../styles/clean/link';

import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageActions,
  InpageBody
} from '../../styles/inpage';
import Constrainer from '../../styles/constrainer';

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
} from '../../styles/hub';

import { useAtbds } from '../../context/atbds-list';

function Documents() {
  const context = useAtbds();

  useEffect(() => {
    context.fetchAtbds();
  }, []);

  return (
    <App pageTitle='Documents'>
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
            <HubList>
              <HubListItem>
                <HubEntry>
                  <HubEntryHeader>
                    <HubEntryHeadline>
                      <HubEntryTitle>
                        <Link to='/' title='View document'>
                          GPM Integrated Multi-Satellite Retrievals for GPM
                          (IMERG) Algorithm Theoretical Basis Document
                        </Link>
                      </HubEntryTitle>
                      <HubEntryHeadNav role='navigation'>
                        <HubEntryBreadcrumbMenu>
                          <li>
                            <strong>V1.0</strong>
                          </li>
                        </HubEntryBreadcrumbMenu>
                      </HubEntryHeadNav>
                    </HubEntryHeadline>
                    <HubEntryMeta>
                      <dt>Status</dt>
                      <dd>
                        <Status status='draft' completeness={64} />
                      </dd>
                      <dt>Discussion</dt>
                      <dd>
                        <a href='#' title='View threads'>
                          2 unsolved threads
                        </a>
                      </dd>
                    </HubEntryMeta>
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
              <HubListItem>
                <HubEntry>
                  <HubEntryHeader>
                    <HubEntryHeadline>
                      <HubEntryTitle>
                        <Link to='/' title='View document'>
                          GPM Integrated Multi-Satellite Retrievals for GPM
                          (IMERG) Algorithm Theoretical Basis Document
                        </Link>
                      </HubEntryTitle>
                      <HubEntryHeadNav role='navigation'>
                        <HubEntryBreadcrumbMenu>
                          <li>
                            <strong>V1.0</strong>
                          </li>
                        </HubEntryBreadcrumbMenu>
                      </HubEntryHeadNav>
                    </HubEntryHeadline>
                    <HubEntryMeta>
                      <dt>Status</dt>
                      <dd>
                        <Status status='draft' completeness={64} />
                      </dd>
                      <dt>Discussion</dt>
                      <dd>
                        <a href='#' title='View threads'>
                          2 unsolved threads
                        </a>
                      </dd>
                    </HubEntryMeta>
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
            </HubList>
          </Constrainer>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Documents;
