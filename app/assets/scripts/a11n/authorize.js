import React, { useEffect } from 'react';
import qs from 'qs';

import App from '../components/common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../styles/inpage';
import Constrainer from '../styles/constrainer';
import Prose from '../styles/typography/prose';

import { Redirect, useLocation } from 'react-router';
import { useAuthToken } from '../context/user';

function Authorize() {
  const { search } = useLocation();
  const { token: qsToken } = qs.parse(search, { ignoreQueryPrefix: true });

  const { token, setToken } = useAuthToken();

  useEffect(() => {
    if (token || !qsToken) return;
    setToken(qsToken);
    // Ignoring dependencies because we'll only ever check this on mount. After
    // that a redirect will happen.
  }, []);

  // A token is already set. Redirect to home
  if (token) return <Redirect to='/' />;

  // Token missing
  if (!qsToken) return <Redirect to='/signin' />;

  return (
    <App pageTitle='About'>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>About</InpageTitle>
          </InpageHeadline>
        </InpageHeader>
        <InpageBody>
          <Constrainer>
            <Prose>
              <p>You&apos;re being authenticated. Please wait</p>;
            </Prose>
          </Constrainer>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Authorize;
