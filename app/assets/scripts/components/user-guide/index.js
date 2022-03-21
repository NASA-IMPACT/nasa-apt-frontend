import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';

import App from '../common/app';
import UhOh from '../uhoh';
import {
  Inpage,
  InpageHeaderSticky,
  InpageHeadline,
  InpageHeadHgroup,
  InpageTitle,
  InpageBody,
  InpageHeadNav,
  BreadcrumbMenu
} from '../../styles/inpage';
import { ContentBlock } from '../../styles/content-block';
import Prose from '../../styles/typography/prose';

import { useSingleJsonPage, useJsonPagesIndex } from '../../context/json-pages';
import PageSelectMenu from './page-select-menu';

function UserGuide() {
  const { pageId } = useParams();
  const { pagesIndex, fetchPagesIndex } = useJsonPagesIndex('user-guide');

  // Fetch index for the help pages.
  useEffect(() => {
    fetchPagesIndex('docs/index.json');
  }, [fetchPagesIndex]);

  // Default page is the first one on the index.
  const selectedPage = pageId || pagesIndex.data?.[0]?.id;

  const { page, fetchSingleJsonPage } = useSingleJsonPage(
    `user-guide-${selectedPage}`
  );

  // Fetch a single help page when the id changes.
  useEffect(() => {
    if (selectedPage && pagesIndex.status === 'succeeded') {
      const pageOnIndex = pagesIndex.data?.find?.((p) => p.id === selectedPage);
      fetchSingleJsonPage(pageOnIndex?.url || 'fail');
    }
  }, [fetchSingleJsonPage, selectedPage, pagesIndex]);

  // We only want to handle errors when the requesting the page fails.
  if (pagesIndex.status === 'failed' || page.status === 'failed') {
    const pError = pagesIndex.error || page.error;
    const errCode = pError?.response?.status;

    if (errCode === 400 || errCode === 404) {
      return <UhOh />;
    } else if (pError.error) {
      // This is a serious server error. By throwing it will be caught by the
      // error boundary. There's no recovery from this error.
      throw pError.error;
    }
  }

  const pageTitle = page.data?.content
    ? `${page.data.title} help`
    : 'User Guide';

  return (
    <App pageTitle={pageTitle}>
      {(pagesIndex.status === 'loading' || page.status === 'loading') && (
        <GlobalLoading />
      )}
      {pagesIndex.status === 'succeeded' && (
        <Inpage>
          <InpageHeaderSticky>
            <InpageHeadline>
              <InpageHeadHgroup>
                <InpageTitle>User Guide</InpageTitle>
                <InpageHeadNav role='navigation'>
                  <BreadcrumbMenu>
                    <li>
                      <PageSelectMenu
                        pagesIndex={pagesIndex.data}
                        selectedPage={selectedPage}
                      />
                    </li>
                  </BreadcrumbMenu>
                </InpageHeadNav>
              </InpageHeadHgroup>
            </InpageHeadline>
          </InpageHeaderSticky>
          <InpageBody>
            {page.status === 'succeeded' && (
              <ContentBlock>
                <Prose
                  dangerouslySetInnerHTML={{ __html: page.data.content }}
                />
              </ContentBlock>
            )}
          </InpageBody>
        </Inpage>
      )}
    </App>
  );
}

export default UserGuide;
