import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner
} from '../common/Inpage';
import Prose from '../../styles/type/prose';
import { showGlobalLoading, hideGlobalLoading } from '../common/OverlayLoader';

class Help extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pagesIndex: null,
      data: null,
    };
  }

  componentDidMount() {
    this.loadMdData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.page_id !== this.props.match.params.page_id) {
      this.loadMdData();
    }
  }

  async getPageIndex() {
    if (this.state.pagesIndex) {
      return this.state.pagesIndex;
    }
    try {
      const response = await fetch('/docs/index.json');
      const pagesIndex = await response.json();
      this.setState({ pagesIndex });
      return pagesIndex;
    } catch (error) {
      this.props.redirect('/uhoh');
    }
  }

  async loadMdData() {
    // Default to help if no id is provided.
    const pageId = this.props.match.params.page_id || 'help';
    showGlobalLoading();
    try {
      this.setState({ data: null });
      const pagesIndex = await this.getPageIndex();
      const page = pagesIndex.find(p => p.id === pageId);
      if (!page) {
        return this.props.redirect('/uhoh');
      }
      const response = await fetch(page.url);
      const pageData = await response.json();
      this.setState({
        data: pageData.content,
      });
    } catch (error) {
      this.setState({
        data: `Error during page load: ${error.message}`,
      });
    } finally {
      hideGlobalLoading();
    }
  }

  render() {
    return (
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Help center for APT</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <InpageBodyInner>
            <Prose dangerouslySetInnerHTML={{ __html: this.state.data }} />
          </InpageBodyInner>
        </InpageBody>
      </Inpage>
    );
  }
}

Help.propTypes = {
  match: T.object,
  redirect: T.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatch = {
  redirect: push
};

export default connect(mapStateToProps, mapDispatch)(Help);
