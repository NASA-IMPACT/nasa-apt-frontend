import React from 'react';
import styled, { css } from 'styled-components';
import T from 'prop-types';
import { glsp, truncated, visuallyHidden } from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';

import Pill from './pill';
import UserImage from './user-image';
import Tip from './tooltip';

const UserIdentityCmp = (props) => {
  const { name, email, role, badge, ...rest } = props;

  return (
    <div {...rest} title={name}>
      <UserImage name={name} email={email} />
      <strong>{name}</strong>
      {badge}
      {role && <Pill>{role}</Pill>}
    </div>
  );
};

UserIdentityCmp.propTypes = {
  role: T.string,
  name: T.string,
  email: T.string,
  badge: T.node
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

const IconPill = styled(Pill)`
  span {
    ${visuallyHidden()}
  }

  ${({ useIcon }) =>
    useIcon &&
    css`
      &::after {
        ${collecticon(useIcon)}
        z-index: 2;
      }
    `}
`;

export function ReviewBadge(props) {
  return (
    <Tip title='Review concluded' {...props}>
      <IconPill useIcon='hand-thumbs-up'>Review concluded</IconPill>
    </Tip>
  );
}

export function LeadBadge(props) {
  return (
    <Tip title='Lead author' {...props}>
      <IconPill useIcon='flag-pole'>Lead author</IconPill>
    </Tip>
  );
}
