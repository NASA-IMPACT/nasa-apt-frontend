import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled, { css } from 'styled-components/macro';

import Button from '../../styles/button/button';
import collecticon from '../../styles/collecticons';

import FormInput from '../../styles/form/input';

// Styled components.

const SearchButton = styled(Button)`
  &::before {
    ${collecticon('magnifier-right')};
  }
`;

const SearchFormInput = styled(FormInput)`
  ${({ hidden }) => hidden ? css`
    display: none;
  ` : ''}
`;

const CloseButton = styled(Button).attrs({
  variation: 'achromic-plain',
  size: 'medium',
  hideText: true
})`
  &::before {
    ${collecticon('xmark--small')}
  }

  ${({ hidden }) => hidden ? css`
    display: none;
  ` : ''}
`;

class SearchControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userExpanded: false
    };

    this.inputFieldRef = React.createRef();

    this.onFieldBlur = this.onFieldBlur.bind(this);
    this.onFieldFocus = this.onFieldFocus.bind(this);
    this.onFieldKeydown = this.onFieldKeydown.bind(this);
    this.onSearchButtonClick = this.onSearchButtonClick.bind(this);
    this.onResetButtonClick = this.onResetButtonClick.bind(this);
    this.onSearchFieldValueChange = this.onSearchFieldValueChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { userExpanded } = this.state;
    if (!prevState.userExpanded && userExpanded) {
      this.inputFieldRef.current.focus();
    }
  }

  isExpanded() {
    const { userExpanded } = this.state;
    const { value } = this.props;

    return userExpanded || !!value.trim();
  }

  onFieldKeydown(e) {
    const { onSearch, value } = this.props;
    const { keyCode } = e;
    // enter
    if (keyCode === 13) {
      e.preventDefault();
      onSearch(value);
    }
    // esc
    if (keyCode === 27) {
      this.onResetButtonClick(e);
    }
  }

  onFieldFocus() {
    // As soon as the field is focused, consider it expanded by the user.
    const { userExpanded } = this.state;
    if (!userExpanded) {
      this.setState({ userExpanded: true });
    }
  }

  onFieldBlur() {
    const { value, onSearch } = this.props;
    if (!value.trim()) {
      onSearch('');
      this.setState({ userExpanded: false });
    }
  }

  onSearchButtonClick(e) {
    e.preventDefault();
    const { userExpanded } = this.state;
    const { onSearch, value } = this.props;
    if (!userExpanded) {
      this.setState({ userExpanded: true });
    } else {
      onSearch(value);
    }
  }

  onResetButtonClick(e) {
    e.preventDefault();
    const { onChange, onSearch } = this.props;
    onChange('');
    onSearch('');
    this.setState({ userExpanded: false });
  }

  onSearchFieldValueChange(e) {
    const { onChange } = this.props;
    onChange(e.target.value);
  }

  render() {
    const { className, value } = this.props;

    const expanded = this.isExpanded();

    return (
      <div className={className}>
        <SearchButton
          variation="achromic-plain"
          title="Search documents"
          hideText={expanded}
          onClick={this.onSearchButtonClick}
        >
          Search
        </SearchButton>
        <SearchFormInput
          ref={this.inputFieldRef}
          hidden={!expanded}
          type="text"
          size="medium"
          placeholder="Search"
          value={value}
          onChange={this.onSearchFieldValueChange}
          onBlur={this.onFieldBlur}
          onFocus={this.onFieldFocus}
          onKeyDown={this.onFieldKeydown}
        />
        <CloseButton
          onClick={this.onResetButtonClick}
          hidden={!expanded}
        >
          Clear Search
        </CloseButton>
      </div>
    );
  }
}

export default styled(SearchControl)`
  display: flex;
`;

SearchControl.propTypes = {
  onChange: T.func,
  onSearch: T.func,
  className: T.string,
  value: T.string,
};
