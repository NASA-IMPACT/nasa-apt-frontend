import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { glsp, truncated } from '@devseed-ui/theme-provider';

import Pill from './pill';
import UserImage from './user-image';

const UserIdentityCmp = (props) => {
  const { user, role, ...rest } = props;

  return (
    <div {...rest} title={user.name}>
      <UserImage user={user} />
      <strong>{user.name}</strong>
      {role && <Pill>{role}</Pill>}
    </div>
  );
};

UserIdentityCmp.propTypes = {
  user: T.object,
  role: T.string
};

const UserIdentity = styled(UserIdentityCmp)`
  display: grid;
  grid-template-columns: min-content;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-gap: ${glsp(0.5)};
  align-items: center;

  > strong {
    ${truncated()}
  }
`;

export default UserIdentity;
