import { useCallback } from 'react';
import { useHistory } from 'react-router';

import { documentEdit, documentView } from '../../../utils/url-creator';
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
          history.replace(documentEdit(values.alias, atbd.version, step.id));
        }

        if (atbd.status.toLowerCase() === 'published') {
          const { result } = await remindMinorVersionUpdate(atbd.version);
          if (result) {
            // To trigger the modals to open from other pages, we use the
            // history state as the user is sent from one page to another. See
            // explanation on
            // app/assets/scripts/components/documents/use-document-modals.js
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
            // app/assets/scripts/components/documents/use-document-modals.js
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
        history.replace(documentView(result.data, result.data.version));
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

/**
 * Hook to create the submit callback for the info modal. The info modal
 * contains the changelog field. This hook shows the appropriate message.
 *
 * @param {func} updateAtbd The action to update the document.
 */
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

/**
 * Hook to create the submit callback for the collaborators modal. The owner of
 * the document is also considered a collaborator and this same submit callback
 * is used when transferring the ownership of the document.
 * The message displayed on the toast notification changed depending on whether
 * the `owner` key is present on the payload.
 *
 * @param {func} updateAtbd The action to update the document.
 */
export function useSubmitForCollaborators(updateAtbd) {
  return useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const msgIn = values.owner
        ? 'Changing document lead author'
        : 'Updating document collaborators';
      const msgOut = values.owner
        ? 'Document lead author changed successfully'
        : 'Document collaborators changed';
      const processToast = createProcessToast(msgIn);
      const result = await updateAtbd(values);
      setSubmitting(false);
      if (result.error) {
        processToast.error(`An error occurred: ${result.error.message}`);
      } else {
        resetForm({ values });
        processToast.success(msgOut);
      }
    },
    [updateAtbd]
  );
}

/**
 * Compare contacts using the updatedContact's fields as base. Since these
 * fields are the ones that can be changes, they're all that matter.
 *
 * @param {object} origContact Original contact from the contacts list
 * @param {object} updatedContact updated contact values from the form.
 */
const areContactsDifferent = (origContact, updatedContact) => {
  return Object.keys(updatedContact).some(
    (key) =>
      JSON.stringify(updatedContact[key]) !== JSON.stringify(origContact[key])
  );
};

export function useSubmitForAtbdContacts({
  updateAtbd,
  createContact,
  updateContactUnbound,
  contactsList
}) {
  return useCallback(
    async (values, { setSubmitting, resetForm, setValues }) => {
      const processToast = createProcessToast('Updating document contacts');
      const tasks = values.contacts_link.map((link) => {
        // Contacts in the isSelecting phase will be discarded.
        // Returns false because the task succeeded.
        if (link.isSelecting)
          return () => ({
            error: false
          });

        if (link.isCreating) {
          const creationTask = async () => {
            const { id: tempId, ...data } = link.contact;
            const result = await createContact({ key: tempId, data });
            if (result.error) {
              // Store as it was to recover the form state.
              return { error: result.error, link };
            } else {
              // Store updated link.
              return {
                error: false,
                link: {
                  roles: link.roles,
                  contact: result.data
                }
              };
            }
          };
          return creationTask;
        }

        // Contacts should only be updated if anything changed. Search for the
        // contact in the contacts list and compare them using the fields that
        // are present in the form.
        const origContact = contactsList.find((o) => o.id === link.contact.id);
        if (areContactsDifferent(origContact, link.contact)) {
          const updateTask = async () => {
            const data = link.contact;
            const result = await updateContactUnbound({ id: data.id, data });
            if (result.error) {
              // Store as it was to recover the form state.
              return { error: result.error, link };
            } else {
              // If the values were updated, contexeed will store the updated
              // contact in the list.
              // Return updated link.
              return {
                error: false,
                link: {
                  roles: link.roles,
                  contact: result.data
                }
              };
            }
          };
          return updateTask;
        }

        // Nothing to do to this contact. Store as is.
        return () => ({
          error: false,
          link
        });
      });

      // Execute all tasks
      const taskResults = await Promise.all(tasks.map((t) => t()));

      // If one task fail, stop. The successful tasks won't be repeated on the
      // next run.
      const erroredTask = taskResults.find((t) => !!t.error);
      if (erroredTask) {
        processToast.error(
          `An error occurred: ${erroredTask.error.message}. Please try again`
        );
      }

      // Get the new value for the field, discarding the ones in the
      // isSelecting state. They get discarded because for them the link
      // property is undefined.
      const newContactsLink = taskResults.map((t) => t.link).filter(Boolean);
      setValues({
        ...values,
        contacts_link: newContactsLink
      });

      if (!erroredTask) {
        /* eslint-disable-next-line no-unused-vars */
        const { contacts_link: _, ...otherValues } = values;
        const result = await updateAtbd({
          ...otherValues,
          // When posting the atbd data the contacts_link has a different
          // structure.
          contacts: newContactsLink.map((link) => ({
            id: link.contact.id,
            roles: link.roles
          }))
        });

        if (result.error) {
          processToast.error(
            `An error occurred: ${result.error.message}. Please try again`
          );
        } else {
          resetForm({
            values: {
              ...values,
              contacts_link: result.data.contacts_link
            }
          });
          processToast.success('Changes saved');
        }
      }

      setSubmitting(false);
    },
    [contactsList, updateAtbd, createContact, updateContactUnbound]
  );
}
