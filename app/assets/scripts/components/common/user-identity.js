import React from 'react';
import styled, { css } from 'styled-components';
import T from 'prop-types';
import { glsp, truncated, visuallyHidden } from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';

import Pill from './pill';
import UserImage from './user-image';
import Tip from './tooltip';

const Div = styled.div`
  /* styled-component */
`;

const UserIdentityCmp = (props) => {
  const { name, email, role, badge, size, ...rest } = props;

  return (
    <Div {...rest} title={name}>
      <UserImage name={name} email={email} size={size} />
      <strong>{name}</strong>
      {badge}
      {role && <Pill>{role}</Pill>}
    </Div>
  );
};

UserIdentityCmp.propTypes = {
  role: T.string,
  size: T.string,
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

const badgeProps = {
  tag: 'span',
  position: 'top'
};

export function ReviewBadge(props) {
  return (
    <Tip title='Review concluded' {...badgeProps} {...props}>
      <IconPill useIcon='hand-thumbs-up'>Review concluded</IconPill>
    </Tip>
  );
}

export function LeadBadge(props) {
  return (
    <Tip title='Lead author' {...badgeProps} {...props}>
      <IconPill useIcon='flag-pole'>Lead author</IconPill>
    </Tip>
  );
}
