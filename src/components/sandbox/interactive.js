import React from 'react';
import styled from 'styled-components';

import collecticon from '../../styles/collecticons';

import Button from '../../styles/button/button';
import Dropdown, {
  DropTitle,
  DropMenu,
  DropMenuItem
} from '../common/Dropdown';
import {
  showGlobalLoading,
  hideGlobalLoading
} from '../common/OverlayLoader';
import toasts from '../common/toasts';

const InteractiveExample = () => (
  <React.Fragment>
    <h2>Interactive elements</h2>

    <LoadingExample />
    <DropdownExample />
    <Toasts />
  </React.Fragment>
);

export default InteractiveExample;

// ////////////////////////////////////////////////////////////////////////// //
// //////////////////////////// Dropdown Example //////////////////////////// //
// ////////////////////////////////////////////////////////////////////////// //

const DropMenuIconified = styled(DropMenuItem)`
  &::before {
    ${({ useIcon }) => collecticon(useIcon)}
  }
`;

const DropdownExample = () => (
  <React.Fragment>
    <h3>Dropdowns</h3>
    <Dropdown
      alignment="right"
      direction="down"
      triggerElement={(
        <Button variation="base-raised-light" title="View options">
          Dropdown options
        </Button>
)}
    >
      <DropTitle>Options</DropTitle>
      <DropMenu role="menu" iconified>
        <li>
          <DropMenuIconified useIcon="circle-information">
            Action 1
          </DropMenuIconified>
        </li>
        <li>
          <DropMenuIconified useIcon="circle-question">Action 2</DropMenuIconified>
        </li>
      </DropMenu>
      <DropMenu role="menu" iconified>
        <li>
          <DropMenuIconified useIcon="eye">Action A</DropMenuIconified>
        </li>
      </DropMenu>
      <DropMenu role="menu" selectable>
        <li>
          <DropMenuItem active>Selected</DropMenuItem>
        </li>
        <li>
          <DropMenuItem>Not selected</DropMenuItem>
        </li>
      </DropMenu>
    </Dropdown>
  </React.Fragment>
);

// ////////////////////////////////////////////////////////////////////////// //
// //////////////////////////// Loading Example ///////////////////////////// //
// ////////////////////////////////////////////////////////////////////////// //

class LoadingExample extends React.Component {
  render() {
    return (
      // The <GlobalLoading /> must be mounted for the loading to show.
      // It should be mounted at the app root.
      <div>
        <h3>Global loading</h3>
        <p>
          The <code>{'<GlobalLoading />'}</code> must be mounted for the loading
          to show. It should be mounted at the app root.
        </p>
        <Button
          variation="base-raised-light"
          onClick={() => {
            showGlobalLoading();
            setTimeout(() => {
              hideGlobalLoading();
            }, 1000);
          }}
        >
          Global Loading
        </Button>
      </div>
    );
  }
}

// ////////////////////////////////////////////////////////////////////////// //
// //////////////////////////// Loading Example ///////////////////////////// //
// ////////////////////////////////////////////////////////////////////////// //

const Toasts = () => (
  <React.Fragment>
    <h3>Toast notifications</h3>
    <Button
      variation="base-raised-light"
      onClick={() => {
        toasts.success('This is an success toast');
        toasts.error('This is an error toast which sticks', {
          autoClose: false
        });
        toasts.info(
          'Here\'s some info for you. This toast will not auto close',
          { autoClose: false, closeOnClick: false }
        );
        toasts.warn('This is an warning toast');
      }}
    >
      Toasts!
    </Button>
  </React.Fragment>
);
