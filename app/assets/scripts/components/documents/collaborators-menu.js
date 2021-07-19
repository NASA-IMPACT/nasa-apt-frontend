import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import Dropdown, { DropTitle } from '@devseed-ui/dropdown';
import { Button } from '@devseed-ui/button';

import UserIdentity from '../common/user-identity';

import { DropHeader, DropHeadline, DropActions } from '../../styles/drop';
import { useContextualAbility } from '../../a11n';

// Drop content elements.

const DropdownCollaborators = styled(Dropdown)`
  max-width: 20rem;
`;

const CollaboratorsList = styled.dl`
  display: grid;
  grid-gap: ${glsp()};

  dt {
    font-weight: ${themeVal('type.base.bold')};
  }

  ul {
    display: grid;
    grid-gap: ${glsp(0.5)};
  }
`;

const CollaboratorsListTerm = styled.dt`
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const CollaboratorEntry = (props) => {
  const { isLead, name, email } = props;
  return <UserIdentity name={name} email={email} role={isLead && 'Lead'} />;
};

CollaboratorEntry.propTypes = {
  isLead: T.bool,
  name: T.string,
  email: T.string
};

const CollaboratorsMenuContent = (props) => {
  const { onOptionsClick, showOptions, owner, authors, reviewers } = props;

  return (
    <React.Fragment>
      <DropHeader>
        <DropHeadline>
          <DropTitle size='xsmall'>Collaborators</DropTitle>
        </DropHeadline>
        {showOptions && (
          <DropActions>
            <Button
              variation='base-plain'
              title='Manage collaborators'
              useIcon='pencil'
              size='small'
              hideText
              onClick={onOptionsClick}
              data-dropdown='click.close'
            >
              Manage
            </Button>
          </DropActions>
        )}
      </DropHeader>
      <CollaboratorsList>
        <CollaboratorsListTerm>Authors</CollaboratorsListTerm>
        <dd>
          <ul>
            <li>
              <CollaboratorEntry
                name={owner.preferred_username}
                email={owner.email}
                isLead
              />
            </li>
            {authors.map((author) => (
              <li key={author.sub || author.preferred_username}>
                <CollaboratorEntry
                  name={author.preferred_username}
                  email={author.email}
                />
              </li>
            ))}
          </ul>
        </dd>
        {!!reviewers.length && (
          <React.Fragment>
            <CollaboratorsListTerm>Reviewers</CollaboratorsListTerm>
            <dd>
              <ul>
                {reviewers.map((reviewer) => (
                  <li key={reviewer.sub || reviewer.preferred_username}>
                    <CollaboratorEntry
                      name={reviewer.preferred_username}
                      email={reviewer.email}
                    />
                  </li>
                ))}
              </ul>
            </dd>
          </React.Fragment>
        )}
      </CollaboratorsList>
    </React.Fragment>
  );
};

CollaboratorsMenuContent.propTypes = {
  showOptions: T.bool,
  onOptionsClick: T.func,
  owner: T.object,
  authors: T.array,
  reviewers: T.array
};

export function CollaboratorsMenu(props) {
  const { triggerProps = {}, atbdVersion, onOptionsClick } = props;
  const { owner, authors = [], reviewers = [] } = atbdVersion;
  const ability = useContextualAbility();

  const collaboratorCount = authors.length + reviewers.length;

  const showManageAction =
    ability.can('manage-authors', atbdVersion) ||
    ability.can('manage-reviewers', atbdVersion);

  return (
    <DropdownCollaborators
      alignment='left'
      direction='down'
      triggerElement={(props) => (
        <Button
          variation='base-plain'
          title='View collaborators'
          useIcon='user'
          {...triggerProps}
          {...props}
        >
          {owner.preferred_username}{' '}
          {!!collaboratorCount && ` +${collaboratorCount}`}
        </Button>
      )}
    >
      <CollaboratorsMenuContent
        onOptionsClick={onOptionsClick}
        showOptions={showManageAction}
        owner={owner}
        authors={authors}
        reviewers={reviewers}
      />
    </DropdownCollaborators>
  );
}

CollaboratorsMenu.propTypes = {
  onOptionsClick: T.func,
  triggerProps: T.object,
  atbdVersion: T.object
};
