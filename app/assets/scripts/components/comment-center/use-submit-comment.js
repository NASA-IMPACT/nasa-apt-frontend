import { useCallback } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

import { createProcessToast } from '../common/toasts';
import { THREAD_SECTION_ALL, THREAD_STATUS_ALL, THREAD_CLOSED } from './common';

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
        return false;
      } else {
        resetForm();
        processToast.success(messages.success);
        return true;
      }
    },
    [submitFunction, messages.start, messages.success, messages.error]
  );
}

export function useSubmitThread({
  submitFunction,
  setSelectedSection,
  selectedSection,
  selectedStatus,
  setSelectedStatus
}) {
  return useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast('Creating new comment thread');
      const result = await submitFunction(values);
      setSubmitting(false);
      if (result.error) {
        processToast.error(`An error occurred: ${result.error.message}`);
        return false;
      } else {
        resetForm();
        processToast.success('Comment thread created');

        // When the status and section changes a request is made for the list of
        // threads. We want to batch these state operations to avoid requests
        // when only one changes.
        // https://dev.to/raibima/batch-your-react-updates-120b
        unstable_batchedUpdates(() => {
          if (
            selectedSection !== THREAD_SECTION_ALL &&
            selectedSection !== values.section
          ) {
            setSelectedSection(THREAD_SECTION_ALL);
          }
          if (selectedStatus === THREAD_CLOSED) {
            setSelectedStatus(THREAD_STATUS_ALL);
          }
        });
        return true;
      }
    },
    [
      submitFunction,
      setSelectedSection,
      selectedSection,
      selectedStatus,
      setSelectedStatus
    ]
  );
}

export function useSubmitThreadComment(submitFunction) {
  return useSubmitCreator(submitFunction, {
    start: 'Creating new comment',
    success: 'Comment created'
  });
}

export function useSubmitUpdateThread({
  submitFunction,
  dismissEditField,
  atbdId,
  atbdVersion
}) {
  return useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast('Updating thread');
      const result = await submitFunction({ ...values, atbdId, atbdVersion });
      setSubmitting(false);
      if (result.error) {
        processToast.error(`An error occurred: ${result.error.message}`);
      } else {
        resetForm({ values });
        processToast.success('Thread updated');
        dismissEditField?.(null);
      }
    },
    [submitFunction, dismissEditField, atbdId, atbdVersion]
  );
}
