import React, { useCallback, useEffect } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { VerticalDivider } from '@devseed-ui/toolbar';

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
import Datetime from '../../common/date';

import { useSingleAtbd } from '../../../context/atbds-list';
import { calculateAtbdCompleteness } from '../completeness';
import { atbdDeleteVersionConfirmAndToast } from '../atbd-delete-process';
import {
  useDocumentModals,
  DocumentModals
} from '../document-publishing-actions';

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
  const {
    atbd,
    updateAtbd,
    fetchSingleAtbd,
    deleteAtbdVersion,
    createAtbdVersion,
    publishAtbdVersion
  } = useSingleAtbd({
    id,
    version
  });

  useEffect(() => {
    fetchSingleAtbd();
  }, [id, version, fetchSingleAtbd]);

  const { menuHandler, documentModalProps } = useDocumentModals({
    atbd: atbd.data,
    createAtbdVersion,
    updateAtbd,
    publishAtbdVersion
  });

  const onDocumentMenuAction = useCallback(
    async (menuId) => {
      // Handle actions that would trigger document modals.
      await menuHandler(menuId);

      switch (menuId) {
        case 'delete':
          await atbdDeleteVersionConfirmAndToast({
            atbd: atbd.data,
            deleteAtbdVersion,
            history
          });
          break;
      }
    },
    [atbd.data, deleteAtbdVersion, history, menuHandler]
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
          <DocumentModals {...documentModalProps} />
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
              <VerticalDivider variation='light' />
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
                        <ReleaseDate date={atbd.data.citation?.release_date} />
                        <dt>Keywords</dt>
                        <dd>coming soon</dd>
                        <dt>Creators</dt>
                        <dd>
                          {atbd.data.citation?.creators || 'None provided'}
                        </dd>
                        <dt>Editors</dt>
                        <dd>
                          {atbd.data.citation?.editors || 'None provided'}
                        </dd>
                        <dt>URL</dt>
                        <dd>
                          <a href='#' title='View'>
                            coming soon
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

const ReleaseDate = ({ date }) => {
  if (!date) {
    return (
      <React.Fragment>
        <dt>Release date</dt>
        <dd>None provided</dd>
      </React.Fragment>
    );
  }

  const dateObj = new Date(date);
  // Not parsable. Print as provided.
  if (isNaN(dateObj.getTime())) {
    return (
      <React.Fragment>
        <dt>Release date</dt>
        <dd>{date}</dd>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <dt>Release date</dt>
      <dd>
        <Datetime date={dateObj} />
      </dd>
    </React.Fragment>
  );
};

ReleaseDate.propTypes = {
  date: T.string
};
