import { useCallback } from 'react';

import { createProcessToast } from '../common/toasts';

export function useSubmitThread(submitFunction) {
  return useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast('Creating new comment thread');
      const result = await submitFunction({
        ...values
      });
      setSubmitting(false);

      if (result.error) {
        processToast.error(`An error occurred: ${result.error.message}`);
      } else {
        resetForm();
        processToast.success('Comment thread created');
      }
    },
    [submitFunction]
  );
}
