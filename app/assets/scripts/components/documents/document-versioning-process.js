import React from 'react';

import {
  showConfirmationPrompt,
  ConfirmationModalProse,
  createBinaryControlsRenderer
} from '../common/confirmation-prompt';
import { documentView } from '../../utils/url-creator';
import toasts, { createProcessToast } from '../common/toasts';
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

  const newVersion = atbd ? `v${lastVersion.major + 1}.0` : '';

  const { result: confirmed } = await showConfirmationPrompt({
    title: 'Draft a new major version',
    subtitle: `Current version is ${atbd.version}`,
    content: (
      <ConfirmationModalProse>
        <p>
          This action will create a new draft major version ({newVersion}), from
          the latest existing version ({lastVersion.version})
        </p>
        <p>
          All document content will be copied to the new draft, with the
          exception of the DOI information.
        </p>
        <p>You will become the Lead author of the new version.</p>
      </ConfirmationModalProse>
    ),
    renderControls: createBinaryControlsRenderer({
      confirmVariation: 'primary-raised-dark',
      confirmIcon: 'tick--small',
      confirmTitle: 'Draft new major version',
      confirmLabel: 'Draft new version',
      cancelVariation: 'base-raised-light',
      cancelTitle: 'Cancel update',
      cancelIcon: 'xmark--small'
    })
  });

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

// Convenience method to update minor version of an atbd and show a toast
// notification.
export async function documentUpdateMinorConfirmAndToast({
  atbd,
  eventFn,
  history
}) {
  // Updating the minor version is only allowed if the version is published.
  if (!isPublished(atbd)) {
    toasts.error(
      'It is only possible to update the minor version of a published document.'
    );
    return;
  }

  const { version, major, minor } = atbd;

  const { result: confirmed } = await showConfirmationPrompt({
    title: 'Update minor version',
    subtitle: `Current version is ${version}`,
    content: (
      <ConfirmationModalProse>
        <p>
          This action will update the document to version v{major}.{minor + 1}.
        </p>
      </ConfirmationModalProse>
    ),
    renderControls: createBinaryControlsRenderer({
      confirmVariation: 'primary-raised-dark',
      confirmIcon: 'tick--small',
      confirmTitle: 'Update minor version',
      confirmLabel: 'Update version',
      cancelVariation: 'base-raised-light',
      cancelTitle: 'Cancel update',
      cancelIcon: 'xmark--small'
    })
  });

  if (confirmed) {
    const processToast = createProcessToast('Updating minor version');
    const result = await eventFn({
      payload: {
        id: atbd.id,
        minor: minor + 1
      }
    });
    if (result.error) {
      processToast.error(`An error occurred: ${result.error.message}`);
    } else {
      processToast.success(`Minor version updated to: ${result.data.version}`);
      history.replace(documentView(result.data, result.data.version));
    }
  }
}
