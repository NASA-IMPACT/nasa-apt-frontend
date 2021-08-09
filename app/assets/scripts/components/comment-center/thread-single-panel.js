import React, { useCallback, useEffect } from 'react';
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
import CommentEntry, { THREAD_REPLY, THREAD_SINGLE } from './comment-entry';
import CommentLoadingProcess from './comment-loading-process';

import { useCommentCenter } from '../../context/comment-center';
import { useSingleThread } from '../../context/threads-list';
import {
  useSubmitThreadComment,
  useSubmitUpdateThread
} from './use-submit-comment';
import {
  CommentList,
  EmptyComment,
  ErrorComment,
  isSameAproxDate,
  THREAD_CLOSED,
  THREAD_OPEN
} from './common';
import { getDocumentSection } from '../documents/single-edit/sections';
import {
  commentDeleteConfirmAndToast,
  threadDeleteConfirmAndToast
} from './comment-delete-process';

const CommentShadowScrollbar = styled(ShadowScrollbar)`
  height: 100%;
`;

function ThreadSinglePanelContents() {
  const {
    setPanelOpen,
    openThreadId: threadId,
    setOpenThreadId,
    setEditingCommentKey,
    editingCommentKey
  } = useCommentCenter();

  const {
    thread: threadCtx,
    fetchSingleThread,
    createThreadComment,
    updateThreadComment,
    updateThreadStatus,
    deleteThread,
    deleteThreadComment
  } = useSingleThread({
    threadId
  });

  useEffect(() => {
    fetchSingleThread();
  }, [fetchSingleThread]);

  const onCommentEditCancel = useCallback(() => setEditingCommentKey(null), [
    setEditingCommentKey
  ]);

  const onSubmitThreadComment = useSubmitThreadComment(createThreadComment);

  const onCommentEditSubmit = useSubmitUpdateThread({
    submitFunction: updateThreadComment,
    dismissEditField: setEditingCommentKey
  });

  const onResolveClick = useCallback(
    (threadId) => {
      const thread = threadCtx.data;
      updateThreadStatus({
        threadId,
        status: thread.status === THREAD_CLOSED ? THREAD_OPEN : THREAD_CLOSED
      });
    },
    [threadCtx.data, updateThreadStatus]
  );

  const onCommentEntryMenuAction = useCallback(
    async (menuId, { commentId }) => {
      switch (menuId) {
        case 'delete-thread': {
          const result = await threadDeleteConfirmAndToast({
            threadId,
            deleteFn: deleteThread
          });
          result && setOpenThreadId(null);
          break;
        }
        case 'delete-comment':
          await commentDeleteConfirmAndToast({
            threadId,
            commentId,
            deleteFn: deleteThreadComment
          });
          break;
        case 'edit':
          // The comment key is the combination of the thread id and the
          // comment id.
          setEditingCommentKey(`${threadId}-${commentId}`);
          break;
      }
    },
    [
      setOpenThreadId,
      threadId,
      setEditingCommentKey,
      deleteThread,
      deleteThreadComment
    ]
  );

  return (
    <React.Fragment>
      <PanelHeader>
        <PanelHeadline>
          <PanelTitleAlt>Comment Thread</PanelTitleAlt>
          <Button
            useIcon='arrow-left'
            title='See all comments'
            onClick={() => setOpenThreadId(null)}
          >
            View all
          </Button>
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
            status={threadCtx.status}
            renderError={() => (
              <ErrorComment>
                <p>Something went wrong loading the comment.</p>
              </ErrorComment>
            )}
            renderData={() => {
              const threadData = threadCtx.data;
              return (
                <React.Fragment>
                  <CommentEntry
                    type={THREAD_SINGLE}
                    threadId={threadData.id}
                    commentId={threadData.threadCommentId}
                    onMenuAction={onCommentEntryMenuAction}
                    onCommentEditSubmit={onCommentEditSubmit}
                    onCommentEditCancel={onCommentEditCancel}
                    author={threadData.created_by}
                    isResolved={threadData.status === THREAD_CLOSED}
                    onResolveClick={onResolveClick}
                    disabled={threadData.mutationStatus === 'loading'}
                    isEdited={
                      !isSameAproxDate(
                        new Date(threadData.created_at),
                        new Date(threadData.last_updated_at)
                      )
                    }
                    isEditing={
                      editingCommentKey ===
                      `${threadData.id}-${threadData.threadCommentId}`
                    }
                    date={new Date(threadData.last_updated_at)}
                    section={getDocumentSection(threadData.section)}
                    replyCount={threadData.comment_count}
                    comment={threadData.body}
                  />
                  {threadData.comments?.length ? (
                    <CommentList>
                      {threadData.comments.map((comment) => (
                        <li key={comment.id}>
                          <CommentEntry
                            type={THREAD_REPLY}
                            threadId={comment.thread_id}
                            commentId={comment.id}
                            onMenuAction={onCommentEntryMenuAction}
                            onCommentEditSubmit={onCommentEditSubmit}
                            onCommentEditCancel={onCommentEditCancel}
                            author={comment.created_by}
                            isEdited={
                              !isSameAproxDate(
                                new Date(comment.created_at),
                                new Date(comment.last_updated_at)
                              )
                            }
                            isEditing={
                              editingCommentKey ===
                              `${comment.thread_id}-${comment.id}`
                            }
                            date={new Date(comment.last_updated_at)}
                            comment={comment.body}
                          />
                        </li>
                      ))}
                    </CommentList>
                  ) : (
                    <EmptyComment>
                      <p>There are no replies.</p>
                      <p>Say something!</p>
                    </EmptyComment>
                  )}
                </React.Fragment>
              );
            }}
          />
        </CommentShadowScrollbar>
        <CommentFormWrapper>
          <CommentForm
            threadId={threadId}
            type='reply'
            onSubmit={onSubmitThreadComment}
          />
        </CommentFormWrapper>
      </PanelBody>
    </React.Fragment>
  );
}

export default ThreadSinglePanelContents;
