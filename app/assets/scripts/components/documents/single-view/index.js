import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { VerticalDivider } from '@devseed-ui/toolbar';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import App from '../../common/app';
import {
  Inpage,
  InpageHeaderSticky,
  InpageActions,
  InpageBody
} from '../../../styles/inpage';
import UhOh from '../../uhoh';
import Forbidden from '../../../a11n/forbidden';
import DocumentHeadline from '../document-headline';
import DocumentActionsMenu from '../document-actions-menu';
import DocumentOutline from './document-outline';
import DocumentDownloadMenu from '../document-download-menu';
import { ScrollAnchorProvider } from './scroll-manager';
import DocumentGovernanceAction from '../document-governance-action';
import DocumentContent from './document-content';

import {
  useSingleAtbd,
  useSingleAtbdEvents
} from '../../../context/atbds-list';
import { documentDeleteVersionConfirmAndToast } from '../document-delete-process';
import { useDocumentModals, DocumentModals } from '../use-document-modals';
import { useUser } from '../../../context/user';
import {
  useCommentCenter,
  useCommentCenterHistoryHandler
} from '../../../context/comment-center';
import { useThreadStats } from '../../../context/threads-list';
import { useEffectPrevious } from '../../../utils/use-effect-previous';

const DocumentContentWrapper = styled.div`
  max-width: 52rem;
  padding: ${glsp(themeVal('layout.gap.large'))};
`;

const DocumentCanvas = styled(InpageBody)`
  padding: 0;
  display: grid;
  grid-template-columns: min-content 1fr;
  height: 100%;

  > * {
    grid-row: 1;
  }
`;

const InpageViewActions = styled(InpageActions)`
  ${VerticalDivider}:first-child {
    display: none;
  }
`;

function DocumentView() {
  const { id, version } = useParams();
  const history = useHistory();
  const { isAuthReady } = useUser();
  const {
    atbd,
    updateAtbd,
    fetchSingleAtbd,
    deleteAtbdVersion,
    createAtbdVersion
  } = useSingleAtbd({ id, version });
  // Get all fire event actions.
  const atbdFevActions = useSingleAtbdEvents({ id, version });
  // Thread stats - function for initial fetching which stores the document for
  // which stats are being fetched. Calls to the the refresh (exported by
  // useThreadStats) function will use the same stored document.
  const { fetchThreadsStatsForAtbds } = useThreadStats();

  const { isPanelOpen, setPanelOpen, openPanelOn } = useCommentCenter({ atbd });

  // Se function definition for explanation.
  useCommentCenterHistoryHandler({ atbd });

  // Fetch the thread stats list to show in the button when the document loads.
  useEffectPrevious(
    (prev) => {
      const prevStatus = prev?.[0]?.status;
      // This hook is called when the "atbd" changes, which happens also when
      // there's a mutation, but we don't want to fetch stats on mutations, only
      // when the atbd is fetched (tracked by a .status change.)
      if (prevStatus !== atbd.status && atbd.status === 'succeeded') {
        fetchThreadsStatsForAtbds(atbd.data);
      }
    },
    [atbd, fetchThreadsStatsForAtbds]
  );

  useEffect(() => {
    isAuthReady && fetchSingleAtbd();
  }, [isAuthReady, id, version, fetchSingleAtbd]);

  const { menuHandler, documentModalProps } = useDocumentModals({
    atbd: atbd.data,
    createAtbdVersion,
    updateAtbd,
    ...atbdFevActions
  });

  const onDocumentMenuAction = useCallback(
    async (menuId) => {
      // Handle actions that would trigger document modals.
      await menuHandler(menuId);

      switch (menuId) {
        case 'delete':
          await documentDeleteVersionConfirmAndToast({
            atbd: atbd.data,
            deleteAtbdVersion,
            history
          });
          break;
        case 'toggle-comments':
          if (isPanelOpen) {
            setPanelOpen(false);
          } else {
            openPanelOn({
              // The atbdId must be numeric. The alias does not work.
              atbdId: atbd.data.id,
              atbdVersion: atbd.data.version
            });
          }
      }
    },
    [
      atbd.data,
      deleteAtbdVersion,
      history,
      menuHandler,
      isPanelOpen,
      setPanelOpen,
      openPanelOn
    ]
  );

  // We only want to handle errors when the atbd request fails. Mutation errors,
  // tracked by the `mutationStatus` property are handled in the submit
  // handlers.
  if (atbd.status === 'failed') {
    const errCode = atbd.error?.response.status;

    if (errCode === 400 || errCode === 404) {
      return <UhOh />;
    } else if (errCode === 403) {
      return <Forbidden />;
    } else if (atbd.error) {
      // This is a serious server error. By throwing it will be caught by the
      // error boundary. There's no recovery from this error.
      throw atbd.error;
    }
  }

  const pageTitle = atbd.data?.title
    ? `Viewing ${atbd.data.title}`
    : 'ATBD view';

  return (
    <App pageTitle={pageTitle}>
      {atbd.status === 'loading' && <GlobalLoading />}
      {atbd.status === 'succeeded' && (
        <Inpage>
          <DocumentModals {...documentModalProps} />
          <InpageHeaderSticky data-element='inpage-header'>
            <DocumentHeadline
              atbd={atbd.data}
              onAction={onDocumentMenuAction}
              mode='view'
            />
            <InpageViewActions>
              <DocumentGovernanceAction
                atbdId={id}
                version={version}
                atbd={atbd.data}
                origin='single-view'
                onAction={onDocumentMenuAction}
              />
              <VerticalDivider variation='light' />
              <DocumentDownloadMenu
                atbd={atbd.data}
                variation='achromic-plain'
              />
              <VerticalDivider variation='light' />
              <DocumentActionsMenu
                // In the case of a single ATBD the selected version data is
                // merged with the ATBD meta and that's why both variables are
                // the same.
                atbd={atbd.data}
                atbdVersion={atbd.data}
                variation='achromic-plain'
                onSelect={onDocumentMenuAction}
                origin='single-view'
              />
            </InpageViewActions>
          </InpageHeaderSticky>
          <ScrollAnchorProvider>
            <DocumentCanvas>
              <DocumentOutline atbd={atbd.data} />
              <DocumentContentWrapper>
                <DocumentContent atbdData={atbd.data} />
              </DocumentContentWrapper>
            </DocumentCanvas>
          </ScrollAnchorProvider>
        </Inpage>
      )}
    </App>
  );
}

export default DocumentView;
