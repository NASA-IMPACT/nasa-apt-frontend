import React, { useMemo } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { themeVal } from '@devseed-ui/theme-provider';

import { Panel } from '../../styles/panel';
import ThreadListPanelContents from './thread-list-panel';
import ThreadSinglePanelContents from './thread-single-panel';

import { useSidePanelPositioner } from '../../utils/use-sidepanel-positioner';
import { useCommentCenter } from '../../context/comment-center';

const CommentCenterPanel = styled(Panel)`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 100;
  width: 22rem;
  background: ${themeVal('color.surface')};
  box-shadow: ${themeVal('boxShadow.elevationC')};

  &.comment-center-enter {
    transform: translateX(calc(100% + 2rem));
  }
  &.comment-center-enter-active {
    transform: translateX(0);
    transition: transform 320ms ease-in-out;
  }
  &.comment-center-exit {
    transform: translateX(0);
  }
  &.comment-center-exit-active {
    transform: translateX(calc(100% + 2rem));
    transition: transform 320ms ease-in-out;
  }
`;

function CommentCenter() {
  const { isPanelOpen, openThreadId } = useCommentCenter();

  // Make the comment center sticky by computing the height taking the header
  // and footer into account.
  const { ref: elementRef } = useSidePanelPositioner(
    useMemo(
      () => ({
        fn: (ref, { height, top }) => {
          ref.current.style.height = `${height}px`;
          ref.current.style.top = `${top}px`;
        }
      }),
      []
    )
  );

  const isShowingSingleThread = !!openThreadId;

  return (
    <CSSTransition
      in={isPanelOpen}
      timeout={320}
      classNames='comment-center'
      appear
      unmountOnExit
    >
      <CommentCenterPanel as='aside' ref={elementRef}>
        {isShowingSingleThread ? (
          <ThreadSinglePanelContents />
        ) : (
          <ThreadListPanelContents />
        )}
      </CommentCenterPanel>
    </CSSTransition>
  );
}

export default CommentCenter;
