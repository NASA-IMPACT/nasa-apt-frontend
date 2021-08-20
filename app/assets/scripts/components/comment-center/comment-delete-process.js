import React from 'react';

import {
  confirmationDeleteControls,
  showConfirmationPrompt
} from '../common/confirmation-prompt';
import toasts from '../common/toasts';

/**
 * Convenience method to delete a comment and show a toast notification.
 *
 * @param {object} opt
 * @param {number} opt.threadId The thread id from which to delete the comment.
 * @param {number} opt.commentId The comment id to delete.
 * @param {func} opt.deleteFn The delete action the comment.
 */
export async function commentDeleteConfirmAndToast({
  threadId,
  commentId,
  deleteFn
}) {
  const { result: confirmed } = await showConfirmationPrompt({
    title: 'Delete this comment?',
    content: (
      <p>
        You&apos;re about to delete the comment.{' '}
        <strong>This action is irreversible.</strong>
      </p>
    ),
    renderControls: confirmationDeleteControls
  });

  if (confirmed) {
    const result = await deleteFn({ threadId, commentId });
    if (result.error) {
      toasts.error(`An error occurred: ${result.error.message}`);
      return false;
    } else {
      toasts.success('Comment successfully deleted');
      return true;
    }
  }
  return false;
}

/**
 * Convenience method to delete a thread and show a toast notification.
 *
 * @param {object} opt
 * @param {number} opt.atbdId The id of the document the thread belongs to.
 * @param {number} opt.atbdVersion The version of the document the thread
 * belongs to.
 * @param {number} opt.threadId The thread to delete.
 * @param {func} opt.deleteFn The delete action the thread.
 */
export async function threadDeleteConfirmAndToast({
  atbdId,
  atbdVersion,
  threadId,
  deleteFn
}) {
  const { result: confirmed } = await showConfirmationPrompt({
    title: 'Delete this comment thread?',
    content: (
      <p>
        You&apos;re about to delete the comment thread and all associated
        comments. <strong>This action is irreversible.</strong>
      </p>
    ),
    renderControls: confirmationDeleteControls
  });

  if (confirmed) {
    const result = await deleteFn({ atbdId, atbdVersion, threadId });
    if (result.error) {
      toasts.error(`An error occurred: ${result.error.message}`);
      return false;
    } else {
      toasts.success('Comment thread successfully deleted');
      return true;
    }
  }
  return false;
}
