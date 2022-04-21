/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import isHotkey from 'is-hotkey';
import { Auth } from 'aws-amplify';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';

import {
  Panel,
  PanelHeader,
  PanelHeadline,
  PanelTitleAlt,
  PanelBody,
  PanelSectionTitle
} from '../../styles/panel';
import UserIdentity from '../common/user-identity';

import { createProcessToast } from '../common/toasts';
import { useUser } from '../../context/user';
import { useAtbds } from '../../context/atbds-list';

const DevtoolsSelf = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 9000;
  display: grid;
  grid-gap: ${glsp()};

  .apt-devtools-enter {
    transform: translate(-100%, 0);
  }
  .apt-devtools-enter-active {
    transform: translate(0, 0);
    transition: transform 320ms ease-in-out;
  }
  .apt-devtools-exit {
    transform: translate(0, 0);
  }
  .apt-devtools-exit-active {
    transform: translate(-100%, 0);
    transition: transform 320ms ease-in-out;
  }

  ${Panel} {
    background: ${themeVal('color.surface')};
    width: 25rem;
    overflow: hidden;
  }

  ${PanelBody} {
    overflow: hidden;
  }

  ${PanelSectionTitle} {
    margin-bottom: ${glsp()};
  }
`;

const PanelContent = styled.div`
  padding: ${glsp()};
  display: grid;
  grid-gap: ${glsp()};
  overflow-y: auto;
  flex: 1;

  > *:last-child {
    padding-bottom: ${glsp()};
  }
`;

function AptDevtools() {
  const [isPanelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const listener = (e) =>
      isHotkey('mod+shift+1', e) && setPanelOpen((v) => !v);
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);

  return (
    <DevtoolsSelf>
      <CSSTransition
        in={isPanelOpen}
        timeout={320}
        classNames='apt-devtools'
        appear
        unmountOnExit
      >
        <Panel as='div'>
          <PanelHeader>
            <PanelHeadline>
              <PanelTitleAlt>Devtools</PanelTitleAlt>
            </PanelHeadline>
          </PanelHeader>
          <PanelBody>
            <PanelContent>
              <DevUsersList setPanelOpen={setPanelOpen} />
            </PanelContent>
          </PanelBody>
        </Panel>
      </CSSTransition>
    </DevtoolsSelf>
  );
}

export default AptDevtools;

const devUserPwd = 'Password123!';
const devUsers = [
  {
    name: 'Carlos Curator',
    username: 'curator@apt.com',
    role: 'Curator',
    description: 'Curator user with access to all documents'
  },
  {
    name: 'Owner Olivia',
    username: 'owner@apt.com',
    role: 'Contributor',
    description: 'User who owns atbd "Test ATBD 1"'
  },
  {
    name: 'Andre Author',
    username: 'author1@apt.com',
    role: 'Contributor',
    description: 'Co-author on atbd "Test ATBD 1"'
  },
  {
    name: 'Anita Author',
    username: 'author2@apt.com',
    role: 'Contributor',
    description: 'Co-author on atbd "Test ATBD 1"'
  },
  {
    name: 'Allison Author',
    username: 'author3@apt.com',
    role: 'Contributor',
    description: 'Regular user with no ties to any document'
  },
  {
    name: 'Ricardo Reviewer',
    username: 'reviewer1@apt.com',
    role: 'Contributor',
    description: 'Reviewer on atbd "Test ATBD 1"'
  },
  {
    name: 'Ronald Reviewer',
    username: 'reviewer2@apt.com',
    role: 'Contributor',
    description: 'Reviewer on atbd "Test ATBD 1"'
  },
  {
    name: 'Rita Reviewer',
    username: 'reviewer3@apt.com',
    role: 'Contributor',
    description: 'Regular user with no ties to any document'
  }
];

const DevUsersEntryCmp = (props) => {
  const { entry, onImpersonate, ...rest } = props;
  return (
    <a
      href='#'
      {...rest}
      onClick={(e) => {
        e.preventDefault();
        onImpersonate();
      }}
    >
      <UserIdentity name={entry.name} role={entry.role} />
      {entry.description && <p>{entry.description}</p>}
    </a>
  );
};

const DevUsersEntry = styled(DevUsersEntryCmp)`
  display: grid;
  grid-gap: ${glsp(0.5)};
  padding: ${glsp()};
  box-shadow: ${themeVal('boxShadow.elevationA')};
  font-size: 0.875rem;

  ${Button} {
    justify-self: end;
  }

  &,
  &:visited {
    color: inherit;
  }
`;

const DevUsersListCmp = (props) => {
  const { setPanelOpen, ...rest } = props;
  const { loginCognitoUser } = useUser();
  const { invalidateAtbdListCtx, invalidateAtbdSingleCtx } = useAtbds();

  const loginUser = useCallback(
    async (u) => {
      const processToast = createProcessToast('Signing in. Please wait.');
      try {
        const user = await Auth.signIn(u.username, devUserPwd);
        invalidateAtbdListCtx();
        invalidateAtbdSingleCtx();
        loginCognitoUser(user);
        processToast.success(
          `Welcome back ${user.attributes.preferred_username}!`
        );
        setPanelOpen(false);
      } catch (error) {
        processToast.error(error.message);
      }
    },
    [
      setPanelOpen,
      loginCognitoUser,
      invalidateAtbdListCtx,
      invalidateAtbdSingleCtx
    ]
  );

  return (
    <div {...rest}>
      <PanelSectionTitle>Users</PanelSectionTitle>
      <ul>
        {devUsers.map((u) => (
          <li key={u.username}>
            <DevUsersEntry entry={u} onImpersonate={() => loginUser(u)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const DevUsersList = styled(DevUsersListCmp)`
  > ul {
    display: grid;
    grid-gap: ${glsp()};
  }
`;
