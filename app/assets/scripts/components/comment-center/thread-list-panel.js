import React, { useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import ShadowScrollbar from '@devseed-ui/shadow-scrollbar';

import {
  PanelHeader,
  PanelHeadline,
  PanelTitleAlt,
  PanelBody,
  PanelActions
} from '../../styles/panel';
import CommentForm, { CommentFormWrapper } from './comment-form';
import CommentEntry, { THREAD_LIST_ITEM } from './comment-entry';
import CommentSectionsMenu from './comment-sections-menu';
import CommentLoadingProcess from './comment-loading-process';

import { useCommentCenter } from '../../context/comment-center';
import { useSingleThread, useThreads } from '../../context/threads-list';
import { useSubmitThread, useSubmitUpdateThread } from './use-submit-comment';
import { threadDeleteConfirmAndToast } from './comment-delete-process';
import {
  CommentList,
  EmptyComment,
  ErrorComment,
  isSameAproxDate,
  THREAD_CLOSED,
  THREAD_OPEN
} from './common';
import { getDocumentSection } from '../documents/single-edit/sections';

const CommentShadowScrollbar = styled(ShadowScrollbar)`
  height: 100%;
`;

function ThreadListPanelContents() {
  const {
    setPanelOpen,
    selectedSection,
    setSelectedSection,
    selectedStatus,
    setSelectedStatus,
    openThreadId,
    setOpenThreadId,
    editingCommentKey,
    setEditingCommentKey
  } = useCommentCenter();

  const atbdId = 1;
  const atbdVersion = 'v2.0';

  const { createThread, invalidate, threads, fetchThreads } = useThreads({
    atbdId,
    atbdVersion
  });
  // Since we're not looking at a single thread, but at a thread list, we can't
  // initialize the useSingleThread with the thread id.
  // However we need to access single thread related function to perform a
  // variety of actions like updating the thread status or deleting a thread.
  // If not initialized with an Id, these functions allow us to pass one when
  // they're executed.
  const {
    getSingleThread,
    updateThreadStatus,
    deleteThread,
    updateThreadComment
  } = useSingleThread();

  // Fetch threads when parameters change.
  useEffect(() => {
    fetchThreads({ status: selectedStatus, section: selectedSection });
  }, [fetchThreads, selectedStatus, selectedSection]);

  // Clear the state when we leave this panel.
  useEffect(() => {
    return () => invalidate();
  }, [invalidate]);

  const onCommentEditCancel = useCallback(() => setEditingCommentKey(null), [
    setEditingCommentKey
  ]);

  const onSubmitThread = useSubmitThread(createThread);
  const onCommentEditSubmit = useSubmitUpdateThread({
    submitFunction: updateThreadComment,
    dismissEditField: setEditingCommentKey,
    atbdId,
    atbdVersion
  });

  const onCommentSectionMenuSelect = useCallback(
    (id, { menuItem }) => {
      switch (menuItem.menuId) {
        case 'status':
          setSelectedStatus(id);
          break;
        case 'section':
          setSelectedSection(id);
          break;
      }
    },
    [setSelectedStatus, setSelectedSection]
  );

  const menuActiveItems = useMemo(() => [selectedSection, selectedStatus], [
    selectedSection,
    selectedStatus
  ]);

  const onCommentEntryMenuAction = useCallback(
    async (menuId, { threadId }) => {
      switch (menuId) {
        case 'delete-thread':
          await threadDeleteConfirmAndToast({
            atbdId,
            atbdVersion,
            threadId,
            deleteFn: deleteThread
          });
          break;
        case 'edit': {
          const t = threads.data.find((thread) => thread.id === threadId);
          // The comment key is the combination of the thread id and the comment
          // id. In the case of the thread we use the threadCommentId which
          // holds the id of the first thread comment which is used as the
          // thread body.
          setEditingCommentKey(`${t.id}-${t.threadCommentId}`);
          break;
        }
      }
    },
    [deleteThread, setEditingCommentKey, threads.data]
  );

  const onResolveClick = useCallback(
    (threadId) => {
      const t = threads.data.find((thread) => thread.id === threadId);
      updateThreadStatus({
        atbdId,
        atbdVersion,
        threadId,
        status: t.status === THREAD_CLOSED ? THREAD_OPEN : THREAD_CLOSED
      });
    },
    [threads.data, updateThreadStatus]
  );

  return (
    <React.Fragment>
      <PanelHeader>
        <PanelHeadline>
          <PanelTitleAlt>Comments</PanelTitleAlt>
          <CommentSectionsMenu
            activeItem={menuActiveItems}
            onSelect={onCommentSectionMenuSelect}
          />
        </PanelHeadline>
        <PanelActions>
          <Button
            useIcon='xmark--small'
            size='small'
            hideText
            title='Close panel'
            onClick={() => setPanelOpen(false)}
          >
            Close panel
          </Button>
        </PanelActions>
      </PanelHeader>
      <PanelBody>
        <CommentShadowScrollbar>
          <CommentLoadingProcess
            status={threads.status}
            renderError={() => (
              <ErrorComment>
                <p>Something went wrong loading the comments.</p>
              </ErrorComment>
            )}
            renderData={() => {
              return threads.data.length ? (
                <CommentList>
                  {threads.data.map((thread) => (
                    <li key={thread.id}>
                      <CommentEntry
                        type={THREAD_LIST_ITEM}
                        onMenuAction={onCommentEntryMenuAction}
                        onCommentEditSubmit={onCommentEditSubmit}
                        onCommentEditCancel={onCommentEditCancel}
                        threadId={thread.id}
                        commentId={thread.threadCommentId}
                        author={thread.created_by}
                        isResolved={thread.status === THREAD_CLOSED}
                        disabled={
                          getSingleThread(`${thread.id}`)?.mutationStatus ===
                          'loading'
                        }
                        isEdited={
                          !isSameAproxDate(
                            new Date(thread.created_at),
                            new Date(thread.last_updated_at)
                          )
                        }
                        isEditing={
                          editingCommentKey ===
                          `${thread.id}-${thread.threadCommentId}`
                        }
                        date={new Date(thread.last_updated_at)}
                        section={getDocumentSection(thread.section)}
                        replyCount={thread.comment_count}
                        comment={thread.body}
                        onViewClick={setOpenThreadId}
                        onResolveClick={onResolveClick}
                      />
                    </li>
                  ))}
                </CommentList>
              ) : (
                <EmptyComment>
                  {selectedSection !== 'all-section' ||
                  selectedStatus !== 'all-status' ? (
                    <p>There are no threads that match the current filters.</p>
                  ) : (
                    <React.Fragment>
                      <p>There are no threads for this document.</p>
                      <p>Say something!</p>
                    </React.Fragment>
                  )}
                </EmptyComment>
              );
            }}
          />
        </CommentShadowScrollbar>
        <CommentFormWrapper>
          <CommentForm
            threadId={openThreadId}
            type='new'
            onSubmit={onSubmitThread}
          />
        </CommentFormWrapper>
      </PanelBody>
    </React.Fragment>
  );
}

export default ThreadListPanelContents;
