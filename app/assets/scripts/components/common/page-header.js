import React, { useCallback } from 'react';
import styled from 'styled-components';
import {
  glsp,
  media,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';
import { Button } from '@devseed-ui/button';
import { VerticalDivider } from '@devseed-ui/toolbar';

import config from '../../config';
import NasaLogo from './nasa-logo';
import { Link, NavLink } from '../../styles/clean/link';
import { useAuthToken, useUser } from '../../context/user';
import { useHistory } from 'react-router';

const { appTitle } = config;

const PageHeaderSelf = styled.header`
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};
  align-items: center;
  background-color: ${themeVal('color.primary')};
  color: #fff;
  animation: ${reveal} 0.32s ease 0s 1;
  padding: ${glsp(0.75, themeVal('layout.gap.xsmall'))};
  box-shadow: ${themeVal('boxShadow.elevationD')};

  ${media.mediumUp`
    grid-gap: ${glsp(themeVal('layout.gap.medium'))};
    padding: ${glsp(1, themeVal('layout.gap.medium'))};
  `}
`;

const PageHeadline = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const PageTitle = styled.h1`
  margin: 0;
`;

const PageTitleLink = styled(Link)`
  display: grid;
  align-items: center;
  grid-gap: ${glsp(0, 0.5)};
  font-size: 1.5rem;
  line-height: 1;

  &,
  &:visited {
    color: inherit;
  }

  #nasa-logo-neg-mono {
    opacity: 1;
    transition: all 0.32s ease 0s;
  }

  #nasa-logo-pos {
    transform: translate(0, -100%);
    opacity: 0;
    transition: all 0.32s ease 0s;
  }

  &:hover {
    opacity: 1;

    #nasa-logo-neg-mono {
      opacity: 0;
    }

    #nasa-logo-pos {
      opacity: 1;
    }
  }

  svg {
    grid-row: 1 / span 2;
    width: auto;
    height: 2.5rem;
    transform: scale(1.125);
  }

  sup {
    grid-row: 1;
    display: block;
    top: inherit;
    font-size: 0.875rem;
    line-height: 1rem;
    font-weight: ${themeVal('type.base.extrabold')};
    text-transform: uppercase;
  }

  span {
    ${visuallyHidden}
  }

  strong {
    grid-row: 2;
    display: block;
    font-size: 1.25rem;
    line-height: 1.5rem;
    font-weight: ${themeVal('type.base.light')};
    letter-spacing: -0.025em;
  }
`;

const PageNav = styled.nav`
  display: inline-grid;
  grid-gap: ${glsp(0.5)};
  align-items: center;
  margin-left: auto;

  > * {
    grid-row: 1;
  }
`;

const GlobalMenu = styled.ul`
  display: inline-grid;
  grid-gap: ${glsp(0.5)};

  > * {
    grid-row: 1;
  }
`;

function PageHeader() {
  const { expireToken } = useAuthToken();
  const user = useUser();
  const history = useHistory();

  const onLogoutClick = useCallback(() => {
    expireToken();
    history.push('/');
  }, [history, expireToken]);

  return (
    <PageHeaderSelf role='banner'>
      <PageHeadline>
        <PageTitle>
          <PageTitleLink to='/' title='Visit the welcome page'>
            <NasaLogo />
            <sup>
              <span>NASA</span> Earthdata<span>: </span>
            </sup>
            <strong>{appTitle}</strong>
          </PageTitleLink>
        </PageTitle>
      </PageHeadline>
      <PageNav role='navigation'>
        <GlobalMenu>
          <li>
            <Button
              forwardedAs={NavLink}
              exact
              to='/'
              variation='achromic-plain'
              title='Visit the welcome page'
            >
              Welcome
            </Button>
          </li>
          <li>
            <Button
              forwardedAs={NavLink}
              exact
              to='/documents'
              variation='achromic-plain'
              title='View the documents'
            >
              Documents
            </Button>
          </li>
          <li>
            <Button
              forwardedAs={NavLink}
              exact
              to='/about'
              variation='achromic-plain'
              title='Learn more about the app'
            >
              About
            </Button>
          </li>
        </GlobalMenu>
        <VerticalDivider variation='light' />
        <GlobalMenu>
          <li>
            <Button
              variation='achromic-plain'
              title='Leave feedback about the app'
            >
              Feedback
            </Button>
          </li>
          <li>
            {user.isLogged ? (
              <Button
                variation='achromic-plain'
                title='Sign out of the app'
                onClick={onLogoutClick}
              >
                Sign out
              </Button>
            ) : (
              <Button
                forwardedAs={NavLink}
                exact
                to='/signin'
                variation='achromic-plain'
                title='Sign in to the app'
              >
                Sign in
              </Button>
            )}
          </li>
        </GlobalMenu>
      </PageNav>
    </PageHeaderSelf>
  );
}

export default PageHeader;
