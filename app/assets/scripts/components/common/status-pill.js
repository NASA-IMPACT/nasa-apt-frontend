import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';

import { glsp, rgba, themeVal } from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';

import Pill from './pill';
import { calculateDocumentCompleteness } from '../documents/completeness';
import {
  getDocumentStatusLabel,
  isClosedReview,
  isDraft,
  isReviewRequested,
  REVIEW_DONE
} from '../documents/status';

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

const journalStatusIcons = {
  submitted: 'page',
  published: 'page-tick'
};

function StatusPill(props) {
  const { status, fillPercent, completeness, statusIcon, ...rest } = props;

  const value = typeof fillPercent === 'number' ? fillPercent : 100;

  return (
    <StatusSelf value={value} useIcon={statusIcon} {...rest}>
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
  const { atbdVersion, ...rest } = props;

  if (isDraft(atbdVersion) || isReviewRequested(atbdVersion)) {
    const { percent } = calculateDocumentCompleteness(atbdVersion);
    return (
      <StatusPill
        status={getDocumentStatusLabel(atbdVersion)}
        fillPercent={percent}
        completeness={`${percent}%`}
        {...rest}
      />
    );
  } else if (isClosedReview(atbdVersion)) {
    const revTotal = atbdVersion.reviewers.length;
    const revCompleted = atbdVersion.reviewers.filter(
      (r) => r.review_status === REVIEW_DONE
    ).length;
    const percent = (revCompleted / revTotal) * 100;

    return (
      <StatusPill
        status={getDocumentStatusLabel(atbdVersion)}
        fillPercent={percent}
        completeness={`${revCompleted}/${revTotal}`}
        {...rest}
      />
    );
  }

  // TODO: Other statuses
  else {
    const journalStatus = null; // TODO: compute
    return (
      <StatusPill
        status={getDocumentStatusLabel(atbdVersion)}
        statusIcon={journalStatusIcons[journalStatus]}
        {...rest}
      />
    );
  }
}

DocumentStatusPill.propTypes = {
  atbdVersion: T.object
};
