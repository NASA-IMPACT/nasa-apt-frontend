import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import Dropdown from '@devseed-ui/dropdown';
import { Button } from '@devseed-ui/button';

import UserIdentity from '../common/user-identity';

// Drop content elements.

const DropdownCollaborators = styled(Dropdown)`
  max-width: 20rem;
`;

const DropHeader = styled.header`
  display: grid;
  grid-gap: ${glsp()};
  box-shadow: 0 1px 0 0 ${themeVal('color.baseAlphaC')};
  margin: ${glsp(-1, -1, 0, -1)};
  padding: ${glsp()};
`;

const DropHeadline = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
`;

const DropActions = styled.div`
  display: flex;
  margin-left: auto;
`;

const DropTitle = styled(Heading)`
  flex-basis: 100%;
  margin: 0;
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
          <DropActions>
            <Button
              variation='base-plain'
              title='Open dropdown'
              useIcon='pencil'
              size='small'
              hideText
              // onClick={onCancelButtonClick}
              data-dropdown='click.close'
            >
              Manage collaborators
            </Button>
          </DropActions>
          <DropTitle size='xsmall'>Collaborators</DropTitle>
        </DropHeadline>
      </DropHeader>
      <div>
        <CollaboratorsList>
          <dt>Authors</dt>
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
          <dt>Reviewers</dt>
          <dd>
            <ul>
              <li>
                <CollaboratorEntry user={{ name: 'Bruce Wayne' }} />
              </li>
            </ul>
          </dd>
        </CollaboratorsList>
      </div>
    </React.Fragment>
  );
};

export function CollaboratorsMenu() {
  return (
    <DropdownCollaborators
      alignment='center'
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
