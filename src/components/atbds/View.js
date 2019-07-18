import React, { Component } from 'react';
import T from 'prop-types';
import styled from 'styled-components/macro';
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
  InpageBody
} from '../common/Inpage';

const IFrameHtml = styled.iframe`
  position: absolute;
  width: 100%;
  height: auto;
`;

class AtbdView extends Component {
  static propTypes = {
    atbd: T.object
  };

  render() {
    const { atbd } = this.props;

    if (!atbd) return <div>ATBD loading or not found.</div>;

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
                    <InpageToolbar>Toolbar</InpageToolbar>
                  </InpageHeaderInner>
                </InpageHeader>
              )}
            </Sticky>
            <InpageBody>
              <IFrameHtml
                id="inlineFrameExample"
                title="Inline Frame Example"
                src="http://nasa-apt-staging-atbd.s3-website-us-east-1.amazonaws.com/ATBD_10v1_288403d0-a97c-11e9-802c-9f1151e7787d/"
              />
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
