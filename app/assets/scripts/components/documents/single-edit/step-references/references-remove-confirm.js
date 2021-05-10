import React from 'react';
import { Button } from '@devseed-ui/button';

import { showConfirmationPrompt } from '../../../common/confirmation-prompt';

const removeControls = ({ confirm, cancel }) => (
  <React.Fragment>
    <Button
      variation='base-raised-light'
      title='Cancel reference removal'
      useIcon='xmark--small'
      onClick={cancel}
    >
      Cancel
    </Button>
    <Button
      variation='danger-raised-dark'
      title='Confirm reference removal'
      useIcon='trash-bin'
      onClick={confirm}
    >
      Remove
    </Button>
  </React.Fragment>
);

/**
 * Convenience method to show a remove confirmation prompt for references.
 *
 * @param {bool} isBulk Whether the removal process is for multiple references.
 * @param {number} useCount If bulk, how many references are selected, if not
 * bulk how many times a reference is in use.
 */
export const confirmRemoveReferences = async (isBulk, useCount) => {
  return showConfirmationPrompt({
    title: isBulk ? 'Remove selected references?' : 'Remove this contact?',
    content: (
      <React.Fragment>
        {isBulk ? (
          <p>
            This action will remove {useCount} reference{useCount > 1 && 's'}.
            Any references being used will be removed from the fields
            they&apos;re used on.
          </p>
        ) : (
          <p>
            This reference is currently being used {useCount} time
            {useCount > 1 && 's'}. It will also be removed from the fields
            it&apos;s used on.
          </p>
        )}
      </React.Fragment>
    ),
    renderControls: removeControls
  });
};
