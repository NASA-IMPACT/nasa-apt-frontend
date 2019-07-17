import React, { Component, Fragment } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

class AtbdView extends Component {
  static propTypes = {
    atbd: T.object
  };

  render() {
    const { atbd } = this.props;
    return (
      <Fragment>
        {atbd && (
          <Fragment>
            <h1>{atbd.title}</h1>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { selectedAtbd } = state.application;
  return { atbd: selectedAtbd };
};

const mapDispatch = {};

export default connect(
  mapStateToProps,
  mapDispatch
)(AtbdView);
