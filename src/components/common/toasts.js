import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { toast } from 'react-toastify';

import collecticon from '../../styles/collecticons';

import Button from '../../styles/button/button';

const ButtonIconXmark = styled(Button)`
  transform: translate(0.25rem, -0.25rem);

  ::before {
    ${collecticon('xmark--small')}
  }
`;

// The close button is set globally in the toast container.
export const CloseButton = ({ closeToast }) => (
  <ButtonIconXmark
    className="toast-close-button"
    variation="achromic-plain"
    size="small"
    hideText
    onClick={closeToast}
  >
    Dismiss notification
  </ButtonIconXmark>
);

CloseButton.propTypes = {
  closeToast: PropTypes.func
};

// TODO: Add a content wrapper to the toasts for easy styling.
const toasts = {
  error: (content, opts) => toast.error(content, opts),
  success: (content, opts) => toast.success(content, opts),
  info: (content, opts) => toast.info(content, opts),
  warn: (content, opts) => toast.warn(content, opts)
};

export default toasts;
