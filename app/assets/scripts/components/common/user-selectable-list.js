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

import UserIdentity from './user-identity';
import {
  LoadingSkeleton,
  LoadingSkeletonGroup,
  LoadingSkeletonLine
} from './loading-skeleton';

export const CollaboratorsList = styled.ul`
  display: grid;
`;

export const CollaboratorOption = styled.label`
  display: block;
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

  input ~ ${UserIdentity} {
    grid-template-columns: min-content min-content 1fr;

    &::after {
      ${collecticon('tick')}
      justify-self: flex-end;
      opacity: 0;
      transition: all 0.24s ease 0s;
    }
  }

  input:checked ~ ${UserIdentity} {
    color: ${themeVal('color.link')};

    &::after {
      opacity: 1;
    }
  }
`;

export function UserSelectableList(props) {
  const { users = [], fieldName, selectOne } = props;

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
            <UserIdentity name={u.preferred_username} email={u.email} />
          </CollaboratorOption>
        </li>
      ))}
    </CollaboratorsList>
  );
}

UserSelectableList.propTypes = {
  fieldName: T.string,
  users: T.array,
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
