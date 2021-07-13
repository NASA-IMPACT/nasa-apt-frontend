import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import Dropdown from '@devseed-ui/dropdown';
import { Button } from '@devseed-ui/button';

import UserIdentity from '../common/user-identity';

// Drop content elements.

const DropdownContributors = styled(Dropdown)`
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

const ContributorsList = styled.dl`
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

const ContributorEntry = (props) => {
  const { isLead, user } = props;
  return <UserIdentity user={user} role={isLead && 'Lead'} />;
};

ContributorEntry.propTypes = {
  isLead: T.bool,
  user: T.object
};

const ContributorsMenuContent = () => {
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
              Edit contributors
            </Button>
          </DropActions>
          <DropTitle size='xsmall'>Contributors</DropTitle>
        </DropHeadline>
      </DropHeader>
      <div>
        <ContributorsList>
          <dt>Authors</dt>
          <dd>
            <ul>
              <li>
                <ContributorEntry user={{ name: 'Sean Riley' }} isLead />
              </li>
              <li>
                <ContributorEntry user={{ name: 'Monica Anderson' }} />
              </li>
              <li>
                <ContributorEntry user={{ name: 'Carlos Maria' }} />
              </li>
            </ul>
          </dd>
          <dt>Reviewers</dt>
          <dd>
            <ul>
              <li>
                <ContributorEntry user={{ name: 'Bruce Wayne' }} />
              </li>
            </ul>
          </dd>
        </ContributorsList>
      </div>
    </React.Fragment>
  );
};

export function ContributorsMenu() {
  return (
    <DropdownContributors
      alignment='center'
      direction='down'
      triggerElement={(props) => (
        <Button
          variation='base-plain'
          title='Open dropdown'
          useIcon='user'
          size='small'
          {...props}
        >
          Sean Riley +3
        </Button>
      )}
    >
      <ContributorsMenuContent />
    </DropdownContributors>
  );
}

ContributorsMenu.propTypes = {};
