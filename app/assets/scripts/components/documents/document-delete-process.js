import { confirmDeleteDocumentVersion } from '../common/confirmation-prompt';
import toasts from '../common/toasts';

/**
 * Convenience method to delete an atbd version and show a toast notification.
 *
 * @param {object} opt
 * @param {object} opt.atbd The document to delete
 * @param {func} opt.deleteAtbdVersion The delete action
 * @param {object} opt.history The history for navigation
 */
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
      toasts.success('Document version successfully deleted');
      history.push('/dashboard');
    }
  }
}
