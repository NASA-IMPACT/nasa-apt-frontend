import { useCallback } from 'react';

import { createProcessToast } from '../../common/toasts';

export function useSubmitForVersionData(updateAtbd) {
  return useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast('Saving changes');
      const result = await updateAtbd(values);
      setSubmitting(false);
      if (result.error) {
        processToast.error(`An error occurred: ${result.error.message}`);
      } else {
        resetForm({ values });
        processToast.success('Changes saved');
      }
    },
    [updateAtbd]
  );
}
