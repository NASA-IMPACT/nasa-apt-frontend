import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { rgba, themeVal } from '@devseed-ui/theme-provider';
import Pill from './pill';

const StatusSelf = styled(Pill)`
  width: 6rem;

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
`;

const isDraft = (status) => status.toLowerCase() === 'draft';

function StatusPill(props) {
  const { status, completeness } = props;

  return (
    <StatusSelf value={isDraft(status) ? completeness : 100}>
      {isDraft(status) ? `Draft: ${completeness}%` : 'Published'}
    </StatusSelf>
  );
}

StatusPill.propTypes = {
  status: T.string,
  completeness: T.number
};

export default StatusPill;
