import React from 'react';
import T from 'prop-types';
import styled from 'styled-components/macro';
import { connect } from 'react-redux';

import Dropdown, { DropTitle } from './Dropdown';
import Button from '../../styles/button/button';

import { getLoggedUserData, logoutUser } from '../../actions/actions';
import { visuallyHidden } from '../../styles/helpers';
import { themeVal } from '../../styles/utils/general';

const API_URL = process.env.REACT_APP_API_URL;

const TriggerButton = styled(Button)`
  position: relative;
  &::before {
    margin-right: 0;
  }
`;

const AuthBoxContent = styled.div`
  & > *:not(:last-child) {
    margin-bottom: ${themeVal('layout.space')};
  }
`;

const Status = styled.span`
  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: ${themeVal('shape.ellipsoid')};
  }

  &::before {
    width: 0.75rem;
    height: 0.75rem;
    background-color: ${themeVal('color.primary')};
    right: 0.125rem;
    bottom: 0;
  }

  &::after {
    width: 0.5rem;
    height: 0.5rem;
    background-color: ${({ status }) => status === 'logged'
    ? themeVal('color.success')
    : status === 'validating'
      ? themeVal('color.warning')
      : themeVal('color.lightgray')};
    right: 0.25rem;
    bottom: 0.125rem;
  }

  span {
    ${visuallyHidden()}
  }
`;

class AuthBox extends React.PureComponent {
  componentDidMount() {
    if (this.props.user.token) {
      this.props.getLoggedUserData();
    }
  }

  componentDidUpdate(prevProps) {
    const tk = this.props.user.token;
    if (prevProps.user.token !== tk && tk) {
      this.props.getLoggedUserData();
    }
  }

  renderContent() {
    const { status } = this.props.user;

    const { protocol, host } = window.location;
    const loc = `${protocol}//${host}`;

    if (status === 'not-logged') {
      return (
        <AuthBoxContent>
          <p>You&apos;ll be redirected to login.</p>

          <Button
            forwardedAs="a"
            href={`${API_URL}/sso?return_to=${loc}/authorize`}
            size="medium"
            variation="primary-raised-dark"
            box="block"
          >
            Login
          </Button>
        </AuthBoxContent>
      );
    }

    if (status === 'validating') {
      return <p>We&apos;re validating your login. Please wait.</p>;
    }

    return (
      <AuthBoxContent>
        <p>Hello! You&apos;re logged in.</p>

        <Button
          forwardedAs="a"
          href={`${API_URL}/slo?return_to=${loc}`}
          size="medium"
          variation="primary-raised-dark"
          box="block"
          onClick={(e) => {
            // The location has to be manually set because otherwise the
            // "logoutUser" will make the button change and the login url will
            // be picked up by the click event instead.
            e.preventDefault();
            this.props.logoutUser();
            window.location = `${API_URL}/slo?return_to=${loc}`;
          }}
        >
          Logout
        </Button>
      </AuthBoxContent>
    );
  }

  render() {
    return (
      <Dropdown
        alignment="right"
        triggerElement={(
          <TriggerButton
            variation="achromic-plain"
            title="Toggle profile box"
            useIcon="user"
            size="small"
          >
            <Status status={this.props.user.status}>
              <span>
                Profile -{' '}
                {this.props.user.status === 'logged'
                  ? 'User is logged'
                  : 'User is not logged'}
              </span>
            </Status>
          </TriggerButton>
        )}
      >
        <DropTitle>Profile</DropTitle>
        {this.renderContent()}
      </Dropdown>
    );
  }
}

AuthBox.propTypes = {
  getLoggedUserData: T.func,
  logoutUser: T.func,
  user: T.object,
};

const mapStateToProps = (state) => {
  const { user } = state.application;

  return {
    router: state.router,
    user,
  };
};

const mapDispatch = {
  getLoggedUserData,
  logoutUser,
};

export default connect(mapStateToProps, mapDispatch)(AuthBox);
