import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';

import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageTagline,
  InpageToolbar,
  InpageBody,
  InpageBodyInner
} from '../common/Inpage';

import Prose from '../../styles/type/prose';

class AtbdView extends Component {
  static propTypes = {
    atbd: T.object
  };

  render() {
    const { atbd } = this.props;

    if (!atbd) return <div>ATBD loading or not found.</div>;

    const { contacts } = atbd;

    return (
      <Inpage>
        {atbd && (
          <StickyContainer>
            <Sticky>
              {stickyProps => (
                <InpageHeader
                  style={stickyProps.style}
                  isSticky={stickyProps.isSticky}
                >
                  <InpageHeaderInner>
                    <InpageHeadline>
                      <InpageTitle>{atbd.title}</InpageTitle>
                      <InpageTagline>Viewing document</InpageTagline>
                    </InpageHeadline>
                    <InpageToolbar>
                      Toolbar
                    </InpageToolbar>
                  </InpageHeaderInner>
                </InpageHeader>
              )}
            </Sticky>
            <InpageBody>
              <InpageBodyInner>
                <Prose>
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
                </Prose>
              </InpageBodyInner>
            </InpageBody>
          </StickyContainer>
        )}
      </Inpage>
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
