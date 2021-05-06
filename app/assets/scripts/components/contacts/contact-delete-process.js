import { confirmDeleteContact } from '../common/confirmation-prompt';
import toasts from '../common/toasts';

// Convenience method to delete a contact and show a toast notification.
export async function contactDeleteConfirmAndToast({
  contact,
  deleteContact,
  history = null
}) {
  const name = `${contact.first_name} ${contact.last_name}`;
  const { result: confirmed } = await confirmDeleteContact(name);

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
