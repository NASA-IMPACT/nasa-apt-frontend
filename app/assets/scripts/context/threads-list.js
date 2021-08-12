import React, { createContext, useCallback } from 'react';
import T from 'prop-types';
import qs from 'qs';
import castArray from 'lodash.castarray';

import { useAuthToken } from './user';
import withRequestToken from '../utils/with-request-token';
import { useContexeedApi } from '../utils/contexeed-v2';
import { createContextChecker } from '../utils/create-context-checker';
import useSafeState from '../utils/use-safe-state';

// Context
export const ThreadsContext = createContext(null);

const getUpdatedTimes = (thread, threadComment) => {
  const lastUpdate =
    thread.last_updated_at > threadComment.last_updated_at
      ? thread.last_updated_at
      : threadComment.last_updated_at;
  const lastUpdatedBy =
    thread.last_updated_at > threadComment.last_updated_at
      ? thread.last_updated_by
      : threadComment.last_updated_by;

  return {
    last_updated_at: lastUpdate,
    last_updated_by: lastUpdatedBy
  };
};

/**
 * Recompute the thread structure to better match what is needed by the
 * application. A thread can not exist without at least one comment which we're
 * considering the thread body, and the remaining comments are the replies to
 * this first one. This function moves the first comment out of the comments
 * array and takes care of ensuring that the thread update time is the greatest
 * between the thread update time and the first comment update time.
 *
 * @param {object} thread The thread as returned by the api
 */
export const computeThread = (thread) => {
  const {
    comments: [firstComment, ...comments],
    comment_count,
    ...threadData
  } = thread;

  return {
    ...threadData,
    // If we have a comment count we're dealing with a thread:
    // Decrease 1 from the total count, because the first is tied to the thread.
    // If not count the number of comments, which is already correct because the
    // 1st was removed above.
    comment_count: comment_count ? comment_count - 1 : comments.length,
    comments,
    body: firstComment.body,
    // Id of the comment that is used as the thread body. This is needed for
    // when we need to update this comment.
    threadCommentId: firstComment.id,
    ...getUpdatedTimes(thread, firstComment)
  };
};

// Context provider
export const ThreadsProvider = ({ children }) => {
  const { token } = useAuthToken();

  const {
    invalidate: invalidateListThreads,
    dispatch: threadsListDispatch,
    getState: getThreads,
    fetchThreadsList,
    createThread
  } = useContexeedApi(
    {
      name: 'threadsList',
      slicedState: true,
      interceptor: (state, action) => {
        switch (action.type) {
          case 'threadsList/update-item': {
            const stateSlice = state[action.key];

            // If there's no data in the list state we don't have to do
            // anything.
            if (stateSlice.status !== 'succeeded') {
              break;
            }

            // Replace the appropriate thread with the new one.
            return {
              action,
              state: {
                ...state,
                [action.key]: {
                  ...stateSlice,
                  data: stateSlice.data.map((thread) =>
                    thread.id === action.data.id ? action.data : thread
                  )
                }
              }
            };
          }
          case 'threadsList/delete-item': {
            const stateSlice = state[action.key];

            // If there's no data in the list state we don't have to do
            // anything.
            if (stateSlice.status !== 'succeeded') {
              break;
            }

            // Remove the appropriate thread.
            return {
              action,
              state: {
                ...state,
                [action.key]: {
                  ...stateSlice,
                  data: stateSlice.data.filter(
                    (thread) => thread.id !== action.threadId
                  )
                }
              }
            };
          }
          case 'threadsList/update-item-comment': {
            const stateSlice = state[action.key];

            // If there's no data in the list state we don't have to do
            // anything.
            if (stateSlice.status !== 'succeeded') {
              break;
            }

            // This action is only ever fired when the thread is being edited
            // from the thread list panel. In this case we need to use a
            // function that updates the individual comment, but we also have to
            // update the content in the thread list context hence this function.
            // Since this list only shows the thread's first comment, which
            // we're treating as the thread body, we just need to update that
            // and there's no need to search for the comment in the comment's
            // array.
            const threadId = action.data.thread_id;
            return {
              action,
              state: {
                ...state,
                [action.key]: {
                  ...stateSlice,
                  data: stateSlice.data.map((thread) => {
                    if (thread.id === threadId) {
                      return {
                        ...thread,
                        body: action.data.body,
                        ...getUpdatedTimes(thread, action.data)
                      };
                    }

                    return thread;
                  })
                }
              }
            };
          }
        }
        return { state, action };
      },
      requests: {
        fetchThreadsList: withRequestToken(
          token,
          ({
            atbdId,
            atbdVersion,
            status = 'all-status',
            section = 'all-section'
          }) => ({
            skipStateCheck: true,
            sliceKey: `${atbdId}-${atbdVersion}`,
            url: `/threads/?${qs.stringify(
              {
                atbd_id: atbdId,
                version: atbdVersion,
                status: status !== 'all-status' ? status : null,
                section: section !== 'all-section' ? section : null
              },
              { skipNulls: true }
            )}`,
            transformData: (data) => data.map(computeThread)
          })
        )
      },
      mutations: {
        createThread: withRequestToken(
          token,
          ({ atbdId, atbdVersion, section, comment }) => ({
            skipStateCheck: true,
            sliceKey: `${atbdId}-${atbdVersion}`,
            url: `/threads`,
            requestOptions: {
              method: 'POST',
              data: {
                comment: {
                  body: comment
                },
                atbd_id: atbdId,
                version: atbdVersion,
                section
              }
            },
            transformData: (data, { state }) => {
              return [computeThread(data), ...state.data];
            }
          })
        )
      }
    },
    [token]
  );

  const {
    getState: getSingleThread,
    fetchThreadsSingle,
    updateThreadsSingle,
    createThreadsComment,
    deleteThreadsSingle,
    deleteThreadsComment,
    updateThreadsComment
  } = useContexeedApi(
    {
      name: 'threadsSingle',
      slicedState: true,
      requests: {
        fetchThreadsSingle: withRequestToken(token, ({ threadId }) => ({
          skipStateCheck: true,
          sliceKey: `${threadId}`,
          url: `/threads/${threadId}`,
          transformData: computeThread
        }))
      },
      mutations: {
        updateThreadsSingle: withRequestToken(
          token,
          ({ atbdId, atbdVersion, threadId, payload }) => ({
            skipStateCheck: true,
            sliceKey: `${threadId}`,
            url: `/threads/${threadId}`,
            requestOptions: {
              method: 'POST',
              data: payload
            },
            transformData: computeThread,
            onDone: (finish, { data, error }) => {
              if (error) {
                return finish();
              }

              // If an atbdId and atbdVersion were passed to the function it
              // means we want to update the list in the threadList contexeed.
              if (atbdId && atbdVersion) {
                threadsListDispatch({
                  type: 'threadsList/update-item',
                  key: `${atbdId}-${atbdVersion}`,
                  data
                });
              }

              // Return the data receiving action.
              return finish();
            }
          })
        ),
        deleteThreadsSingle: withRequestToken(
          token,
          ({ atbdId, atbdVersion, threadId }) => ({
            skipStateCheck: true,
            sliceKey: `${threadId}`,
            url: `/threads/${threadId}`,
            requestOptions: {
              method: 'DELETE'
            },
            onDone: (finish, { error, invalidate }) => {
              if (error) {
                return finish();
              }

              // If an atbdId and atbdVersion were passed to the function it
              // means we want to update the list in the threadList contexeed
              // because the request was made from the menu on the thread list
              // panel.
              if (atbdId && atbdVersion) {
                threadsListDispatch({
                  type: 'threadsList/delete-item',
                  key: `${atbdId}-${atbdVersion}`,
                  threadId
                });
              }

              return invalidate(`${threadId}`);
            }
          })
        ),
        deleteThreadsComment: withRequestToken(
          token,
          ({ threadId, commentId }) => ({
            skipStateCheck: true,
            sliceKey: `${threadId}`,
            url: `/threads/${threadId}/comments/${commentId}`,
            requestOptions: {
              method: 'DELETE'
            },
            transformData: (data, { state }) => {
              // Remove the comment from the thread comment array.
              return {
                ...state.data,
                comment_count: state.data.comment_count - 1,
                comments: state.data.comments.filter((c) => c.id !== commentId)
              };
            }
          })
        ),
        createThreadsComment: withRequestToken(
          token,
          ({ threadId, comment }) => ({
            skipStateCheck: true,
            sliceKey: `${threadId}`,
            url: `/threads/${threadId}/comments`,
            requestOptions: {
              method: 'POST',
              data: {
                body: comment
              }
            },
            transformData: (data, { state }) => {
              // Add comment to the array.
              return {
                ...state.data,
                comment_count: state.data.comment_count + 1,
                comments: state.data.comments.concat(data)
              };
            }
          })
        ),
        updateThreadsComment: withRequestToken(
          token,
          ({ atbdId, atbdVersion, threadId, commentId, comment }) => ({
            skipStateCheck: true,
            sliceKey: `${threadId}`,
            url: `/threads/${threadId}/comments/${commentId}`,
            requestOptions: {
              method: 'POST',
              data: {
                body: comment
              }
            },
            transformData: (data, { state }) => {
              // If there's no stored data it means the request originated from
              // the thread list panel, so we don't care about updating the
              // individual thread. The thread list update is dispatched in the
              // onDone step.
              if (!state?.data) {
                return {
                  // The contextual data is only used to dispatch the correct
                  // action in the onDone step. Only the updated data will be
                  // kept.
                  contextualData: {
                    response: data
                  },
                  updatedData: null
                };
              }

              // This api request returns the updated comment data, but we're
              // storing the whole thread, with the comments inside a comment's
              // array. We need to search for the comment and update it.
              const thread = state.data;
              const commentId = data.id;

              // If we're updating the thread's first comment the behavior is
              // slightly different since we're treating the first comment as
              // the thread body it is not inside the comment's array.
              if (thread.threadCommentId === commentId) {
                return {
                  // The contextual data is only used to dispatch the correct
                  // action in the onDone step. Only the updated data will be
                  // kept.
                  contextualData: {
                    response: data
                  },
                  updatedData: {
                    ...thread,
                    body: data.body,
                    ...getUpdatedTimes(thread, data)
                  }
                };
              }

              // Find and replace the updated comment.
              return {
                // The contextual data is only used to dispatch the correct
                // action in the onDone step. Only the updated data will be
                // kept.
                contextualData: {
                  response: data
                },
                updatedData: {
                  ...thread,
                  comments: thread.comments.map((comment) =>
                    comment.id === commentId ? data : comment
                  )
                }
              };
            },
            onDone: (finish, { data, error }) => {
              if (error) {
                return finish();
              }

              // If an atbdId and atbdVersion were passed to the function it
              // means we want to update the list in the threadList contexeed
              // because the edition was made from the thread list panel.
              if (atbdId && atbdVersion) {
                threadsListDispatch({
                  type: 'threadsList/update-item-comment',
                  key: `${atbdId}-${atbdVersion}`,
                  // Original API response.
                  data: data.contextualData.response
                });
              }

              // Return the data receiving action.
              return finish(null, data.updatedData);
            }
          })
        )
      }
    },
    [token]
  );

  const [atbdsForStats, setAtbdsForStats] = useSafeState(null);

  const { getState: getThreadsStats, fetchThreadsStats } = useContexeedApi(
    {
      name: 'threadsStats',
      requests: {
        fetchThreadsStats: withRequestToken(token, ({ atbds }) => ({
          skipStateCheck: true,
          url: `/threads/stats?${qs.stringify(
            {
              atbds: castArray(atbds).map(
                ({ id, version }) => `${id}_${version}`
              )
            },
            { arrayFormat: 'repeat' }
          )}`
        }))
      }
    },
    [token]
  );

  const contextValue = {
    invalidateListThreads,
    getThreads,
    fetchThreadsList,
    getSingleThread,
    fetchThreadsSingle,
    updateThreadsSingle,
    createThread,
    createThreadsComment,
    deleteThreadsSingle,
    deleteThreadsComment,
    updateThreadsComment,
    atbdsForStats,
    setAtbdsForStats,
    getThreadsStats,
    fetchThreadsStats
  };

  return (
    <ThreadsContext.Provider value={contextValue}>
      {children}
    </ThreadsContext.Provider>
  );
};

ThreadsProvider.propTypes = {
  children: T.node
};

// Context consumers.
// Used to access different parts of the collaborators list context
const useSafeContextFn = createContextChecker(ThreadsContext, 'ThreadsContext');

export const useThreads = ({ atbdId, atbdVersion }) => {
  const {
    getThreads,
    fetchThreadsList,
    invalidateListThreads,
    createThread
  } = useSafeContextFn('useThreads');

  const sliceKey = `${atbdId}-${atbdVersion}`;

  return {
    invalidate: useCallback(() => invalidateListThreads(sliceKey), [
      sliceKey,
      invalidateListThreads
    ]),
    threads: getThreads(sliceKey),
    fetchThreads: useCallback(
      ({ status, section }) => {
        return atbdId && atbdVersion
          ? fetchThreadsList({ atbdId, atbdVersion, status, section })
          : null;
      },
      [atbdId, atbdVersion, fetchThreadsList]
    ),
    createThread: useCallback(
      ({ comment, section }) =>
        createThread({ atbdId, atbdVersion, comment, section }),
      [atbdId, atbdVersion, createThread]
    )
  };
};

export const useSingleThread = ({ threadId } = {}) => {
  const {
    getSingleThread,
    fetchThreadsSingle,
    updateThreadsSingle,
    createThreadsComment,
    deleteThreadsSingle,
    deleteThreadsComment,
    updateThreadsComment
  } = useSafeContextFn('useSingleThread');

  return {
    getSingleThread,
    thread: getSingleThread(`${threadId}`),
    fetchSingleThread: useCallback(() => fetchThreadsSingle({ threadId }), [
      threadId,
      fetchThreadsSingle
    ]),
    updateThreadStatus: useCallback(
      ({ atbdId, atbdVersion, threadId: threadIdIn, status }) =>
        updateThreadsSingle({
          atbdId,
          atbdVersion,
          threadId: threadIdIn || threadId,
          payload: { status }
        }),
      [threadId, updateThreadsSingle]
    ),
    deleteThread: useCallback(
      ({ atbdId, atbdVersion, threadId: threadIdIn }) =>
        deleteThreadsSingle({
          atbdId,
          atbdVersion,
          threadId: threadIdIn || threadId
        }),
      [threadId, deleteThreadsSingle]
    ),
    createThreadComment: useCallback(
      ({ comment }) => createThreadsComment({ comment, threadId }),
      [threadId, createThreadsComment]
    ),
    deleteThreadComment: useCallback(
      ({ commentId }) => deleteThreadsComment({ commentId, threadId }),
      [threadId, deleteThreadsComment]
    ),
    updateThreadComment: useCallback(
      ({ atbdId, atbdVersion, threadId: threadIdIn, commentId, comment }) =>
        updateThreadsComment({
          atbdId,
          atbdVersion,
          commentId,
          comment,
          threadId: threadIdIn || threadId
        }),
      [threadId, updateThreadsComment]
    )
  };
};

/**
 * The thread stats need to be refetched every time something happens that
 * changes the thread stats. This can be a thread being resolved, created or
 * deleted.
 * It is hard to carry around the ids and versions of the documents to fetch the
 * stats for, therefore they are stored when the first fetch is done with
 * fetchThreadsStatsForAtbds and reused with refreshThreadStats.
 * Refreshing the thread stats will always happen in the context of an atbd
 * being viewed, which means that there will be an initial fetch and atbds will
 * have been set.
 */
export const useThreadStats = () => {
  const {
    getThreadsStats,
    fetchThreadsStats,
    atbdsForStats,
    setAtbdsForStats
  } = useSafeContextFn('useThreadStats');

  return {
    fetchThreadsStatsForAtbds: useCallback(
      (atbds) => {
        if (!atbds) return;
        const docs = castArray(atbds);
        setAtbdsForStats(docs);
        fetchThreadsStats({ atbds: docs });
      },
      [setAtbdsForStats, fetchThreadsStats]
    ),
    refreshThreadStats: useCallback(
      () => atbdsForStats && fetchThreadsStats({ atbds: atbdsForStats }),
      [atbdsForStats, fetchThreadsStats]
    ),
    getThreadsStats: useCallback(
      ({ atbdId, atbdVersion }) => {
        const state = getThreadsStats();
        if (state.status !== 'succeeded') return null;

        return (
          state.data.find(
            (stat) => stat.atbd_id === atbdId && stat.version === atbdVersion
          ) || null
        );
      },
      [getThreadsStats]
    )
  };
};
