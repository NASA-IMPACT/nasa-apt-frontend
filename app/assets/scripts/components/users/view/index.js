import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

import App from '../../common/app';
import {
  Inpage,
  InpageBody,
  InpageHeaderSticky,
  InpageActions
} from '../../../styles/inpage';
import { ContentBlock } from '../../../styles/content-block';
import DetailsList from '../../../styles/typography/details-list';
import Prose from '../../../styles/typography/prose';
import UserActionsMenu from '../user-actions-menu';
import UserNavHeader from '../user-nav-header';
import UserImage from '../../common/user-image';

import { useUser } from '../../../context/user';

const UserContent = styled.div`
  grid-column: content-start / content-end;
`;

const UserHeader = styled.header`
  position: relative;
  display: grid;
  grid-template-columns: max-content auto;
  align-items: center;
  grid-gap: 2rem;
  padding-bottom: ${glsp(1.5)};

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: ${themeVal('color.baseAlphaC')};
    content: '';
    pointer-events: none;
  }
`;

const UserName = styled(Heading)`
  margin: 0;
`;

export default function UserView() {
  const { user } = useUser();

  return (
    <App pageTitle='Profile'>
      <Inpage>
        <InpageHeaderSticky data-element='inpage-header'>
          <UserNavHeader name={user.name} mode='view' />
          <InpageActions>
            <UserActionsMenu variation='achromic-plain' />
          </InpageActions>
        </InpageHeaderSticky>
        <InpageBody>
          <ContentBlock>
            <UserContent>
              <Prose>
                <UserHeader>
                  <UserImage size='profile' user={user} />
                  <UserName>{user.name}</UserName>
                </UserHeader>
                <DetailsList>
                  <dt>Name</dt>
                  <dd>{user.name}</dd>
                  <dt>Email</dt>
                  <dd>{user.attributes.email}</dd>
                </DetailsList>
              </Prose>
            </UserContent>
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}
