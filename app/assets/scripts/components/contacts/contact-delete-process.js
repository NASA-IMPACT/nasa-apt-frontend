import { confirmDeleteContact } from '../common/confirmation-prompt';
import toasts from '../common/toasts';
import { getContactName } from './contact-utils';

// Convenience method to delete a contact and show a toast notification.
export async function contactDeleteConfirmAndToast({
  contact,
  deleteContact,
  history = null
}) {
  const name = getContactName(contact);
  const { result: confirmed } = await confirmDeleteContact(
    name,
    contact.atbd_versions_link.length
  );

  if (confirmed) {
    const result = await deleteContact({ id: contact.id });
    if (result.error) {
      toasts.error(`An error occurred: ${result.error.message}`);
    } else {
      toasts.success('Contact successfully deleted');
      history?.push('/contacts');
    }
  }
}
