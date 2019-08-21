import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Popper } from 'react-popper';
import styled from 'styled-components/macro';
import { rgba } from 'polished';
import collecticon from '../../../styles/collecticons';
import FormInput from '../../../styles/form/input';
import Button from '../../../styles/button/button';
import ButtonGroup from '../../../styles/button/group';
import { stylizeFunction, themeVal } from '../../../styles/utils/general';
import { isDescendant } from './utils';

const _rgba = stylizeFunction(rgba);

const UrlInput = styled(FormInput)`
  width: 20rem;
`;

const makeLinkEditorButton = icon => styled(Button).attrs({
  hideText: true,
  variation: 'base-raised-light',
  size: 'large'
})`
  ::before {
    ${collecticon(icon)}
  }
`;

const ConfirmButton = makeLinkEditorButton('tick--small');
const DeleteButton = makeLinkEditorButton('trash-bin');

const LinkEditorWrapper = styled.div`
  display: flex;
  box-shadow: 0 2px 6px 0 ${_rgba(themeVal('color.base'), 0.16)};

  ${UrlInput} {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  ${Button}:first-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  ${ConfirmButton},
  ${DeleteButton} {
    box-shadow: inset 0 1px 0 0px ${_rgba(themeVal('color.base'), 0.16)},
      inset 0 -1px 0 0px ${_rgba(themeVal('color.base'), 0.16)},
      inset -1px 0px 0 0px ${_rgba(themeVal('color.base'), 0.16)};
  }
`;

export default class LinkEditorToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      urlValue: props.value
    };

    this.urlEditorRef = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onOutsideClick = this.onOutsideClick.bind(this);
    this.onConfirmClick = this.onConfirmClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);

    // Every time there's a click outside the bar, it should be hidden, but
    // when switching from one link to the other it shouldn't.
    // In this case the input field value should be updated.
    // Since the outside click event fires anyway, we prevent it if the click
    // triggered a value change.
    this.blockNextOutsideClick = false;
  }

  componentDidMount() {
    document.addEventListener('click', this.onOutsideClick);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    if (value !== nextProps.value) {
      this.blockNextOutsideClick = true;
      this.setState({ urlValue: nextProps.value }, () => this.urlEditorRef.current.inputRef.current.focus());
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  onOutsideClick(e) {
    const { onCancel } = this.props;
    const isInside = isDescendant(
      e.target,
      this.urlEditorRef.current.editorWrapperRef.current
    );

    if (!this.blockNextOutsideClick && this.urlEditorRef.current && !isInside) {
      onCancel();
    }
    this.blockNextOutsideClick = false;
  }

  onChange(e) {
    this.setState({ urlValue: e.currentTarget.value });
  }

  onConfirmClick(e) {
    e.preventDefault();
    const { urlValue } = this.state;
    const { onConfirm } = this.props;
    onConfirm(urlValue);
  }

  onDeleteClick(e) {
    e.preventDefault();
    const { onDelete } = this.props;
    onDelete();
  }

  handleKeyPress(e) {
    const { onConfirm, onCancel } = this.props;
    const { urlValue } = this.state;

    const { keyCode } = e;
    // enter
    if (keyCode === 13) {
      e.preventDefault();
      onConfirm(urlValue);
      this.setState({ urlValue: '' });
    }
    // esc
    if (keyCode === 27) {
      e.preventDefault();
      onCancel();
      this.setState({ urlValue: '' });
    }
  }

  renderUrlEditor() {
    const { urlValue } = this.state;
    return (
      <LinkEditor
        ref={this.urlEditorRef}
        value={urlValue}
        onChange={this.onChange}
        onKeyDown={this.handleKeyPress}
        onConfirmClick={this.onConfirmClick}
        onDeleteClick={this.onDeleteClick}
      />
    );
  }

  render() {
    const { range } = this.props;

    if (!range) return null;
    // Check if something is selected
    const { width } = range.getBoundingClientRect();
    if (width === 0) return null;

    return (
      <Popper referenceElement={range} placement="top-center">
        {({ ref, style, placementA }) => (
          <div
            ref={ref}
            style={{ ...style, zIndex: 100 }}
            data-placement={placementA}
          >
            {this.renderUrlEditor()}
          </div>
        )}
      </Popper>
    );
  }
}

LinkEditorToolbar.propTypes = {
  range: T.object,
  value: T.string,
  onConfirm: T.func,
  onCancel: T.func,
  onDelete: T.func
};

export class LinkEditor extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.editorWrapperRef = React.createRef();
  }

  componentDidMount() {
    // Without the setTimeout the page jumps to the top when the field
    // gets focused.
    setTimeout(() => this.inputRef.current.focus(), 1);
  }

  render() {
    const {
      value,
      onChange,
      onBlur,
      onKeyDown,
      onConfirmClick,
      onDeleteClick
    } = this.props;

    return (
      <LinkEditorWrapper ref={this.editorWrapperRef}>
        <UrlInput
          type="text"
          id="url-editor"
          size="large"
          placeholder="Enter a URL"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          ref={this.inputRef}
        />
        <ButtonGroup orientation="horizontal">
          <ConfirmButton onClick={onConfirmClick} title="Insert link">Insert Link</ConfirmButton>
          <DeleteButton onClick={onDeleteClick} title="Remove link">Remove Link</DeleteButton>
        </ButtonGroup>
      </LinkEditorWrapper>
    );
  }
}

LinkEditor.propTypes = {
  value: T.string,
  onChange: T.func,
  onBlur: T.func,
  onKeyDown: T.func,
  onConfirmClick: T.func,
  onDeleteClick: T.func
};
