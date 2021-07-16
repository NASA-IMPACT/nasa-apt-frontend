import React from 'react';
import { Tooltip } from 'react-tippy';

// Tooltip element with sensible defaults
export default function Tip(props) {
  return (
    <Tooltip
      arrow
      duration={160}
      theme='apt'
      animation='scale'
      style={{ display: 'inline-flex' }}
      {...props}
    />
  );
}
