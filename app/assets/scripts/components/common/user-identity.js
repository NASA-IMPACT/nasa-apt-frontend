import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { glsp, truncated } from '@devseed-ui/theme-provider';

import Pill from './pill';
import UserImage from './user-image';

const UserIdentityCmp = (props) => {
  const { name, email, role, ...rest } = props;

  return (
    <div {...rest} title={name}>
      <UserImage name={name} email={email} />
      <strong>{name}</strong>
      {role && <Pill>{role}</Pill>}
    </div>
  );
};

UserIdentityCmp.propTypes = {
  role: T.string,
  name: T.string,
  email: T.string
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
