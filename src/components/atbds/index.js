import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';
import styled from 'styled-components/macro';
import { rgba } from 'polished';
import { push } from 'connected-react-router';
import { createAtbd, deleteAtbd } from '../../actions/actions';
import {
  atbdsedit,
  drafts,
  identifying_information
} from '../../constants/routes';
import { themeVal, stylizeFunction } from '../../styles/utils/general';
import { divide } from '../../styles/utils/math';

import { visuallyHidden, truncated, antialiased } from '../../styles/helpers';
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

const _rgba = stylizeFunction(rgba);

const SearchButton = styled(Button)`
  &::before {
    ${collecticon('magnifier-right')};
  }
`;

const CreateButton = styled(Button)`
  &::before {
    ${collecticon('plus')};
  }
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

const AtbdPublishedState = styled.span`
  ${antialiased}
  display: flex;
  justify-content: center;
  padding: 0 ${divide(themeVal('layout.space'), 2)};
  background-color: ${_rgba(themeVal('color.base'), 0.64)};
  border-radius: ${themeVal('shape.ellipsoid')};
  color: #fff;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: ${themeVal('type.base.bold')};
  line-height: 1.5rem;
  min-width: 6rem;
`;

const FilterTrigger = styled(Button)`
  &::after {
    ${collecticon('chevron-down--small')}
  }
`;

const AtbdList = (props) => {
  const { atbds, createAtbd: create, deleteAtbd: deleteatbd } = props;

  const atbdElements = atbds.map((atbd) => {
    const {
      atbd_id, title, atbd_versions, contacts
    } = atbd;
    let contact = '';
    if (contacts[0] !== undefined) {
      contact = `${contacts[0].first_name} ${contacts[0].last_name}`;
    }
    const { status } = atbd_versions[0];
    return (
      <tr key={atbd_id}>
        <td>
          <AtbdPublishedState>{status}</AtbdPublishedState>
        </td>
        <DocTableBodyThTitle scope="row">
          <Link to={`/atbds/${atbd_id}`} title="View this ATBD">
            <strong>{title || 'Untitled Document'}</strong>
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
                <DocTableActionPublish title="Publish document">
                  Publish
                </DocTableActionPublish>
              </li>
              <li>
                <DocTableActionEdit
                  title="Edit document"
                  onClick={() => props.push(
                    `/${atbdsedit}/${atbd_id}/${drafts}/1/${identifying_information}`
                  )}
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
                  onClick={async () => {
                    const res = await confirmDeleteDoc(title);
                    if (res.result) deleteatbd(atbd_id);
                  }}
                >
                  Delete
                </DocTableActionDelete>
              </li>
            </DropMenu>
          </Dropdown>
        </DocTableBodyTdActions>
      </tr>
    );
  });
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
                          All
                        </FilterTrigger>
                      )}
                    >
                      <DropTitle>Select status</DropTitle>
                      <DropMenu role="menu" selectable>
                        <li>
                          <DropMenuItem active>All</DropMenuItem>
                        </li>
                        <li>
                          <DropMenuItem>Published</DropMenuItem>
                        </li>
                        <li>
                          <DropMenuItem>Draft</DropMenuItem>
                        </li>
                      </DropMenu>
                    </Dropdown>
                  </FilterItem>
                </InpageFilters>

                <InpageToolbar>
                  <SearchButton
                    variation="achromic-plain"
                    title="Search documents"
                    disabled
                  >
                    Search
                  </SearchButton>
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
              <tbody>{atbdElements}</tbody>
            </DocTable>
          </InpageBodyInner>
        </InpageBody>
      </StickyContainer>
    </Inpage>
  );
};

AtbdList.propTypes = {
  atbds: PropTypes.arrayOf(
    PropTypes.shape({
      atbd_id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    })
  ),
  push: PropTypes.func,
  createAtbd: PropTypes.func.isRequired,
  deleteAtbd: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const { atbds } = state.application;
  return { atbds };
};

const mapDispatch = { push, createAtbd, deleteAtbd };

export default connect(
  mapStateToProps,
  mapDispatch
)(AtbdList);
