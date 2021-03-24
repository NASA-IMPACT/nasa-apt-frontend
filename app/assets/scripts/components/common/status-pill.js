import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { rgba, themeVal } from '@devseed-ui/theme-provider';

const StatusSelf = styled.strong`
  position: relative;
  display: block;
  height: 1.25rem;
  width: 6rem;
  font-size: 0.75rem;
  font-weight: ${themeVal('type.base.bold')};
  text-transform: uppercase;
  color: ${themeVal('color.baseLight')};
  text-align: center;
  background-color: ${rgba(themeVal('color.base'), 0.48)};
  border-radius: ${themeVal('shape.ellipsoid')};
  overflow: hidden;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1;
    width: ${({ value }) => `${value}%`};
    content: '';
    pointer-events: none;
    background-color: ${rgba(themeVal('color.base'), 0.32)};
  }

  > * {
    position: relative;
    z-index: 2;
  }
`;

const isDraft = (status) => status.toLowerCase() === 'draft';

function StatusPill(props) {
  const { status, completeness } = props;

  return (
    <StatusSelf value={isDraft(status) ? completeness : 100}>
      <span>{isDraft(status) ? `Draft: ${completeness}%` : 'Published'}</span>
    </StatusSelf>
  );
}

StatusPill.propTypes = {
  status: T.string,
  completeness: T.number
};

export default StatusPill;
