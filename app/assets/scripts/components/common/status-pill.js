import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';

import { glsp, rgba, themeVal } from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';

import Pill from './pill';
import { calculateDocumentCompleteness } from '../documents/completeness';

const StatusSelf = styled(Pill)`
  min-width: 6rem;

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

  ${({ useIcon }) =>
    useIcon &&
    css`
      &::after {
        ${collecticon(useIcon)}
        z-index: 2;
        margin-left: ${glsp(0.25)};
      }
    `}
`;

const statusMapping = {
  Draft: 'Draft',
  'closed-review': 'In closed review',
  'in-review': 'In review',
  'in-publication': 'In publication',
  Published: 'Published'
};

const journalStatusIcons = {
  submitted: 'page',
  published: 'page-tick'
};

function StatusPill(props) {
  const { status, fillPercent, completeness, statusIcon } = props;

  const value = typeof fillPercent === 'number' ? fillPercent : 100;

  return (
    <StatusSelf value={value} useIcon={statusIcon}>
      {status}
      {completeness ? `: ${completeness}` : null}
    </StatusSelf>
  );
}

StatusPill.propTypes = {
  status: T.string,
  completeness: T.string,
  fillPercent: T.number,
  statusIcon: T.string
};

export default StatusPill;

export function DocumentStatusPill(props) {
  const { atbdVersion } = props;
  const { status } = atbdVersion;

  if (status === 'Draft') {
    const { percent } = calculateDocumentCompleteness(atbdVersion);
    return (
      <StatusPill
        status={statusMapping[status]}
        fillPercent={percent}
        completeness={`${percent}%`}
      />
    );
  }

  // TODO: Other statuses
  else {
    const journalStatus = null; // TODO: compute
    return (
      <StatusPill
        status={statusMapping[status]}
        statusIcon={journalStatusIcons[journalStatus]}
      />
    );
  }
}

DocumentStatusPill.propTypes = {
  atbdVersion: T.object
};
