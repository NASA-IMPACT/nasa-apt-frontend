import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, rgba, themeVal } from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';
import { headingAlt } from '@devseed-ui/typography';

import Tip from '../common/tooltip';
import Pill from '../common/pill';
import UserImage from '../common/user-image';

const ContributorsLabel = styled.span`
  font-size: 0.875rem;

  ::before {
    ${collecticon('user')}
    margin-right: ${glsp(0.25)};
  }
`;

// Drop content elements.
const DropTitle = styled.h5`
  ${headingAlt()}
  color: ${rgba(themeVal('color.base'), 0.64)};
  font-size: 0.875rem;
  line-height: 1rem;
  margin: ${glsp(-1, -1, 1, -1)};
  padding: ${glsp()};
  box-shadow: 0 ${themeVal('layout.border')} 0 0 ${themeVal('color.baseAlphaC')};
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

const ContributorEntrySelf = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  grid-gap: ${glsp(0.5)};
`;

const ContributorEntry = (props) => {
  const { isLead, user } = props;

  return (
    <ContributorEntrySelf>
      <UserImage user={user} />
      <span>{user.name}</span>
      {isLead && <Pill>Lead</Pill>}
    </ContributorEntrySelf>
  );
};

ContributorEntry.propTypes = {
  isLead: T.bool,
  user: T.object
};

const ContributorsMenuContent = () => {
  return (
    <div>
      <DropTitle>Contributors</DropTitle>
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
  );
};

export function ContributorsMenu() {
  return (
    <Tip
      position='top'
      html={<ContributorsMenuContent />}
      theme='apt-drop'
      arrow={false}
      animateFill={false}
      animation='shift'
      interactive
      useContext
    >
      <ContributorsLabel>Sean Riley +3</ContributorsLabel>
    </Tip>
  );
}

ContributorsMenu.propTypes = {};
