import React, { Fragment, Component } from 'react';
import T from 'prop-types';
import styled from 'styled-components/macro';
import { connect } from 'react-redux';

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

const ATDBDFrame = styled.div`
  position: relative;
  padding-top: 56.25%;
`;

const ATDBDFrameObject = styled.iframe`
  position: absolute;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  border: none;
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
          <Fragment>
            <InpageHeader>
              <InpageHeaderInner>
                <InpageHeadline>
                  <InpageTitle>{atbd.title}</InpageTitle>
                  <InpageTagline>Viewing document</InpageTagline>
                </InpageHeadline>
                <InpageToolbar>Toolbar</InpageToolbar>
              </InpageHeaderInner>
            </InpageHeader>
            <InpageBody>
              <ATDBDFrame>
                <ATDBDFrameObject
                  frameborder="0"
                  allowfullscreen
                  id="inlineFrameExample"
                  title="Inline Frame Example"
                  src="http://nasa-apt-staging-atbd.s3-website-us-east-1.amazonaws.com/ATBD_10v1_288403d0-a97c-11e9-802c-9f1151e7787d/"
                />
              </ATDBDFrame>
            </InpageBody>
          </Fragment>
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
