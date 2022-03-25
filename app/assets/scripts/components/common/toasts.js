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

/**
 * Creates a toast system so display in sequence.
 * Starts with a default toast, which is non dismissible and then shows an error
 * or success one.
 *
 * We're using an helper for this because we have to undo all the "blocking"
 * when updating the toast.
 *
 * @param {string} msg Initial message
 */
export const createProcessToast = (msg) => {
  const toastId = toast(msg, {
    closeOnClick: false,
    closeButton: false,
    autoClose: false,
    draggable: false
  });

  return {
    success: (successMsg) =>
      toast.update(toastId, {
        type: toast.TYPE.SUCCESS,
        render: successMsg,
        closeOnClick: true,
        closeButton: true,
        autoClose: 3000,
        draggable: true
      }),
    error: (errorMsg) =>
      toast.update(toastId, {
        type: toast.TYPE.ERROR,
        render: errorMsg,
        closeOnClick: true,
        closeButton: true,
        draggable: true
      })
  };
};

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
