import React, { Component, Fragment } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

class AtbdView extends Component {
  static propTypes = {
    atbd: T.object
  };

  render() {
    const { atbd } = this.props;

    if (!atbd) return <div>ATBD loading or not found.</div>;

    const { contacts } = atbd;

    return (
      <Fragment>
        {atbd && (
          <Fragment>
            <h1>{atbd.title}</h1>
            <h2>Identifying Information</h2>
            <h3>General</h3>
            <h3>Citation</h3>
            <h2>Introduction</h2>
            <h3>Introduction</h3>
            <h3>Historical Perspective</h3>
            <h2>Contacts</h2>
            {contacts && contacts.length === 0 ? (
              <div>No contacts associated.</div>
            ) : (
              <ul>
                {contacts.map(c => (
                  <li key={c.contact_id}>{c.displayName}</li>
                ))}
              </ul>
            )}
            <h2>References</h2>
            <h2>Algorithm Description</h2>
            <h2>Algorithm Usage</h2>
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
