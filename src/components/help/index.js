import React, { Component } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { push } from 'connected-react-router';
import { rgba } from 'polished';

import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner,
  InpageToolbar
} from '../common/Inpage';
import Prose from '../../styles/type/prose';
import Button from '../../styles/button/button';
import { showGlobalLoading, hideGlobalLoading } from '../common/OverlayLoader';
import Dropdown, { DropMenu, DropTitle, DropMenuItem } from '../common/Dropdown';
import { headingAlt } from '../../styles/type/heading';
import { stylizeFunction } from '../../styles/utils/general';
import { getAppURL } from '../../store/store';

const _rgba = stylizeFunction(rgba);

const BASE_URL = getAppURL().cleanHref;

const HelpProse = styled(Prose)`
  max-width: 48rem;
  margin: 0 auto;

  img {
    max-width: 100%;
  }

  figcaption {
    width: 80%;
    margin: 0 auto;
    font-style: italic;
  }
`;


const StepDrop = styled(Dropdown)`
  min-width: 20rem;
`;

const Stepper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  line-height: 2.5rem;
  align-items: center;

  > * {
    display: inline-flex;
  }
`;

const StepperLabel = styled.h6`
  ${headingAlt()}
  font-size: 0.875rem;
  color: ${_rgba('#FFFFFF', 0.64)};
  margin-right: 0.5rem;
  white-space: nowrap;
`;

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
      const response = await fetch(`${BASE_URL}/docs/index.json`);
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
      const response = await fetch(BASE_URL + page.url);
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

  renderNavigation() {
    const { pagesIndex } = this.state;
    if (!pagesIndex) return null;

    // Default to help if no id is provided.
    const pageId = this.props.match.params.page_id || 'help';

    const page = pagesIndex.find(p => p.id === pageId);
    if (!page) return null;

    return (
      <Stepper>
        <StepperLabel>Sections</StepperLabel>
        <StepDrop
          alignment="right"
          triggerElement={(
            <Button
              variation="achromic-plain"
              title="Toggle help sections"
              useIcon={['chevron-down--small', 'after']}
            >
              {page.title}
            </Button>
          )}
        >
          <DropTitle>Select section</DropTitle>
          <DropMenu role="menu" selectable>
            {pagesIndex.map(p => (
              <li key={p.id}>
                <DropMenuItem
                  exact
                  as={NavLink}
                  to={p.id === 'help' ? '/help' : `/help/${p.id}`}
                  data-hook="dropdown:close"
                >
                  {p.title}
                </DropMenuItem>
              </li>
            ))}
          </DropMenu>
        </StepDrop>
      </Stepper>
    );
  }

  render() {
    return (
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Help center for APT</InpageTitle>
            </InpageHeadline>
            <InpageToolbar>
              {this.renderNavigation()}
            </InpageToolbar>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <InpageBodyInner>
            <HelpProse dangerouslySetInnerHTML={{ __html: this.state.data }} />
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
