import { useCallback } from 'react';

import { createProcessToast } from '../common/toasts';

/**
 * Hook to create the submit callback for comments,
 *
 * @param {func} submitFunction The action to fire the event.
 * @param {object} messages The messages to display on the toasts.
 * @param {object} messages.start The messages to display while processing.
 * @param {string} messages.success  The messages to display on success.
 * @param {string} messages.error  The messages to display on error.
 */
function useSubmitCreator(submitFunction, messages) {
  return useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast(messages.start);
      const result = await submitFunction({ ...values });
      setSubmitting(false);
      if (result.error) {
        processToast.error(
          `${messages.error || 'An error occurred'}: ${result.error.message}`
        );
      } else {
        resetForm({ values });
        processToast.success(messages.success);
      }
    },
    [submitFunction, messages.start, messages.success, messages.error]
  );
}

export function useSubmitThread(submitFunction) {
  return useSubmitCreator(submitFunction, {
    start: 'Creating new comment thread',
    success: 'Comment thread created'
  });
}

export function useSubmitThreadComment(submitFunction) {
  return useSubmitCreator(submitFunction, {
    start: 'Creating new comment',
    success: 'Comment created'
  });
}
