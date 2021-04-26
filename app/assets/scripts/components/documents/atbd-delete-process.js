import { confirmDeleteAtbdVersion } from '../common/confirmation-prompt';
import toasts from '../common/toasts';

// Convenience method to delete an atbd and show a toast notification.
export async function atbdDeleteConfirmAndToast({
  atbd,
  deleteAtbdVersion,
  history
}) {
  const { result: confirmed } = await confirmDeleteAtbdVersion(
    atbd?.title,
    atbd?.version
  );

  if (confirmed) {
    const result = await deleteAtbdVersion();
    if (result.error) {
      toasts.error(`An error occurred: ${result.error.message}`);
    } else {
      toasts.success('ATBD successfully deleted');
      history.push('/documents');
    }
  }
}
