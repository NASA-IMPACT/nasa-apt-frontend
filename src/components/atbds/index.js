import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';
import styled from 'styled-components/macro';
import { push } from 'connected-react-router';
import { createAtbd, deleteAtbd, updateAtbdVersion } from '../../actions/actions';
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

import PreviewButton from './PreviewButton';
import { confirmDeleteDoc } from '../common/ConfirmationPrompt';
import StatusPill from '../common/StatusPill';
import SearchControl from '../common/SearchControl';
import QsState from '../../utils/qs-state';
import TextHighlight from '../common/TextHighlight';

const atbdStatusOptions = [
  {
    id: 'draft',
    label: 'Draft'
  },
  {
    id: 'published',
    label: 'Published'
  }
];

const CreateButton = styled(Button)`
  &::before {
    ${collecticon('plus')};
  }
`;

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

const DocTableActionsTrigger = styled(Button)`
  &::before {
    ${collecticon('ellipsis-vertical')}
  }
`;

const DocTableActionPreview = styled(DropMenuItem)`
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

const DocTableActionDelete = styled(DropMenuItem)`
  &::before {
    ${collecticon('trash-bin')}
  }
`;

const FilterTrigger = styled(Button)`
  &::after {
    ${collecticon('chevron-down--small')}
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
      searchCurrent: state.searchValue
    };
  }

  onEditClick(atbd, e) {
    e.preventDefault();
    /* eslint-disable-next-line react/destructuring-assignment */
    this.props.push(
      `/${atbdsedit}/${atbd.atbd_id}/${drafts}/1/${identifying_information}`
    );
  }

  onUpdateClick(atbd, e) {
    e.preventDefault();
    const { atbd_version } = atbd.atbd_versions[0];
    /* eslint-disable-next-line react/destructuring-assignment */
    this.props.updateAtbdVersion(atbd.atbd_id, atbd_version, { status: 'Published' });
  }

  async onDeleteClick({ title, atbd_id }, e) {
    e.preventDefault();
    const res = await confirmDeleteDoc(title);
    /* eslint-disable-next-line react/destructuring-assignment */
    if (res.result) this.props.deleteAtbd(atbd_id);
  }

  onSearchChange(searchCurrent) {
    this.setState({ searchCurrent });
  }

  onSearch(searchValue) {
    this.setState({ searchValue }, () => {
      const qString = this.qsState.getQs(this.state);
      /* eslint-disable-next-line react/destructuring-assignment */
      this.props.push({ search: qString });
    });
  }

  setFilterValue(what, value, e) {
    e.preventDefault();
    this.setState(state => ({
      filter: {
        ...state.filter,
        [what]: value
      }
    }), () => {
      const qString = this.qsState.getQs(this.state);
      /* eslint-disable-next-line react/destructuring-assignment */
      this.props.push({ search: qString });
    });
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
    const {
      atbd_id, title, atbd_versions, contacts
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
          <Link to={`/atbds/${atbd_id}`} title="View this ATBD">
            <strong>
              <TextHighlight
                value={searchValue}
                disabled={!title}
              >
                {title || 'Untitled Document'}
              </TextHighlight>
            </strong>
          </Link>
        </DocTableBodyThTitle>
        <DocTableBodyTdAuthors title={contact}>
          <span>{contact}</span>
        </DocTableBodyTdAuthors>
        <DocTableBodyTdActions>
          <PreviewButton atbd_id={atbd_id} atbd_version={1} />
          <Dropdown
            alignment="middle"
            direction="left"
            triggerElement={(
              <DocTableActionsTrigger
                variation="primary-plain"
                size="small"
                title="View Document options"
                hideText
              >
                Actions
              </DocTableActionsTrigger>
            )}
          >
            <DropTitle>Document actions</DropTitle>
            <DropMenu role="menu" iconified>
              <li>
                <DocTableActionPreview title="Preview document">
                  Preview
                </DocTableActionPreview>
              </li>
              <li>
                <DocTableActionPublish
                  title="Publish document"
                  onClick={this.onUpdateClick.bind(this, atbd)}
                >
                  Publish
                </DocTableActionPublish>
              </li>
              <li>
                <DocTableActionEdit
                  title="Edit document"
                  onClick={this.onEditClick.bind(this, atbd)}
                >
                  Edit
                </DocTableActionEdit>
              </li>

            </DropMenu>
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
          </Dropdown>
        </DocTableBodyTdActions>
      </tr>
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
        {searchValue && <ResultsHeading>Showing {atbds.length} result{atbds.length > 1 ? 's' : ''} for <em>{searchValue}</em></ResultsHeading>}
        {this.renderAtbdTable()}
      </React.Fragment>
    );
  }

  render() {
    const { createAtbd: create } = this.props;
    const { filter: { status: filterStatus }, searchCurrent, searchValue } = this.state;
    const activeFilter = atbdStatusOptions.find(o => o.id === filterStatus) || {};

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

                  <InpageFilters>
                    <FilterItem>
                      <FilterLabel>Status</FilterLabel>
                      <Dropdown
                        alignment="left"
                        triggerElement={(
                          <FilterTrigger
                            variation="achromic-plain"
                            title="Toggle menu options"
                          >
                            {activeFilter.label || 'All'}
                          </FilterTrigger>
                        )}
                      >
                        <DropTitle>Select status</DropTitle>
                        <DropMenu role="menu" selectable>
                          <li>
                            <DropMenuItem
                              active={filterStatus === 'all'}
                              onClick={this.setFilterValue.bind(this, 'status', 'all')}
                              data-hook="dropdown:close"
                            >
                              All
                            </DropMenuItem>
                          </li>
                          {atbdStatusOptions.map(o => (
                            <li key={o.id}>
                              <DropMenuItem
                                active={filterStatus === o.id}
                                onClick={this.setFilterValue.bind(this, 'status', o.id)}
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

                  <InpageToolbar>
                    <SearchControl
                      onChange={this.onSearchChange}
                      onSearch={this.onSearch}
                      value={searchCurrent}
                      lastSearch={searchValue}
                    />
                    <CreateButton
                      variation="achromic-plain"
                      title="Create new document"
                      onClick={create}
                    >
                      Create
                    </CreateButton>
                  </InpageToolbar>
                </InpageHeaderInner>
              </InpageHeader>
            )}
          </Sticky>
          <InpageBody>
            <InpageBodyInner>
              {this.renderPageContent()}
            </InpageBodyInner>
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
  updateAtbdVersion: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const { atbds } = state.application;
  return { atbds };
};

const mapDispatch = {
  push, createAtbd, deleteAtbd, updateAtbdVersion
};

export default connect(
  mapStateToProps,
  mapDispatch
)(AtbdList);
