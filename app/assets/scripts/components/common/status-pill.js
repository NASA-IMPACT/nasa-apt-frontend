import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { glsp, multiply, rgba, themeVal } from '@devseed-ui/theme-provider';
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
import { useStatusColors } from '../../utils/use-status-colors';

export const statusSwatch = css`
  content: '';
  display: inline-flex;
  height: 0.75em;
  aspect-ratio: 1 / 1;
  border-radius: ${themeVal('shape.ellipsoid')};
  background: ${themeVal('color.baseLight')};
  box-shadow: 0 0 0 ${multiply(themeVal('layout.border'), 2)}
    ${themeVal('color.baseLight')};

  ${({ pillColor }) =>
    pillColor &&
    css`
      background: ${pillColor};
    `}
`;

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
    background-color: ${rgba(themeVal('color.base'), 0.64)};
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

  span {
    position: relative;
    display: inline-flex;
    gap: 0.75em;
    align-items: center;

    &::before {
      ${statusSwatch}
    }
  }
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
  const { statusMapping } = useStatusColors();

  if (isDraft(atbdVersion) || isReviewRequested(atbdVersion)) {
    const { percent } = calculateDocumentCompleteness(atbdVersion);
    return (
      <StatusPill
        pillColor={statusMapping[atbdVersion.status]}
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
        pillColor={statusMapping[atbdVersion.status]}
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
        pillColor={statusMapping[atbdVersion.status]}
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
