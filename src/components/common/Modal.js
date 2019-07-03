/* global document */
import React from 'react';
import { createPortal } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import styled, { createGlobalStyle } from 'styled-components/macro';
import { rgba } from 'polished';

import { themeVal, stylizeFunction } from '../../styles/utils/general';
import { multiply } from '../../styles/utils/math';
import collecticons from '../../styles/collecticons';

import Button from '../../styles/button/button';

const _rgba = stylizeFunction(rgba);

const sizeMapping = {
  small: '32rem',
  medium: '48rem',
  large: '64rem',
  xlarge: '80rem',
  full: '100%'
};

const ModalInner = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto;
  grid-auto-rows: 1fr;
  background: ${themeVal('color.surface')};
  border-radius: ${themeVal('shape.rounded')};
  overflow: hidden;
  width: 100%;
  margin: ${multiply(themeVal('layout.space'), 2)};
  box-shadow: 0 0 32px 2px ${_rgba(themeVal('color.base'), 0.04)}, 0 16px 48px -16px ${_rgba(themeVal('color.base'), 0.12)};

  /* Size attribute */
  ${({ size }) => `max-width: ${sizeMapping[size]};`}

  > *:last-child {
    margin-bottom: 0;
  }
`;

const ModalWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9990;
  overflow-y: auto;
  opacity: 1;
  visibility: visible;
  background: radial-gradient(farthest-side, #fff, ${_rgba(themeVal('color.surface'), 0.64)});
  transform: translate3d(0, 0, 0);

  &.modal-appear,
  &.modal-enter {
    opacity: 0;
    visibility: hidden;
  }

  &.modal-enter-appear,
  &.modal-enter-active {
    transition: opacity 0.32s ease 0s, visibility 0.32s linear 0s;
    opacity: 1;
    visibility: visible;
  }

  &.modal-exit {
    opacity: 1;
    visibility: visible;
  }

  &.modal-exit-active {
    transition: opacity 0.32s ease 0s, visibility 0.32s linear 0s;
    opacity: 0;
    visibility: hidden;
  }
`;

const ModalClose = styled(Button)`
  &::before {
    ${collecticons('xmark--small')}
  }
`;

const BodyUnscrollable = createGlobalStyle`
  ${({ revealed }) => revealed
    && `
    body {
      overflow-y: hidden;
    }
  `}
`;

/**
 * React modal component.
 * The Modal component provides 3 sections for content.
 * - Header
 * - Body
 * - Footer
 *
 * A property is used to define the element rendered in each section respectively;
 * - headerComponent
 * - bodyComponent
 * - footerComponent
 *
 * For convenience the modal module exports several elements to be used as
 * defaults or as base for overrides by stayled-components.
 *
 * Available properties listed as parameters:
 *
 * @param {string} id An id for the modal
 * @param {bool} revealed Whether or not the modal is visible.
 * @param {string} className
 * @param {func} onOverlayClick Callback function for overlay click
 * @param {func} onCloseClick Callback function for close button click
 * @param {node} headerComponent Component for the header. Unless there's a
 *               specific need, the ModalHeader should be imported and used.
 * @param {node} bodyComponent Component for the body. Unless there's a
 *               specific need, the ModalBody should be imported and used.
 * @param {node} footerComponent Component for the footer. Unless there's a
 *               specific need, the ModalFooter should be imported and used.
 * @param {node} toolbarComponent Component for the toolbar. A default toolbar
 *               with a close button is automatically added to the header. If an
 *               override is needed used this, importing the ModalToolbar
 *               wrapper and adding the custom content.
 *
 * @example
 * const SpecialFooter = styled(ModalFooter)` color: papaia; `;
 *  <Modal
 *    id='modal'
 *    revealed={true}
 *    onCloseClick={() => {}}
 *    headerComponent={(
 *      <ModalHeader>
 *        <h1>This is the header</h1>
 *      </ModalHeader>
 *    )}
 *    bodyComponent={(
 *      <ModalBody>hello</ModalBody>
 *    )}
 *    footerComponent={(
 *      <SpecialFooter>footer</SpecialFooter>
 *    )}
 *  />
 */
export class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.componentAddedBodyClass = false;

    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.keyListener = this.keyListener.bind(this);

    this.el = document.createElement('div');
    this.uid = Math.random()
      .toString(36)
      .substr(2, 8);
    this.el.className = `modal-portal-${this.uid}`;
    this.rootEl = document.body;
    if (!this.rootEl) throw new Error('Portal root element does not exist.');
  }

  componentDidMount() {
    document.addEventListener('keyup', this.keyListener);
    this.rootEl.appendChild(this.el);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.keyListener);
    this.rootEl.removeChild(this.el);
  }

  keyListener(e) {
    const { revealed, onCloseClick } = this.props;

    if (revealed && e.keyCode === 27) {
      // ESC.
      e.preventDefault();
      onCloseClick();
    }
  }

  onOverlayClick(e) {
    const { onOverlayClick } = this.props;
    // Prevent children from triggering this.
    if (e.target === e.currentTarget && typeof onOverlayClick === 'function') {
      // Overlay click is disabled.
      onOverlayClick.call(this, e);
    }
  }

  onCloseClick(e) {
    e.preventDefault();
    // eslint-disable-next-line
    this.props.onCloseClick(e);
  }

  render() {
    const {
      className,
      revealed,
      id,
      size,
      onCloseClick,
      headerComponent,
      bodyComponent,
      footerComponent,
      toolbarComponent
    } = this.props;
    const klasses = ['modal', ...(className || [])];

    // The toolbar contains the close button by default.
    // If a new component is provided it is overridden.
    const toolbar = toolbarComponent || (
      <ModalToolbar>
        <ModalClose
          variation="base-plain"
          title="Close"
          hideText
          onClick={onCloseClick}
        >
          Close
        </ModalClose>
      </ModalToolbar>
    );

    const header = React.cloneElement(headerComponent, headerComponent.props, [
      ...React.Children.toArray(headerComponent.props.children),
      React.cloneElement(toolbar, { ...toolbar.props, key: `modal-${this.uid}-toolbar` })
    ]);

    return createPortal(
      <CSSTransition
        in={revealed}
        appear
        unmountOnExit
        classNames="modal"
        timeout={{ enter: 400, exit: 400 }}
      >
        <ModalWrapper
          className={klasses.join(' ')}
          key={`modal-${id}`}
          onClick={this.onOverlayClick}
          id={id}
        >
          <BodyUnscrollable revealed={revealed} />
          <ModalInner className="modal__inner" size={size}>
            {header}
            {bodyComponent}
            {footerComponent}
          </ModalInner>
        </ModalWrapper>
      </CSSTransition>,
      this.el
    );
  }
}

Modal.defaultProps = {
  revealed: false,
  size: 'medium',

  onOverlayClick: () => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Modal', 'onOverlayClick handler not implemented');
    }
  },

  onCloseClick: () => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Modal', 'onCloseClick handler not implemented');
    }
  }
};

if (process.env.NODE_ENV !== 'production') {
  Modal.propTypes = {
    id: T.string.isRequired,
    revealed: T.bool,
    className: T.string,
    size: T.string,
    onOverlayClick: T.func,
    onCloseClick: T.func,
    headerComponent: T.node.isRequired,
    bodyComponent: T.node.isRequired,
    footerComponent: T.node,
    toolbarComponent: T.node
  };
}

export const ModalToolbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin-left: auto;
  align-items: center;
  align-self: flex-start;
`;

export const ModalHeader = styled.header`
  position: relative;
  z-index: 10;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background: #fff;
  padding: ${multiply(themeVal('layout.space'), 1.5)} ${multiply(themeVal('layout.space'), 2)};
  box-shadow: 0 0 0 1px ${themeVal('color.mist')};
  min-height: 4rem;

  & > *:last-child {
    margin-bottom: 0;
  }
`;

export const ModalBody = styled.div`
  padding: ${multiply(themeVal('layout.space'), 1.5)} ${multiply(themeVal('layout.space'), 2)};

  & > *:last-child {
    margin-bottom: 0;
  }
`;

export const ModalTitle = styled.h1`
  font-size: 1.25rem;
  line-height: 2rem;
  margin: 0;
`;

export const ModalFooter = props => <footer {...props} />;
