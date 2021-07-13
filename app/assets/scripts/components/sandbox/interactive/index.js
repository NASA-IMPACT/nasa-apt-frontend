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
import { ContentBlock } from '../../../styles/content-block';
import Prose from '../../../styles/typography/prose';

import toasts from '../../common/toasts';
import { showConfirmationPrompt } from '../../common/confirmation-prompt';
import { TabContent, TabItem, TabsManager, TabsNav } from '../../common/tabs';

function SandboxInteractive() {
  return (
    <App pageTitle='Sandbox/Interactive'>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Interactive</InpageTitle>
          </InpageHeadline>
        </InpageHeader>
        <InpageBody>
          <ContentBlock>
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

              <h2>Tabs</h2>
              <TabsManager>
                <TabsNav>
                  <TabItem label='Tab 1' tabId='t1'>
                    Tab 1
                  </TabItem>
                  <TabItem label='Tab 2' tabId='t2'>
                    Tab 2
                  </TabItem>
                </TabsNav>

                <TabContent tabId='t1'>Tab 1 content</TabContent>
                <TabContent tabId='t2'>Tab 2 content</TabContent>
              </TabsManager>
            </Prose>
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default SandboxInteractive;
