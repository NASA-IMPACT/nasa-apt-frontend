import React from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { glsp } from '@devseed-ui/theme-provider';

import { showConfirmationPrompt } from '../../common/confirmation-prompt';

const ContentWrapper = styled.div`
  > *:not(:last-child) {
    margin-bottom: ${glsp()};
  }
`;

/**
 * Show a confirmation prompt to Draft a new major version of a document.
 *
 * @param {string} currentVersion Current ATBD version
 * @param {string} newVersion ATBD version after update
 * @param {string} latestVersion Latest ATBD version after
 */
export const remindMinorVersionUpdate = async (currentVersion) => {
  return showConfirmationPrompt({
    title: 'Are you done editing?',
    subtitle: `Current version is ${currentVersion}`,
    content: (
      <ContentWrapper>
        <p>
          You just edited a published document.
          <br />
          If you are done with your changes, consider updating the
          document&apos;s minor version.
        </p>
        <p>You&apos;ll always be able to updated the minor version later.</p>
      </ContentWrapper>
    ),
    /* eslint-disable-next-line react/display-name, react/prop-types */
    renderControls: ({ confirm, cancel }) => (
      <React.Fragment>
        <Button
          variation='base-raised-light'
          title='Continue editing the document'
          useIcon='xmark--small'
          onClick={cancel}
        >
          Continue editing
        </Button>
        <Button
          variation='primary-raised-dark'
          title='Open modal to update minor version'
          useIcon='tick--small'
          onClick={confirm}
        >
          Go to update
        </Button>
      </React.Fragment>
    )
  });
};
