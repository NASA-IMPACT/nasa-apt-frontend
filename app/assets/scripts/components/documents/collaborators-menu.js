import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import Dropdown, { DropTitle } from '@devseed-ui/dropdown';
import { Button } from '@devseed-ui/button';

import UserIdentity from '../common/user-identity';

import { DropHeader, DropHeadline, DropActions } from '../../styles/drop';

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
  const { isLead, user } = props;
  return <UserIdentity user={user} role={isLead && 'Lead'} />;
};

CollaboratorEntry.propTypes = {
  isLead: T.bool,
  user: T.object
};

const CollaboratorsMenuContent = () => {
  return (
    <React.Fragment>
      <DropHeader>
        <DropHeadline>
          <DropTitle size='xsmall'>Collaborators</DropTitle>
        </DropHeadline>
        <DropActions>
          <Button
            variation='base-plain'
            title='Manage collaborators'
            useIcon='pencil'
            size='small'
            hideText
            // onClick={onCancelButtonClick}
            data-dropdown='click.close'
          >
            Manage
          </Button>
        </DropActions>
      </DropHeader>
      <CollaboratorsList>
        <CollaboratorsListTerm>Authors</CollaboratorsListTerm>
        <dd>
          <ul>
            <li>
              <CollaboratorEntry user={{ name: 'Sean Riley' }} isLead />
            </li>
            <li>
              <CollaboratorEntry user={{ name: 'Monica Anderson' }} />
            </li>
            <li>
              <CollaboratorEntry user={{ name: 'Carlos Maria' }} />
            </li>
          </ul>
        </dd>
        <CollaboratorsListTerm>Reviewers</CollaboratorsListTerm>
        <dd>
          <ul>
            <li>
              <CollaboratorEntry user={{ name: 'Bruce Wayne' }} />
            </li>
          </ul>
        </dd>
      </CollaboratorsList>
    </React.Fragment>
  );
};

export function CollaboratorsMenu() {
  return (
    <DropdownCollaborators
      alignment='left'
      direction='down'
      triggerElement={(props) => (
        <Button
          variation='base-plain'
          title='View collaborators'
          useIcon='user'
          size='small'
          {...props}
        >
          Sean Riley +3
        </Button>
      )}
    >
      <CollaboratorsMenuContent />
    </DropdownCollaborators>
  );
}

CollaboratorsMenu.propTypes = {};
