import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';

import { GlobalLoading, showGlobalLoading, hideGlobalLoading } from './OverlayLoader';

// The overlay loader is used as a way of displaying the global loading
// attaching it to the global store.
// The store doesn't have information about requests being in flight so when an
// action is triggered we store that action as being in a loading state and
// when it succeeds or fails we remove it from that list. This is done through
// a middleware. (globalLoadingMiddleware.js)
// Every time a new action is added to the loading list the loading counter is
// incremented, and then decremented when the action is removed. In this way we
// ensure that all the loadings are dismissed, even if new ones are added
// through other means.
class OverlayLoaderConnector extends Component {
  static propTypes = {
    loadingActions: T.array
  }

  componentWillReceiveProps(nextProps) {
    const { loadingActions: prevLoadingActions } = this.props;
    const { loadingActions: nextLoadingActions } = nextProps;
    const nextCount = nextLoadingActions.length;
    const prevCount = prevLoadingActions.length;
    const diff = Math.abs(nextCount - prevCount);

    if (nextCount > prevCount) {
      showGlobalLoading(diff);
    } else if (nextCount < prevCount) {
      hideGlobalLoading(diff);
    }
  }

  render() {
    return (
      <GlobalLoading />
    );
  }
}

const mapStateToProps = state => ({
  loadingActions: state.application.globalLoading
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OverlayLoaderConnector);
