import React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';

const StyledTooltip = styled(Tooltip)`
  display: inline-flex !important;
`;

// Tooltip element with sensible defaults
export default function Tip(props) {
  return (
    <StyledTooltip
      arrow
      duration={160}
      theme='apt'
      animation='scale'
      {...props}
    />
  );
}
