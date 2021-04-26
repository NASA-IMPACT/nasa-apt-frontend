import { useCallback } from 'react';

import { atbdView } from '../../../utils/url-creator';
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

export function useSubmitForMinorVersion(
  updateAtbd,
  setUpdatingMinorVersion,
  history
) {
  return useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast('Updating minor version');
      const result = await updateAtbd(values);
      setSubmitting(false);
      if (result.error) {
        processToast.error(`An error occurred: ${result.error.message}`);
      } else {
        resetForm();
        setUpdatingMinorVersion(false);
        processToast.success(
          `Minor version updated to: ${result.data.version}`
        );
        history.replace(atbdView(result.data, result.data.version));
      }
    },
    [updateAtbd, setUpdatingMinorVersion, history]
  );
}

export function useSubmitForPublishingVersion(
  atbdVersion,
  publishAtbdVersion,
  setPublishingDocument
) {
  return useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast('Publishing version.');
      const result = await publishAtbdVersion(values);
      setSubmitting(false);
      if (result.error) {
        processToast.error(`An error occurred: ${result.error.message}`);
      } else {
        resetForm({ values });
        setPublishingDocument(false);
        processToast.success(`Version ${atbdVersion} was published.`);
      }
    },
    [atbdVersion, publishAtbdVersion, setPublishingDocument]
  );
}

export function useSubmitForDocumentInfo(updateAtbd) {
  return useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast('Updating changelog');
      const result = await updateAtbd(values);
      setSubmitting(false);
      if (result.error) {
        processToast.error(`An error occurred: ${result.error.message}`);
      } else {
        resetForm({ values });
        processToast.success('Changelog updated');
      }
    },
    [updateAtbd]
  );
}