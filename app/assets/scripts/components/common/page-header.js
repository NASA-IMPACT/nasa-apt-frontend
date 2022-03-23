import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Auth } from 'aws-amplify';
import {
  glsp,
  media,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';
import { Button } from '@devseed-ui/button';
import { VerticalDivider } from '@devseed-ui/toolbar';
import Dropdown, {
  DropTitle,
  DropMenu,
  DropMenuItem
} from '@devseed-ui/dropdown';

import config from '../../config';
import { Can } from '../../a11n';
import NasaLogo from './nasa-logo';
import { Link, NavLink } from '../../styles/clean/link';
import { useAuthToken, useUser } from '../../context/user';
import { useAtbds } from '../../context/atbds-list';

import UserImage from './user-image';

const { appTitle } = config;

const PageHeaderSelf = styled.header`
  position: sticky;
  top: 0;
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

const BetaBadge = styled.small`
  font-size: 0.75rem;
  line-height: 1rem;
  text-transform: uppercase;
  color: ${themeVal('color.link')};
  background: ${themeVal('color.surface')};
  padding: 0 ${glsp(0.25)};
  border-radius: ${themeVal('shape.rounded')};
  bottom: inherit;
  vertical-align: inherit;
  grid-row: 2;

  ${media.largeUp`
    margin: ${glsp(0, 0.5)};
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding: 0 ${glsp(0.5)};
  `}
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
  align-items: center;

  > * {
    grid-row: 1;
  }
`;

const UserProfileTrigger = styled(Button)`
  > span {
    display: inline-flex;
    align-items: center;
    gap: ${glsp(0.5)};
  }
`;

function PageHeader() {
  const { expireToken } = useAuthToken();
  const { isLogged, user } = useUser();
  const history = useHistory();
  const { invalidateAtbdListCtx, invalidateAtbdSingleCtx } = useAtbds();

  const onLogoutClick = useCallback(async () => {
    try {
      // await Auth.signOut();
      Auth.signOut({ global: true });
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log('error signing out: ', error);
    }
    invalidateAtbdListCtx();
    invalidateAtbdSingleCtx();
    expireToken();
    history.push('/');
  }, [history, expireToken, invalidateAtbdListCtx, invalidateAtbdSingleCtx]);

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
            <BetaBadge>Beta</BetaBadge>
          </PageTitleLink>
        </PageTitle>
      </PageHeadline>
      <PageNav role='navigation'>
        <GlobalMenu>
          {isLogged ? (
            <li>
              <Button
                forwardedAs={NavLink}
                exact
                to='/dashboard'
                variation='achromic-plain'
                title='Visit the welcome page'
              >
                Dashboard
              </Button>
            </li>
          ) : (
            <React.Fragment>
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
                  to='/documents'
                  variation='achromic-plain'
                  title='View the documents'
                >
                  Documents
                </Button>
              </li>
            </React.Fragment>
          )}
          <Can do='view' on='contacts'>
            <li>
              <Button
                forwardedAs={NavLink}
                to='/contacts'
                variation='achromic-plain'
                title='View the contact list'
              >
                Contacts
              </Button>
            </li>
          </Can>
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
          <li>
            <Button
              forwardedAs={NavLink}
              exact
              to='/help'
              variation='achromic-plain'
              title='Visit the help section'
            >
              Help
            </Button>
          </li>
        </GlobalMenu>
        <VerticalDivider variation='light' />
        <GlobalMenu>
          <li>
            <Button
              variation='achromic-plain'
              title='Leave feedback about the app'
              onClick={(e) => {
                e.preventDefault();
                window.feedback?.showForm();
              }}
            >
              Feedback
            </Button>
          </li>
          <li>
            {!isLogged ? (
              <Button
                forwardedAs={NavLink}
                exact
                to='/signin'
                variation='achromic-plain'
                title='Sign in to the app'
              >
                Sign in
              </Button>
            ) : (
              <Dropdown
                alignment='right'
                direction='down'
                triggerElement={(props) => (
                  <UserProfileTrigger
                    variation='achromic-plain'
                    title='Open dropdown'
                    useIcon={['chevron-down--small', 'after']}
                    {...props}
                  >
                    <UserImage
                      name={user.name}
                      email={user.attributes?.email}
                      size='small'
                    />{' '}
                    {user.name}
                  </UserProfileTrigger>
                )}
              >
                <DropTitle>Account</DropTitle>
                <DropMenu>
                  <li>
                    <DropMenuItem
                      as={Link}
                      to='/account'
                      title='View user profile'
                      data-dropdown='click.close'
                    >
                      Profile
                    </DropMenuItem>
                  </li>
                </DropMenu>
                <DropMenu>
                  <li>
                    <DropMenuItem
                      title='Sign out from account'
                      onClick={onLogoutClick}
                      data-dropdown='click.close'
                    >
                      Sign out
                    </DropMenuItem>
                  </li>
                </DropMenu>
              </Dropdown>
            )}
          </li>
        </GlobalMenu>
      </PageNav>
    </PageHeaderSelf>
  );
}

export default PageHeader;
