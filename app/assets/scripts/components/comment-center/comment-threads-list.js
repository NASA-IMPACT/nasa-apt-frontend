import React, { useCallback, useEffect } from 'react';
import T from 'prop-types';

import CommentEntry, { THREAD_LIST_ITEM } from './comment-entry';
import CommentLoadingProcess from './comment-loading-process';

import { getDocumentSection } from '../documents/single-edit/sections';
import { useSingleThread, useThreads } from '../../context/threads-list';
import {
  THREAD_CLOSED,
  THREAD_OPEN,
  ErrorComment,
  CommentList,
  isSameAproxDate,
  EmptyComment
} from './common';
import { threadDeleteConfirmAndToast } from './comment-delete-process';

export default function CommentThreadsList(props) {
  const { setOpenThreadId, filterStatus, filterSection } = props;

  const atbdId = 1;
  const atbdVersion = 'v2.0';

  const { invalidate, threads, fetchThreads } = useThreads({
    atbdId,
    atbdVersion
  });
  // Init the useSingleThread without passing any argument to use the
  // updateThreadStatus which we use to update the thread status. The function
  // will accept an id when executed without having to rely on parameters passed
  // to the useSingleThread.
  const {
    getSingleThread,
    updateThreadStatus,
    deleteThread
  } = useSingleThread();

  useEffect(() => {
    fetchThreads({ status: filterStatus, section: filterSection });
  }, [fetchThreads, filterStatus, filterSection]);

  useEffect(() => {
    return () => invalidate();
  }, [invalidate]);

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

  const onMenuAction = useCallback(
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
      }
    },
    [deleteThread]
  );

  return (
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
            {threads.data.map((c) => (
              <li key={c.id}>
                <CommentEntry
                  type={THREAD_LIST_ITEM}
                  onMenuAction={onMenuAction}
                  commentId={c.id}
                  author={c.created_by}
                  isResolved={c.status === THREAD_CLOSED}
                  disabled={
                    getSingleThread(`${c.id}`)?.mutationStatus === 'loading'
                  }
                  isEdited={
                    !isSameAproxDate(
                      new Date(c.created_at),
                      new Date(c.last_updated_at)
                    )
                  }
                  // isEditing={c.isEditing}
                  date={new Date(c.last_updated_at)}
                  section={getDocumentSection(c.section)}
                  replyCount={c.comment_count}
                  comment={c.body}
                  onViewClick={setOpenThreadId}
                  onResolveClick={onResolveClick}
                />
              </li>
            ))}
          </CommentList>
        ) : (
          <EmptyComment>
            {filterSection !== 'all-section' ||
            filterSection !== 'all-status' ? (
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
  );
}
CommentThreadsList.propTypes = {
  setOpenThreadId: T.func,
  filterStatus: T.string,
  filterSection: T.string
};
