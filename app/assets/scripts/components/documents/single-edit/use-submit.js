import { useCallback } from 'react';
import { useHistory } from 'react-router';

import { atbdEdit, atbdView } from '../../../utils/url-creator';
import { createProcessToast } from '../../common/toasts';
import { remindMinorVersionUpdate } from './document-minor-version-reminder';

export function useSubmitForMetaAndVersionData(updateAtbd, atbd, step) {
  const history = useHistory();

  return useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast('Saving changes');
      const result = await updateAtbd({
        ...values,
        // If the alias is submitted as empty string (""), the api fails with a
        // 404 error.
        alias: values.alias || null
      });
      setSubmitting(false);

      if (result.error) {
        processToast.error(`An error occurred: ${result.error.message}`);
      } else {
        resetForm({ values });
        processToast.success('Changes saved');
        // Update the path in case the alias changed.
        if (values.alias) {
          history.replace(atbdEdit(values.alias, atbd.version, step.id));
        }

        if (atbd.status.toLowerCase() === 'published') {
          const { result } = await remindMinorVersionUpdate(atbd.version);
          if (result) {
            // To trigger the modals to open from other pages, we use the
            // history state as the user is sent from one page to another. See
            // explanation on
            // app/assets/scripts/components/documents/document-publishing-actions.js
            history.replace(undefined, { menuAction: 'update-minor' });
          }
        }
      }
    },
    [updateAtbd, history, atbd.status, atbd.version, step.id]
  );
}

export function useSubmitForVersionData(updateAtbd, atbd) {
  const history = useHistory();

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

        if (atbd.status.toLowerCase() === 'published') {
          const { result } = await remindMinorVersionUpdate(atbd.version);
          if (result) {
            // To trigger the modals to open from other pages, we use the
            // history state as the user is sent from one page to another. See
            // explanation on
            // app/assets/scripts/components/documents/document-publishing-actions.js
            history.push(undefined, { menuAction: 'update-minor' });
          }
        }
      }
    },
    [updateAtbd, history, atbd.version, atbd.status]
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
