import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';

export const CommentList = styled.ol`
  /* styled-component */
`;

const InfoMsgComment = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: ${glsp(2, 1)};

  ::before {
    ${({ useIcon }) => useIcon && collecticon(useIcon)}
    font-size: 3rem;
    color: ${themeVal('color.baseAlphaE')};
  }
`;

export const EmptyComment = styled(InfoMsgComment).attrs({
  useIcon: 'speech-balloon'
})`
  /* styled-component */
`;

export const ErrorComment = styled(InfoMsgComment).attrs({
  useIcon: 'sign-danger'
})`
  /* styled-component */
  padding: ${glsp(2)};
`;

export const THREAD_CLOSED = 'CLOSED';
export const THREAD_OPEN = 'OPEN';

export const COMMENT_STATUSES = [
  {
    id: 'all-status',
    label: 'All'
  },
  {
    id: THREAD_CLOSED,
    label: 'Resolved'
  },
  {
    id: THREAD_OPEN,
    label: 'Unresolved'
  }
];

/**
 * Verifies that two dates are the same by checking if the difference between
 * them is less than a second.
 * @param {date} a The date
 * @param {date} b The date
 */
export const isSameAproxDate = (a, b) => {
  const deltaT = Math.abs(a.getTime() - b.getTime());
  return deltaT < 1000;
};
