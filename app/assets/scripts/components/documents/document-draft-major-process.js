import { atbdView } from '../../utils/url-creator';
import toasts, { createProcessToast } from '../common/toasts';
import { confirmDraftMajorVersion } from './document-publishing-modals';

// Convenience method to create a major version of an atbd and show a toast
// notification.
export async function documentDraftMajorConfirmAndToast({
  atbd,
  createAtbdVersion,
  history
}) {
  // We have to increment from the most recent major.
  const lastVersion = atbd.versions.last;

  // There can only be 1 major draft version.
  if (lastVersion.status === 'Draft') {
    toasts.error(
      `There is already a Major draft version. (${lastVersion.version})`
    );
    return;
  }

  const { result: confirmed } = await confirmDraftMajorVersion(
    atbd?.version,
    atbd ? `v${lastVersion.major + 1}.0` : '',
    lastVersion.version
  );

  if (confirmed) {
    const processToast = createProcessToast('Creating new Draft version');
    const result = await createAtbdVersion();
    if (result.error) {
      processToast.error(`An error occurred: ${result.error.message}`);
    } else {
      processToast.success(`New Major version created: ${result.data.version}`);
      history.push(atbdView(result.data, result.data.version));
    }
  }
}
