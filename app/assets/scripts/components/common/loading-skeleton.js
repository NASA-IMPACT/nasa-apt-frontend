import styled, { keyframes, css } from 'styled-components';
import T from 'prop-types';
import { themeVal } from '@devseed-ui/theme-provider';

const pulse = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

export const LoadingSkeleton = styled.span`
  display: ${({ inline }) => (inline ? 'inline-block' : 'block')};
  background: ${themeVal('color.baseAlphaC')};
  height: 1rem;
  width: ${({ width }) => (width || 1) * 100}%;
  animation: ${pulse} 0.8s ease 0s infinite alternate;

  /* Size modifier */
  ${({ size }) => size === 'large' && 'height: 2.25rem;'}

  /* Color modifier */
  ${({ variation }) => variation === 'light' && 'background: rgba(#fff, 0.48);'}

  /* type modifier */
  ${({ type }) =>
    type === 'heading' &&
    css`
      background: ${themeVal('color.baseAlphaD')};
      ${({ variation }) =>
        variation === 'light' && 'background: rgba(#fff, 0.80);'}
    `}
`;

LoadingSkeleton.propTypes = {
  type: T.string,
  variation: T.string,
  size: T.string,
  width: T.number,
  inline: T.bool
};

export const LoadingSkeletonGroup = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }

  & > ${LoadingSkeleton} {
    margin-bottom: 0.75rem;
  }
`;

LoadingSkeletonGroup.propTypes = {
  style: T.object,
  children: T.node
};

export const LoadingSkeletonLine = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;
