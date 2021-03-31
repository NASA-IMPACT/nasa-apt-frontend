import React from 'react';
import { Button } from '@devseed-ui/button';

import App from '../components/common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../styles/inpage';
import { ContentBlock } from '../styles/content-block';
import Prose from '../styles/typography/prose';

import config from '../config';
import { getAppURL } from '../utils/history';

function SignIn() {
  // Remove trailing url if exists.
  const loc = getAppURL().cleanHref;

  return (
    <App pageTitle='Sign in'>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Sign in</InpageTitle>
          </InpageHeadline>
        </InpageHeader>
        <InpageBody>
          <ContentBlock>
            <Prose>
              <p>Login must be completed through Launchpad.</p>
              <p>You&apos;ll be redirected to login.</p>

              <Button
                forwardedAs='a'
                href={`${config.apiUrl}/saml/sso?return_to=${loc}/authorize`}
                size='large'
                variation='primary-raised-dark'
                title='Sign in to your account'
              >
                Sign in
              </Button>
            </Prose>
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default SignIn;
