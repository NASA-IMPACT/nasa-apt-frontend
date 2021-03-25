import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@devseed-ui/button';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

// The close button is set globally in the toast container.
export const CloseButton = ({ closeToast }) => (
  <Button
    className='toast-close-button'
    variation='achromic-plain'
    size='small'
    hideText
    useIcon='xmark--small'
    onClick={closeToast}
  >
    Dismiss notification
  </Button>
);

CloseButton.propTypes = {
  closeToast: PropTypes.func
};

export default toast;

export const ToastsContainer = styled(ToastContainer).attrs({
  position: toast.POSITION.BOTTOM_RIGHT,
  closeButton: CloseButton
})`
  padding: 0;

  .Toastify__toast-container--top-left {
    top: ${glsp()};
    left: ${glsp()};
  }

  .Toastify__toast-container--top-center {
    top: ${glsp()};
  }

  .Toastify__toast-container--top-right {
    top: ${glsp()};
    right: ${glsp()};
  }

  .Toastify__toast-container--bottom-left {
    bottom: ${glsp()};
    left: ${glsp()};
  }

  .Toastify__toast-container--bottom-center {
    bottom: ${glsp()};
  }

  .Toastify__toast-container--bottom-right {
    bottom: ${glsp()};
    right: ${glsp()};
  }

  .Toastify__toast {
    margin-bottom: 0;
    padding: ${glsp()};
    font-family: ${themeVal('type.base.family')};
    border-radius: ${themeVal('shape.rounded')};

    &:not(:last-child) {
      margin-bottom: ${glsp()};
    }

    .toast-close-button {
      margin: ${glsp(-0.5, -0.5, 0, 0)};
      align-self: flex-start;
    }
  }

  .Toastify__toast--default {
    background: ${themeVal('color.surface')};
    color: ${themeVal('type.base.color')};
  }

  .Toastify__toast--info {
    background: ${themeVal('color.info')};
  }

  .Toastify__toast--success {
    background: ${themeVal('color.success')};
  }

  .Toastify__toast--warning {
    background: ${themeVal('color.warning')};
  }

  .Toastify__toast--error {
    background: ${themeVal('color.danger')};
  }
`;
