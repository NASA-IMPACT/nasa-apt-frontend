import React, { createContext, useCallback } from 'react';
import T from 'prop-types';
import qs from 'qs';

import { useAuthToken } from './user';
import withRequestToken from '../utils/with-request-token';
import { useContexeedApi } from '../utils/contexeed-v2';
import { createContextChecker } from '../utils/create-context-checker';

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
        }
        return { state, action };
      },
      requests: {
        fetchThreadsList: withRequestToken(
          token,
          ({ atbdId, atbdVersion }) => ({
            skipStateCheck: true,
            sliceKey: `${atbdId}-${atbdVersion}`,
            url: `/threads/?${qs.stringify({
              atbd_id: atbdId,
              version: atbdVersion
            })}`,
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
    deleteThreadsComment
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
              // means we want to update the list in the threadList contexeed.
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
              // Add the newly created comment to the thread comment array.
              return {
                ...state.data,
                comment_count: state.data.comment_count + 1,
                comments: [...state.data.comments, data]
              };
            }
          })
        )
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
    deleteThreadsComment
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
    fetchThreads: useCallback(() => fetchThreadsList({ atbdId, atbdVersion }), [
      atbdId,
      atbdVersion,
      fetchThreadsList
    ]),
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
    deleteThreadsComment
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
    )
  };
};
