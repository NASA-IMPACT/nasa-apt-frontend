import React from 'react';
import { Button } from '@devseed-ui/button';

import App from '../../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../../styles/inpage';
import Constrainer from '../../../styles/constrainer';
import Prose from '../../../styles/typography/prose';

import toasts from '../../common/toasts';
import { showConfirmationPrompt } from '../../common/confirmation-prompt';

function SandboxInteractive() {
  return (
    <App pageTitle='Sandbox/Structure'>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Interactive</InpageTitle>
          </InpageHeadline>
        </InpageHeader>
        <InpageBody>
          <Constrainer>
            <Prose>
              <Button
                variation='base-raised-light'
                onClick={() => {
                  toasts.success('This is an success toast');
                  toasts.error('This is an error toast which sticks', {
                    autoClose: false
                  });
                  toasts.info(
                    "Here's some info for you. This toast will not auto close",
                    { autoClose: false, closeOnClick: false }
                  );
                  toasts.warn('This is an warning toast');
                }}
              >
                Toasts!
              </Button>
              <h2>Modals</h2>
              <Button
                variation='base-raised-light'
                onClick={async () => {
                  const result = await showConfirmationPrompt();
                  /* eslint-disable-next-line no-console */
                  console.log('result', result);
                }}
              >
                Confirmation prompt
              </Button>
            </Prose>
          </Constrainer>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default SandboxInteractive;
