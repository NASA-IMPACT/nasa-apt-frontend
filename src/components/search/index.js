import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';

import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner,
} from '../common/Inpage';
import FormInput from '../../styles/form/input';
import FormSelect from '../../styles/form/select';
import FormLabel from '../../styles/form/label';
import Button from '../../styles/button/button';
import StatusPill from '../common/StatusPill';

import collecticon from '../../styles/collecticons';
import { glsp } from '../../styles/utils/theme-values';
import { themeVal } from '../../styles/utils/general';
import QsState from '../../utils/qs-state';

const ResultsHeading = styled.h2`
  margin-bottom: 2rem;
`;

const NoResultsMessage = styled.div`
  padding: 3rem;
  text-align: center;

  &::before {
    ${collecticon('face-sad')};
    display: block;
    font-size: 4rem;
    line-height: 1;
    opacity: 0.48;
    margin-bottom: 2rem;
  }
`;

const SearchControls = styled.div`
  max-width: 40rem;
  margin-bottom: ${glsp(2)};

  & > *:not(:last-child) {
    margin-bottom: ${glsp()};
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;

  button {
    flex-shrink: 0;
    margin-left: 1rem;
  }
`;

const SearchFilterGroup = styled.div`
  display: flex;

  & > *:not(:last-child) {
    margin-right: ${glsp(2)};
  }
`;

const SearchFilter = styled.div`
  display: flex;

  ${FormLabel} {
    font-weight: ${themeVal('type.base.weight')};
    margin-right: ${glsp(0.5)};
  }

  ${FormSelect} {
    min-width: 5rem;
  }
`;

const SearchResultsList = styled.ul`
  display: grid;
  grid-gap: ${glsp(2)};
`;

const SearchResult = styled.article`
  > *:not(:last-child) {
    margin-bottom: ${glsp()};
  }
`;

const ResultLink = styled(Link)`
  display: inline-block;
`;

const ResultHeader = styled.header``;

const ResultHeadline = styled.div`
  display: flex;

  ${StatusPill} {
    margin-right: ${glsp()};
  }

  h1 {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5rem;
  }
`;

const ResultAuthors = styled.p`
  margin-top: ${glsp(0.5)};
  font-size: 0.875rem;
`;

const ResultBody = styled.div`
  max-width: 40rem;

  em {
    font-style: italic;
    background-color: ${themeVal('color.warning')};
  }
`;

const atbdStatusOptions = [
  {
    id: 'Draft',
    label: 'Draft',
  },
  {
    id: 'Published',
    label: 'Published',
  },
];

class Search extends Component {
  constructor(props) {
    super(props);

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearch = this.onSearch.bind(this);

    this.qsState = new QsState({
      status: {
        accessor: 'status',
        default: 'all',
        validator: atbdStatusOptions.map(o => o.id),
      },
      year: {
        accessor: 'year',
        default: 'all',
      },
      search: {
        accessor: 'searchValue',
        default: '',
      },
    });

    const state = this.qsState.getState(props.location.search.substr(1));
    this.state = {
      ...state,
      // Value currently on the search field.
      searchCurrent: state.searchValue,
    };
  }

  onSearchChange(e) {
    this.setState({ searchCurrent: e.target.value });
  }

  onSelectChange(field, e) {
    this.setState({ [field]: e.target.value });
  }

  onSearch() {
    this.setState(
      state => ({ searchValue: state.searchCurrent }),
      () => {
        const qString = this.qsState.getQs(this.state);
        this.props.push({ search: qString });
      }
    );
  }

  render() {
    const resultCount = 2;
    const searchTerm = 'searchValue';

    return (
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Search results</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <InpageBodyInner>
            <SearchControls>
              <SearchBox>
                <FormInput
                  id="search-term"
                  name="search-term"
                  type="text"
                  placeholder="Search term"
                  value={this.state.searchCurrent}
                  onChange={this.onSearchChange}
                />
                <Button
                  useIcon="magnifier-right"
                  variation="primary-raised-light"
                  onClick={this.onSearch}
                >
                  Search
                </Button>
              </SearchBox>
              <SearchFilterGroup>
                <SearchFilter>
                  <FormLabel>Year</FormLabel>
                  <FormSelect size="small">
                    <option>All</option>
                  </FormSelect>
                </SearchFilter>
                <SearchFilter>
                  <FormLabel>Status</FormLabel>
                  <FormSelect
                    id="search-status"
                    name="search-status"
                    size="small"
                    value={this.state.status}
                    onChange={this.onSelectChange.bind(this, 'status')}
                  >
                    <option value="all">All</option>
                    {atbdStatusOptions.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </FormSelect>
                </SearchFilter>
              </SearchFilterGroup>
            </SearchControls>

            <ResultsHeading>
              Showing {resultCount} result{resultCount > 1 ? 's' : ''} for{' '}
              <em>{searchTerm}</em>
            </ResultsHeading>

            <SearchResultsList>
              <li>
                <SearchResult>
                  <ResultLink to="/atbds/1" title="View this ATBD">
                    <ResultHeader>
                      <ResultHeadline>
                        <StatusPill>Draft</StatusPill>
                        <h1>Untitled Document</h1>
                      </ResultHeadline>
                      <ResultAuthors>
                        By: <span>Leonardo Davinci</span>, <span>Brad Wayne</span>
                      </ResultAuthors>
                    </ResultHeader>
                  </ResultLink>
                </SearchResult>
              </li>
              <li>
                <SearchResult>
                  <ResultLink to="/atbds/1" title="View this ATBD">
                    <ResultHeader>
                      <ResultHeadline>
                        <StatusPill>Draft</StatusPill>
                        <h1>Untitled Document</h1>
                      </ResultHeadline>
                      <ResultAuthors>
                        By: <span>Leonardo Davinci</span>, <span>Brad Wayne</span>
                      </ResultAuthors>
                    </ResultHeader>
                  </ResultLink>
                  <ResultBody>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. <em>Iste</em> praesentium assumenda tenetur provident distinctio quasi nulla error labore eos perferendis laudantium, et consequatur odit minus, iure, nam cupiditate unde. Praesentium?
                  </ResultBody>
                </SearchResult>
              </li>
            </SearchResultsList>

            <NoResultsMessage>
              <p>
                There are no results for the current search/filters criteria.
              </p>
            </NoResultsMessage>
          </InpageBodyInner>
        </InpageBody>
      </Inpage>
    );
  }
}

Search.propTypes = {
  location: T.object,
  push: T.func,
};

const mapStateToProps = (state) => {};

const mapDispatch = {
  push,
};

export default connect(mapStateToProps, mapDispatch)(Search);
