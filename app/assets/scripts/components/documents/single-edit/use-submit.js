import { useCallback } from 'react';
import { useHistory } from 'react-router';

import { documentEdit } from '../../../utils/url-creator';
import { createProcessToast } from '../../common/toasts';
import { isPublished } from '../status';
import { remindMinorVersionUpdate } from './document-minor-version-reminder';

export function useSubmitForMetaAndVersionData(updateAtbd, atbd, step) {
  const history = useHistory();

  return useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast('Saving changes');
      const result = await updateAtbd({
        ...values,
        // If the alias is submitted as empty string (""), the api fails with a
        // 404 error. When the document is published remove the alias from the
        // payload since it is not possible to edit. alias:
        alias: isPublished(atbd.status) ? undefined : values.alias || null
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

        if (isPublished(atbd.status)) {
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

/**
 * Submit hook to save an atbd version.
 *
 * @param {func} updateAtbd Action to update the ATBD
 * @param {object} atbd The document to save
 * @param {func} hook Hook to modify the values being saved. Allows for the
 * function's functionality to be extended.
 */
export function useSubmitForVersionData(updateAtbd, atbd, hook) {
  const history = useHistory();

  return useCallback(
    async (values, formBag) => {
      const processToast = createProcessToast('Saving changes');

      let result;
      try {
        const newValues =
          typeof hook === 'function' ? await hook(values, formBag) : values;
        result = await updateAtbd(newValues);
      } catch (error) {
        result = { error };
      }

      formBag.setSubmitting(false);
      if (result.error) {
        processToast.error(`An error occurred: ${result.error.message}`);
      } else {
        formBag.resetForm({ values });
        processToast.success('Changes saved');

        if (isPublished(atbd.status)) {
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
    [updateAtbd, history, atbd.version, atbd.status, hook]
  );
}

/**
 * Hook to create the submit callback for the collaborators modal. The owner of
 * the document is also considered a collaborator and this same submit callback
 * is used when transferring the ownership of the document. The message
 * displayed on the toast notification changed depending on whether the `owner`
 * key is present on the payload.
 *
 * @param {func} updateAtbd The action to update the document.
 * @param {func} hideModal  The state setter to close the collaborators modal.
 * This is only used for the collaborators and not the leading author since that
 * modal is hidden before showing the confirmation prompt.
 */
export function useSubmitForCollaborators(updateAtbd, hideModal) {
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
        !values.owner && hideModal();
        resetForm({ values });
        processToast.success(msgOut);
      }
    },
    [hideModal, updateAtbd]
  );
}

/**
 * Hook to create the submit callback for governance events. All the modals
 * using this hook will have some sort of payload to submit.
 *
 * @param {func} eventAction The action to fire the event.
 * @param {object} messages The messages to display on the toasts.
 * @param {object} messages.start The messages to display while processing.
 * @param {string} messages.success  The messages to display on success.
 * @param {string} messages.error  The messages to display on error.
 */
export function useSubmitForGovernance(eventAction, messages) {
  return useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast(messages.start);
      const result = await eventAction({ payload: values });
      setSubmitting(false);
      if (result.error) {
        processToast.error(
          `${messages.error || 'An error occurred'}: ${result.error.message}`
        );
        return false;
      } else {
        resetForm({ values });
        processToast.success(messages.success);
        return true;
      }
    },
    [eventAction, messages.start, messages.success, messages.error]
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
                  affiliations: link.affiliations,
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
            roles: link.roles,
            affiliations: link.affiliations
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
