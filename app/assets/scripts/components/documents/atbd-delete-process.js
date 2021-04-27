import {
  confirmDeleteAtbdVersion,
  confirmDeleteAtbd
} from '../common/confirmation-prompt';
import toasts from '../common/toasts';

// Convenience method to delete an atbd and show a toast notification.
export async function atbdDeleteFullConfirmAndToast({ atbd, deleteFullAtbd }) {
  const { result: confirmed } = await confirmDeleteAtbd(atbd.title);
  if (confirmed) {
    const result = await deleteFullAtbd({ id: atbd.id });
    if (result.error) {
      toasts.error(`An error occurred: ${result.error.message}`);
    } else {
      toasts.success('ATBD successfully deleted');
    }
  }
}

// Convenience method to delete an atbd version and show a toast notification.
export async function atbdDeleteVersionConfirmAndToast({
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
      toasts.success('ATBD version successfully deleted');
      history.push('/documents');
    }
  }
}
