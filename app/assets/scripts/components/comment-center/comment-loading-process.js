import React from 'react';
import T from 'prop-types';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';

import {
  LoadingSkeleton,
  LoadingSkeletonGroup,
  LoadingSkeletonLine
} from '../common/loading-skeleton';
import { useMinimumLoadingTime } from '../../utils/use-min-duration-event';

const LoadingWrapper = styled.div`
  padding: ${glsp(2)};
`;

const TransitionWrapper = styled.div`
  &.fade-enter {
    opacity: 0;
  }
  &.fade-exit {
    opacity: 1;
  }
  &.fade-enter-active {
    opacity: 1;
  }
  &.fade-exit-active {
    opacity: 0;
  }
  &.fade-enter-active,
  &.fade-exit-active {
    transition: opacity 160ms;
  }
`;

/**
 * Event listener for the CSS transition
 */
const transitionEndListener = (node, done) =>
  node.addEventListener('transitionend', done, false);

/**
 * Component to apply a SwitchTransition to the comments.
 * Switches between the loading state and a success or error state based on the
 * loading status.
 *
 * @prop {string} status The loading status
 * @prop {func} renderError The function to render the error if the status
 * becomes 'failed'
 * @prop {func} renderData The function to render the data if the status
 * becomes 'succeeded'
 */
export default function CommentLoadingProcess(props) {
  const { status, renderError, renderData } = props;

  // Use a timer to ensure that the loading appears at least 512ms otherwise
  // we'd get a loading flash which is very strange for UX.
  const isLoadingDone = useMinimumLoadingTime({ status });

  if (status === 'idle') return null;

  const statusWithLoading = isLoadingDone ? status : 'loading';

  return (
    <SwitchTransition>
      <CSSTransition
        key={statusWithLoading}
        addEndListener={transitionEndListener}
        classNames='fade'
      >
        <TransitionWrapper>
          {statusWithLoading === 'loading' && (
            <LoadingWrapper>
              {[...Array(3).keys()].map((n) => (
                <LoadingSkeletonGroup key={n}>
                  <LoadingSkeletonLine>
                    <LoadingSkeleton size='large' width={2 / 12} />
                    <LoadingSkeleton size='large' width={8 / 12} />
                  </LoadingSkeletonLine>
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                  <LoadingSkeleton width={8 / 12} />
                </LoadingSkeletonGroup>
              ))}
            </LoadingWrapper>
          )}
          {statusWithLoading === 'failed' && renderError()}
          {statusWithLoading === 'succeeded' && renderData()}
        </TransitionWrapper>
      </CSSTransition>
    </SwitchTransition>
  );
}

CommentLoadingProcess.propTypes = {
  status: T.string,
  renderError: T.func,
  renderData: T.func
};
