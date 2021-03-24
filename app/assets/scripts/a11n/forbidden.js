import React from 'react';

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
import { Link } from '../styles/clean/link';

import { useUser } from '../context/user';

function Forbidden() {
  const user = useUser();

  return (
    <App pageTitle='Forbidden'>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Forbidden</InpageTitle>
          </InpageHeadline>
        </InpageHeader>
        <InpageBody>
          <Constrainer>
            <Prose>
              <p>You don&apos;t have access to this page!</p>
              {user.isLogged ? (
                <p>
                  If you think this is a mistake let us know via{' '}
                  <a href='mailto:' title='Send us an email'>
                    email
                  </a>
                  .
                </p>
              ) : (
                <p>
                  Please{' '}
                  <Link to='/signin' title='Go to the sign in page'>
                    sign in
                  </Link>{' '}
                  and try again
                </p>
              )}
              <p>
                <Link to='/' title='Visit the homepage'>
                  Visit the homepage
                </Link>
              </p>
            </Prose>
          </Constrainer>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Forbidden;
