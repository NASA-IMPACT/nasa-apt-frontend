import React, { useCallback, useEffect } from 'react';
import T from 'prop-types';

import CommentEntry, {
  COMMENT_THREAD,
  COMMENT_THREAD_REPLY
} from './comment-entry';
import CommentLoadingProcess from './comment-loading-process';

import { getDocumentSection } from '../documents/single-edit/sections';
import { useSingleThread } from '../../context/threads-list';
import {
  THREAD_CLOSED,
  THREAD_OPEN,
  ErrorComment,
  isSameAproxDate,
  CommentList,
  EmptyComment
} from './common';

export default function CommentThreadsSingle(props) {
  const { threadId } = props;

  const { thread, fetchSingleThread, updateThreadStatus } = useSingleThread({
    threadId
  });

  useEffect(() => {
    fetchSingleThread();
  }, [fetchSingleThread]);

  const onResolveClick = useCallback(
    (threadId) => {
      const t = thread.data;
      updateThreadStatus({
        threadId,
        status: t.status === THREAD_CLOSED ? THREAD_OPEN : THREAD_CLOSED
      });
    },
    [thread.data, updateThreadStatus]
  );

  return (
    <CommentLoadingProcess
      status={thread.status}
      renderError={() => (
        <ErrorComment>
          <p>Something went wrong loading the comment.</p>
        </ErrorComment>
      )}
      renderData={() => {
        const t = thread.data;
        return (
          <React.Fragment>
            <CommentEntry
              type={COMMENT_THREAD}
              commentId={t.id}
              author={t.created_by}
              isResolved={t.status === THREAD_CLOSED}
              onResolveClick={onResolveClick}
              disabled={t.mutationStatus === 'loading'}
              isEdited={
                !isSameAproxDate(
                  new Date(t.created_at),
                  new Date(t.last_updated_at)
                )
              }
              // isEditing={t.isEditing}
              date={new Date(t.last_updated_at)}
              section={getDocumentSection(t.section)}
              replyCount={t.comment_count}
              comment={t.body}
            />
            {t.comments?.length ? (
              <CommentList>
                {t.comments.map((c) => (
                  <li key={c.id}>
                    <CommentEntry
                      type={COMMENT_THREAD_REPLY}
                      commentId={c.id}
                      author={c.created_by}
                      isEdited={
                        !isSameAproxDate(
                          new Date(c.created_at),
                          new Date(c.last_updated_at)
                        )
                      }
                      // isEditing={c.isEditing}
                      date={new Date(c.last_updated_at)}
                      comment={c.body}
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
  );
}
CommentThreadsSingle.propTypes = {
  threadId: T.number
};
