import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Field } from 'formik';
import {
  glsp,
  rgba,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';

import UserIdentity, { LeadBadge, ReviewBadge } from './user-identity';
import {
  LoadingSkeleton,
  LoadingSkeletonGroup,
  LoadingSkeletonLine
} from './loading-skeleton';

export const CollaboratorsList = styled.ul`
  display: grid;
`;

const CollaboratorCheckableControl = styled.span`
  position: relative;
  margin-left: auto;

  &::after {
    ${collecticon('tick')}
    opacity: 0;
    transition: all 0.24s ease 0s;
  }
`;

export const CollaboratorOption = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${rgba(themeVal('color.link'), 0)};
  transition: all 0.24s ease-in-out 0s;
  padding: ${glsp(0.5, 2)};

  &:hover {
    opacity: 1;
    background-color: ${rgba(themeVal('color.link'), 0.08)};
  }

  input {
    ${visuallyHidden()}
  }

  input:checked ~ ${CollaboratorCheckableControl} {
    &::after {
      opacity: 1;
    }
  }
`;

export function CollaboratorUserIdentity(props) {
  const { isLead, isReviewComplete, name, email } = props;
  return (
    <UserIdentity
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
          <CollaboratorOption>
            <Field
              type={selectOne ? 'radio' : 'checkbox'}
              name={fieldName}
              value={u.sub}
            />
            <CollaboratorUserIdentity
              name={u.preferred_username}
              email={u.email}
              isReviewComplete={
                fieldName === 'reviewers' && reviewersConcluded.includes(u.sub)
              }
            />
            <CollaboratorCheckableControl />
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
