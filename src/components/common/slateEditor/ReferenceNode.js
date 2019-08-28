import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import styled, { css } from 'styled-components/macro';
import { Manager, Reference, Popper } from 'react-popper';
import { isDescendant } from './utils';
import ButtonGroup from '../../../styles/button/group';
import { themeVal, stylizeFunction } from '../../../styles/utils/general';
import Button from '../../../styles/button/button';
import collecticon from '../../../styles/collecticons';

const _rgba = stylizeFunction(rgba);

const ReferenceNodeSup = styled.sup`
  margin-left: 0.125rem;
  text-decoration: underline;

  ${({ isFocused }) => isFocused && css`
    border: 1px dotted;
  `}

  * {
    text-decoration: none;
  }
`;

const DeleteButton = styled(Button).attrs({
  hideText: true,
  variation: 'base-raised-light',
  size: 'large'
})`
  ::before {
    ${collecticon('trash-bin')}
  }
`;

const ReferenceToolbarWrapper = styled.div`
  display: flex;
  box-shadow: 0 2px 6px 0 ${_rgba(themeVal('color.base'), 0.16)};

  ${Button}:first-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  ${DeleteButton} {
    box-shadow: inset 0 1px 0 0px ${_rgba(themeVal('color.base'), 0.16)},
      inset 0 -1px 0 0px ${_rgba(themeVal('color.base'), 0.16)},
      inset -1px 0px 0 0px ${_rgba(themeVal('color.base'), 0.16)};
  }
`;

const ReferenceName = styled.p`
  pointer-events: none;
  background-color: #fff;
  box-shadow: inset 0 0 0 1px ${_rgba(themeVal('color.base'), 0.16)};
  border-top-left-radius: ${themeVal('shape.rounded')};
  border-bottom-left-radius: ${themeVal('shape.rounded')};
  padding: 0.5rem 1rem;
`;

export default class ReferenceNode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.onRefClick = this.onRefClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);

    this.refTextNode = null;
  }

  onRefClick(e) {
    e.preventDefault();
    const { editor, node } = this.props;
    editor.moveAnchorToStartOfNode(node).moveFocusToStartOfNode(node);
    this.setState({ visible: true });
  }

  onDeleteClick(e) {
    e.preventDefault();
    const { editor, node } = this.props;
    this.setState({ visible: false });
    editor.removeNodeByKey(node.key);
  }

  render() {
    const { node, isFocused } = this.props;
    const { visible } = this.state;

    const name = node.data.get('name');

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <ReferenceNodeSup
              ref={(el) => {
                this.refTextNode = el;
                return ref(el);
              }}
              onClick={this.onRefClick}
              isFocused={isFocused}
            >
              {node.text}
            </ReferenceNodeSup>
          )}
        </Reference>
        {visible
          && ReactDOM.createPortal(
            <Popper placement="top-center">
              {({ ref, style, placement }) => (
                <div ref={ref} style={style} data-placement={placement}>
                  <ReferenceToolbar
                    onClose={() => this.setState({ visible: false })}
                    name={name}
                    onDeleteClick={this.onDeleteClick}
                  />
                </div>
              )}
            </Popper>,
            document.querySelector('#root')
          )}
      </Manager>
    );
  }
}

ReferenceNode.propTypes = {
  node: PropTypes.object,
  editor: PropTypes.object,
  isFocused: PropTypes.bool
};

class ReferenceToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.onOutsideClick = this.onOutsideClick.bind(this);

    this.popoverInnerRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('click', this.onOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick);
  }

  onOutsideClick(e) {
    const { onClose } = this.props;
    if (!this.popoverInnerRef.current) return;

    if (!isDescendant(e.target, this.popoverInnerRef.current)) {
      onClose();
    }
  }

  render() {
    const { name, onDeleteClick } = this.props;

    return (
      <ReferenceToolbarWrapper ref={this.popoverInnerRef}>
        <ReferenceName>{name}</ReferenceName>
        <ButtonGroup orientation="horizontal">
          <DeleteButton onClick={onDeleteClick} title="Remove reference">
            Remove reference
          </DeleteButton>
        </ButtonGroup>
      </ReferenceToolbarWrapper>
    );
  }
}

ReferenceToolbar.propTypes = {
  name: PropTypes.string,
  onClose: PropTypes.func,
  onDeleteClick: PropTypes.func
};
