import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, rgba, themeVal } from '@devseed-ui/theme-provider';

import UserIdentity, { LeadBadge, ReviewBadge } from './user-identity';
import {
  LoadingSkeleton,
  LoadingSkeletonGroup,
  LoadingSkeletonLine
} from './loading-skeleton';
import { FormikInputCheckable } from './forms/input-checkable';

export const CollaboratorsList = styled.ul`
  display: grid;
`;

const CollaboratorOption = styled(FormikInputCheckable)`
  display: flex;
  align-items: center;
  background-color: ${rgba(themeVal('color.link'), 0)};
  transition: all 0.24s ease-in-out 0s;
  padding: ${glsp(0.5, 2)};

  &:hover {
    opacity: 1;
    background-color: ${rgba(themeVal('color.link'), 0.08)};
  }

  > *:last-child {
    margin-left: auto;
  }
`;

export function CollaboratorUserIdentity(props) {
  const { isLead, isReviewComplete, name, email } = props;
  return (
    <UserIdentity
      forwardedAs='span'
      name={name}
      email={email}
      badge={isLead ? <LeadBadge /> : isReviewComplete ? <ReviewBadge /> : null}
    />
  );
}

CollaboratorUserIdentity.propTypes = {
  isLead: T.bool,
  isReviewComplete: T.bool,
  name: T.string,
  email: T.string
};

export function UserSelectableList(props) {
  const { users = [], reviewersConcluded = [], fieldName, selectOne } = props;

  if (!users.length) {
    return <p>There are no collaborators available to select.</p>;
  }

  return (
    <CollaboratorsList>
      {users.map((u) => (
        <li key={u.sub}>
          <CollaboratorOption
            textPlacement='left'
            type={selectOne ? 'radio' : 'checkbox'}
            name={fieldName}
            value={u.sub}
          >
            <CollaboratorUserIdentity
              name={u.preferred_username}
              email={u.email}
              isReviewComplete={
                fieldName === 'reviewers' && reviewersConcluded.includes(u.sub)
              }
            />
          </CollaboratorOption>
        </li>
      ))}
    </CollaboratorsList>
  );
}

UserSelectableList.propTypes = {
  fieldName: T.string,
  users: T.array,
  reviewersConcluded: T.array,
  selectOne: T.bool
};

export function UserSelectableListLoadingSkeleton() {
  return (
    <LoadingSkeletonGroup>
      {[...Array(6).keys()].map((n) => (
        <LoadingSkeletonLine key={n}>
          <LoadingSkeleton size='large' width={1 / 12} />
          <LoadingSkeleton size='large' width={8 / 12} />
        </LoadingSkeletonLine>
      ))}
    </LoadingSkeletonGroup>
  );
}
