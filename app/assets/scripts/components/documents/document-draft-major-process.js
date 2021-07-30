import { documentView } from '../../utils/url-creator';
import toasts, { createProcessToast } from '../common/toasts';
import { confirmDraftMajorVersion } from './document-publishing-modals';
import { isPublished } from './status';

// Convenience method to create a major version of an atbd and show a toast
// notification.
export async function documentDraftMajorConfirmAndToast({
  atbd,
  createAtbdVersion,
  history
}) {
  // We have to increment from the most recent major.
  const lastVersion = atbd.versions.last;

  // Creating a new draft is not allowed if the last version is not published.
  if (!isPublished(lastVersion)) {
    toasts.error(
      `There is already a Major version that is not published. (${lastVersion.version})`
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
      history.push(documentView(result.data, result.data.version));
    }
  }
}
