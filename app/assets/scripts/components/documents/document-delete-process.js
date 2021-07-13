import {
  confirmDeleteDocumentVersion,
  confirmDeleteDocument
} from '../common/confirmation-prompt';
import toasts from '../common/toasts';

// Convenience method to delete an atbd and show a toast notification.
export async function documentDeleteFullConfirmAndToast({
  atbd,
  deleteFullAtbd
}) {
  const { result: confirmed } = await confirmDeleteDocument(atbd.title);
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
export async function documentDeleteVersionConfirmAndToast({
  atbd,
  deleteAtbdVersion,
  history
}) {
  const { result: confirmed } = await confirmDeleteDocumentVersion(
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
