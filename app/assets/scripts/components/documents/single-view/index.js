import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

import App from '../../common/app';
import {
  Inpage,
  InpageHeaderSticky,
  InpageActions,
  InpageBody
} from '../../../styles/inpage';
import UhOh from '../../uhoh';
import { ContentBlock } from '../../../styles/content-block';
import Prose from '../../../styles/typography/prose';
import DetailsList from '../../../styles/typography/details-list';
import DocumentNavHeader from '../document-nav-header';
import AtbdActionsMenu from '../atbd-actions-menu';
import AtbdDownloadMenu from '../atbd-download-menu';
import DocumentOutline from './document-outline';
import DocumentBody from './document-body';
import { ScrollAnchorProvider } from './scroll-manager';

import { useSingleAtbd } from '../../../context/atbds-list';
import { calculateAtbdCompleteness } from '../completeness';
import { confirmDeleteAtbdVersion } from '../../common/confirmation-prompt';
import toasts from '../../common/toasts';

const DocumentCanvas = styled(InpageBody)`
  padding: 0;
  display: grid;
  grid-template-columns: min-content 1fr;
  height: 100%;

  > * {
    grid-row: 1;
  }
`;

const DocumentContent = styled.div`
  grid-column: content-start / content-end;
  max-width: 52rem;
`;

const DocumentHeader = styled.header`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2rem;
  padding-bottom: ${glsp(1.5)};

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: ${themeVal('color.baseAlphaC')};
    content: '';
    pointer-events: none;
  }
`;

const DocumentTitle = styled(Heading)`
  margin: 0;
`;

const DocumentMetaDetails = styled(DetailsList)`
  background: transparent;
`;

function DocumentView() {
  const { id, version } = useParams();
  const history = useHistory();
  const { atbd, fetchSingleAtbd, deleteAtbdVersion } = useSingleAtbd({
    id,
    version
  });

  useEffect(() => {
    fetchSingleAtbd();
  }, [id, version]);

  const onDocumentMenuAction = useCallback(
    async (menuId) => {
      if (menuId === 'delete') {
        const { result: confirmed } = await confirmDeleteAtbdVersion(
          atbd.data?.title,
          atbd.data?.version
        );

        if (confirmed) {
          const result = await deleteAtbdVersion();
          if (result.error) {
            toasts.error(`An error occurred: ${result.error.message}`);
          } else {
            toasts.success('ATBD successfully deleted');
            history.push('/documents');
          }
        }
      }
    },
    [atbd.data?.title, atbd.data?.version, deleteAtbdVersion, history]
  );

  // We only want to handle errors when the atbd request fails. Mutation errors,
  // tracked by the `mutationStatus` property are handled in the submit
  // handlers.
  if (atbd.status === 'failed') {
    const errCode = atbd.error?.response.status;

    if (errCode === 400 || errCode === 404) {
      return <UhOh />;
    } else if (atbd.error) {
      // This is a serious server error. By throwing it will be caught by the
      // error boundary. There's no recovery from this error.
      throw atbd.error;
    }
  }

  const completeness = atbd.data
    ? calculateAtbdCompleteness(atbd.data).percent
    : 0;

  return (
    <App pageTitle='Document view'>
      {atbd.status === 'loading' && <GlobalLoading />}
      {atbd.status === 'succeeded' && (
        <Inpage>
          <InpageHeaderSticky data-element='inpage-header'>
            <DocumentNavHeader
              atbdId={id}
              title={atbd.data.title}
              status={atbd.data.status}
              version={version}
              versions={atbd.data.versions}
              completeness={completeness}
              mode='view'
            />
            <InpageActions>
              <AtbdDownloadMenu atbd={atbd.data} />
              <AtbdActionsMenu
                // In the case of a single ATBD the selected version data is
                // merged with the ATBD meta and that's why both variables are
                // the same.
                atbd={atbd.data}
                atbdVersion={atbd.data}
                variation='achromic-plain'
                onSelect={onDocumentMenuAction}
              />
            </InpageActions>
          </InpageHeaderSticky>
          <ScrollAnchorProvider>
            <DocumentCanvas>
              <DocumentOutline atbd={atbd.data} />
              <ContentBlock>
                <DocumentContent>
                  <Prose>
                    <DocumentHeader>
                      <DocumentTitle>{atbd.data.title}</DocumentTitle>
                      <DocumentMetaDetails>
                        <dt>Version</dt>
                        <dd>{atbd.data.version}</dd>
                        <dt>Release date</dt>
                        <dd>
                          <time dateTime='2020-12-04'>Dec 4, 2020</time>
                        </dd>
                        <dt>Keywords</dt>
                        <dd>constellation, GPM, multi-satellite, IMERG</dd>
                        <dt>Authors</dt>
                        <dd>
                          George J. Huffman, David T. Bolvin, Dan Braithwaite,
                          Kuolin Hsu, Robert Joyce, Pingping Xie
                        </dd>
                        <dt>Editors</dt>
                        <dd>Kuolin Hsu, Robert Joyce, Pingping Xie</dd>
                        <dt>URL</dt>
                        <dd>
                          <a href='#' title='View'>
                            doi.org/10.5067/GEDI
                          </a>
                        </dd>
                      </DocumentMetaDetails>
                    </DocumentHeader>
                    <DocumentBody atbd={atbd.data} />
                  </Prose>
                </DocumentContent>
              </ContentBlock>
            </DocumentCanvas>
          </ScrollAnchorProvider>
        </Inpage>
      )}
    </App>
  );
}

export default DocumentView;
