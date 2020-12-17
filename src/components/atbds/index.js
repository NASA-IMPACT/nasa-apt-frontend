/* eslint-disable react/destructuring-assignment */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';
import styled from 'styled-components/macro';
import { push } from 'connected-react-router';
import {
  createAtbd,
  deleteAtbd,
  updateAtbdVersion,
  copyAtbd
} from '../../actions/actions';
import {
  atbdsedit,
  drafts,
  identifying_information
} from '../../constants/routes';
import { themeVal } from '../../styles/utils/general';

import { visuallyHidden, truncated } from '../../styles/helpers';
import { VerticalDivider } from '../../styles/divider';
import Button from '../../styles/button/button';
import collecticon from '../../styles/collecticons';

import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageFilters,
  FilterItem,
  FilterLabel,
  InpageToolbar,
  InpageBody,
  InpageBodyInner
} from '../common/Inpage';

import Dropdown, {
  DropTitle,
  DropMenu,
  DropMenuItem
} from '../common/Dropdown';

import Table from '../../styles/table';

import { confirmDeleteDoc } from '../common/ConfirmationPrompt';
import StatusPill from '../common/StatusPill';
import SearchControl from '../common/SearchControl';
import QsState from '../../utils/qs-state';
import TextHighlight from '../common/TextHighlight';
import CitationModal from './CitationModal';

const atbdStatusOptions = [
  {
    id: 'Draft',
    label: 'Draft'
  },
  {
    id: 'Published',
    label: 'Published'
  }
];

const ResultsHeading = styled.h2`
  margin-bottom: 2rem;
`;

const DocTable = styled(Table)`
  white-space: nowrap;
  margin: 0 -${themeVal('layout.space')};
  width: auto;
  max-width: none;

  th,
  td {
    padding: ${themeVal('layout.space')};
  }
`;

const DocTableHeadThTitle = styled.th`
  width: 100%;
`;

const DocTableHeadThActions = styled.th`
  > span {
    ${visuallyHidden};
  }
`;

const DocTableHeadThStatus = styled.th`
  max-width: 10rem;
`;

const DocTableBodyThTitle = styled.th`
  white-space: normal;

  a {
    color: inherit;
  }
`;

const DocTableBodyTdAuthors = styled.td`
  > span {
    ${truncated};
    display: block;
    max-width: 12rem;
  }
`;

const DocTableBodyTdActions = styled.td`
  text-align: right !important;

  > *:not(:first-child) {
    margin-left: 0.5rem;
  }
`;

const DocTableActionView = styled(DropMenuItem)`
  &::before {
    ${collecticon('eye')}
  }
`;

const DocTableActionEdit = styled(DropMenuItem)`
  &::before {
    ${collecticon('pencil')}
  }
`;

const DocTableActionPublish = styled(DropMenuItem)`
  &::before {
    ${collecticon('arrow-up-right')}
  }
`;

const DocTableActionDuplicate = styled(DropMenuItem)`
  &::before {
    ${collecticon('pages')}
  }
`;

const DocTableActionCitation = styled(DropMenuItem)`
  &::before {
    ${collecticon('quote-left')}
  }
`;

const DocTableActionDelete = styled(DropMenuItem)`
  &::before {
    ${collecticon('trash-bin')}
  }
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

class AtbdList extends React.Component {
  constructor(props) {
    super(props);

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearch = this.onSearch.bind(this);

    this.qsState = new QsState({
      status: {
        accessor: 'filter.status',
        default: 'all',
        validator: atbdStatusOptions.map(o => o.id)
      },
      search: {
        accessor: 'searchValue',
        default: ''
      }
    });

    const state = this.qsState.getState(props.location.search.substr(1));
    this.state = {
      ...state,
      // Value currently on the search field.
      searchCurrent: state.searchValue,
      citationModalAtbd: {
        id: null,
        version: null
      }
    };
  }

  onUpdateClick(atbd, e) {
    e.preventDefault();
    const { atbd_version } = atbd.atbd_versions[0];
    /* eslint-disable-next-line react/destructuring-assignment */
    this.props.updateAtbdVersion(atbd.atbd_id, atbd_version, { status: 'Published' });
  }

  onCitationClick(atbd, e) {
    e.preventDefault();
    const { atbd_version } = atbd.atbd_versions[0];
    this.setState({
      citationModalAtbd: {
        id: atbd.atbd_id,
        version: atbd_version
      }
    });
  }

  async onDeleteClick({ title, atbd_id }, e) {
    e.preventDefault();
    const res = await confirmDeleteDoc(title);
    if (res.result) this.props.deleteAtbd(atbd_id);
  }

  async onDuplicateClick({ atbd_id }, e) {
    e.preventDefault();
    const { copyAtbdAction } = this.props;
    const res = await copyAtbdAction(atbd_id);
    if (!res.error) {
      this.props.push(`/atbds/${res.payload.new_id}`);
    }
  }

  onSearchChange(searchCurrent) {
    this.setState({ searchCurrent });
  }

  onSearch(searchValue) {
    this.setState({ searchValue }, () => {
      const qString = this.qsState.getQs(this.state);
      this.props.push({ pathname: '/search', search: qString });
    });
  }

  setFilterValue(what, value, e) {
    e.preventDefault();
    this.setState(
      state => ({
        filter: {
          ...state.filter,
          [what]: value
        }
      }),
      () => {
        const qString = this.qsState.getQs(this.state);

        this.props.push({ search: qString });
      }
    );
  }

  renderAtbdTable() {
    const { atbds } = this.props;
    return (
      <DocTable>
        <thead>
          <tr>
            <DocTableHeadThStatus scope="col">
              <span>Status</span>
            </DocTableHeadThStatus>
            <DocTableHeadThTitle scope="col">
              <span>Title</span>
            </DocTableHeadThTitle>
            <th scope="col">
              <span>Authors</span>
            </th>
            <DocTableHeadThActions scope="col">
              <span>Actions</span>
            </DocTableHeadThActions>
          </tr>
        </thead>
        <tbody>{atbds.map(atbd => this.renderAtbdTableRow(atbd))}</tbody>
      </DocTable>
    );
  }

  renderAtbdTableRow(atbd) {
    const { isUserLogged } = this.props;
    const {
      atbd_id, title, alias, atbd_versions, contacts
    } = atbd;
    const { searchValue } = this.state;

    const contact = contacts[0] !== undefined
      ? `${contacts[0].first_name} ${contacts[0].last_name}`
      : '';

    const { status } = atbd_versions[0];

    return (
      <tr key={atbd_id}>
        <td>
          <StatusPill>{status}</StatusPill>
        </td>
        <DocTableBodyThTitle scope="row">
          <Link to={`/atbds/${alias || atbd_id}`} title="View this ATBD">
            <strong>
              <TextHighlight value={searchValue} disabled={!title}>
                {title || 'Untitled Document'}
              </TextHighlight>
            </strong>
          </Link>
        </DocTableBodyThTitle>
        <DocTableBodyTdAuthors title={contact}>
          <TextHighlight
            value={searchValue}
            disabled={!contact}
          >
            {contact}
          </TextHighlight>
        </DocTableBodyTdAuthors>
        <DocTableBodyTdActions>
          <Dropdown
            alignment="middle"
            direction="left"
            triggerElement={(
              <Button
                variation="primary-plain"
                useIcon="ellipsis-vertical"
                size="small"
                title="View Document options"
                hideText
              >
                Actions
              </Button>
            )}
          >
            <DropTitle>Document actions</DropTitle>
            <DropMenu role="menu" iconified>
              <li>
                <DocTableActionView
                  as={Link}
                  title="View document"
                  to={`/atbds/${alias || atbd_id}`}
                >
                  View
                </DocTableActionView>
              </li>
              {status === 'Draft' && isUserLogged && (
                <React.Fragment>
                  <li>
                    <DocTableActionEdit
                      title="Edit document"
                      as={Link}
                      to={`/${atbdsedit}/${atbd_id}/${drafts}/1/${identifying_information}`}
                    >
                      Edit
                    </DocTableActionEdit>
                  </li>
                  <li>
                    <DocTableActionPublish
                      title="Publish document"
                      data-hook="dropdown:close"
                      onClick={this.onUpdateClick.bind(this, atbd)}
                    >
                      Publish
                    </DocTableActionPublish>
                  </li>
                </React.Fragment>
              )}
              { isUserLogged && (
                <li>
                  <DocTableActionDuplicate
                    title="Duplicate document"
                    data-hook="dropdown:close"
                    onClick={this.onDuplicateClick.bind(this, atbd)}
                  >
                    Duplicate
                  </DocTableActionDuplicate>
                </li>
              )}
              <li>
                <DocTableActionCitation
                  title="Get document citation"
                  data-hook="dropdown:close"
                  onClick={this.onCitationClick.bind(this, atbd)}
                >
                  Citation
                </DocTableActionCitation>
              </li>
            </DropMenu>
            { isUserLogged && (
              <DropMenu role="menu" iconified>
                <li>
                  <DocTableActionDelete
                    title="Delete document"
                    disabled
                    onClick={this.onDeleteClick.bind(this, atbd)}
                  >
                    Delete
                  </DocTableActionDelete>
                </li>
              </DropMenu>
            )}
          </Dropdown>
        </DocTableBodyTdActions>
      </tr>
    );
  }

  renderCitationModal() {
    const { id, version } = this.state.citationModalAtbd;
    return (
      <CitationModal
        id={id}
        version={version}
        onClose={() => this.setState({
          citationModalAtbd: { id: null, version: null }
        })}
      />
    );
  }

  renderPageContent() {
    const { atbds } = this.props;
    const { searchValue } = this.state;

    if (!atbds.length) {
      return (
        <React.Fragment>
          <ResultsHeading>No results found</ResultsHeading>
          <NoResultsMessage>
            <p>There are no results for the current search/filters criteria.</p>
          </NoResultsMessage>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {searchValue && (
          <ResultsHeading>
            Showing {atbds.length} result{atbds.length > 1 ? 's' : ''} for{' '}
            <em>{searchValue}</em>
          </ResultsHeading>
        )}
        {this.renderAtbdTable()}
      </React.Fragment>
    );
  }

  renderFilterOptions() {
    const { isUserLogged } = this.props;
    const {
      filter: { status: filterStatus }
    } = this.state;
    const activeFilter = atbdStatusOptions.find(o => o.id === filterStatus) || {};

    if (!isUserLogged) {
      return (
        <InpageFilters>
          <FilterItem>
            <FilterLabel>Status</FilterLabel>
            <Button
              variation="achromic-plain"
              useIcon="chevron-down--small"
              title="Toggle menu options"
              disabled
            >
              Published
            </Button>
          </FilterItem>
        </InpageFilters>
      );
    }

    return (
      <InpageFilters>
        <FilterItem>
          <FilterLabel>Status</FilterLabel>
          <Dropdown
            alignment="left"
            triggerElement={(
              <Button
                variation="achromic-plain"
                useIcon="chevron-down--small"
                title="Toggle menu options"
              >
                {activeFilter.label || 'All'}
              </Button>
            )}
          >
            <DropTitle>Select status</DropTitle>
            <DropMenu role="menu" selectable>
              <li>
                <DropMenuItem
                  active={filterStatus === 'all'}
                  onClick={this.setFilterValue.bind(
                    this,
                    'status',
                    'all'
                  )}
                  data-hook="dropdown:close"
                >
                  All
                </DropMenuItem>
              </li>
              {atbdStatusOptions.map(o => (
                <li key={o.id}>
                  <DropMenuItem
                    active={filterStatus === o.id}
                    onClick={this.setFilterValue.bind(
                      this,
                      'status',
                      o.id
                    )}
                    data-hook="dropdown:close"
                  >
                    {o.label}
                  </DropMenuItem>
                </li>
              ))}
            </DropMenu>
          </Dropdown>
        </FilterItem>
      </InpageFilters>
    );
  }

  render() {
    const { createAtbd: create, isUserLogged } = this.props;
    const {
      searchCurrent,
      searchValue
    } = this.state;

    return (
      <Inpage>
        <StickyContainer>
          <Sticky>
            {stickyProps => (
              <InpageHeader
                style={stickyProps.style}
                isSticky={stickyProps.isSticky}
              >
                <InpageHeaderInner>
                  <InpageHeadline>
                    <InpageTitle>Documents</InpageTitle>
                  </InpageHeadline>
                  <VerticalDivider />

                  {this.renderFilterOptions()}

                  <InpageToolbar>
                    <SearchControl
                      onChange={this.onSearchChange}
                      onSearch={this.onSearch}
                      value={searchCurrent}
                      lastSearch={searchValue}
                    />
                    {isUserLogged && (
                      <Button
                        variation="achromic-plain"
                        useIcon="plus"
                        title="Create new document"
                        onClick={create}
                      >
                        Create
                      </Button>
                    )}
                  </InpageToolbar>
                </InpageHeaderInner>
              </InpageHeader>
            )}
          </Sticky>
          <InpageBody>
            {this.renderCitationModal()}
            <InpageBodyInner>{this.renderPageContent()}</InpageBodyInner>
          </InpageBody>
        </StickyContainer>
      </Inpage>
    );
  }
}

AtbdList.propTypes = {
  location: PropTypes.object,
  atbds: PropTypes.arrayOf(
    PropTypes.shape({
      atbd_id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    })
  ),
  push: PropTypes.func,
  createAtbd: PropTypes.func.isRequired,
  deleteAtbd: PropTypes.func.isRequired,
  updateAtbdVersion: PropTypes.func.isRequired,
  copyAtbdAction: PropTypes.func.isRequired,
  isUserLogged: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const { atbds, user } = state.application;
  return { atbds, isUserLogged: user.status === 'logged' };
};

const mapDispatch = {
  push,
  createAtbd,
  deleteAtbd,
  updateAtbdVersion,
  copyAtbdAction: copyAtbd,
};

export default connect(
  mapStateToProps,
  mapDispatch
)(AtbdList);
