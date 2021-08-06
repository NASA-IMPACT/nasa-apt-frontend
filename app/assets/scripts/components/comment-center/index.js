import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import ShadowScrollbar from '@devseed-ui/shadow-scrollbar';

import {
  Panel,
  PanelHeader,
  PanelHeadline,
  PanelTitleAlt,
  PanelBody,
  PanelActions
} from '../../styles/panel';
import DropdownMenu from '../common/dropdown-menu';
import CommentForm from './comment-form';
import CommentThreadsSingle from './comment-threads-single';
import CommentThreadsList from './comment-threads-list';

import { useSidePanelPositioner } from '../../utils/use-sidepanel-positioner';
import { useCommentCenter } from '../../context/comment-center';
import { DOCUMENT_SECTIONS } from '../documents/single-edit/sections';
import { useSingleThread, useThreads } from '../../context/threads-list';
import { useSubmitThread, useSubmitThreadComment } from './use-submit-comment';
import { THREAD_CLOSED, THREAD_OPEN } from './common';

const CommentShadowScrollbar = styled(ShadowScrollbar)`
  height: 100%;
`;

const SectionsDropdownMenu = styled(DropdownMenu)`
  max-width: 18rem;
`;

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

const CommentFormWrapper = styled.div`
  height: min-content;
  background: ${themeVal('color.baseAlphaB')};
  box-shadow: 0 -${themeVal('layout.border')} 0 0 ${themeVal('color.baseAlphaC')};
  z-index: 9999;
  padding: ${glsp(1, 2)};

  textarea {
    min-height: 4rem;

    &:focus {
      min-height: 20rem;
    }
  }
`;

const COMMENT_STATUSES = [
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

function CommentCenter() {
  const {
    isPanelOpen,
    setPanelOpen,
    selectedSection,
    setSelectedSection,
    selectedStatus,
    setSelectedStatus,
    openThreadId,
    setOpenThreadId
  } = useCommentCenter();

  const onCommentSectionMenuSelect = useCallback(
    (id, { menuItem }) => {
      switch (menuItem.menuId) {
        case 'status':
          setSelectedStatus(id);
          break;
        case 'section':
          setSelectedSection(id);
          break;
      }
    },
    [setSelectedStatus, setSelectedSection]
  );

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

  const menuActiveItems = useMemo(() => [selectedSection, selectedStatus], [
    selectedSection,
    selectedStatus
  ]);

  const commentSectionMenu = useMemo(
    () => [
      {
        id: 'status',
        selectable: true,
        items: COMMENT_STATUSES.map((s) => ({
          ...s,
          title: `View ${s.label} comments`,
          keepOpen: true
        }))
      },
      {
        id: 'section',
        selectable: true,
        items: [
          {
            id: 'all-section',
            label: 'All',
            title: 'View all threads',
            keepOpen: true
          },
          ...DOCUMENT_SECTIONS.map((s) => ({
            ...s,
            title: `View comment threads for section ${s.label}`,
            keepOpen: true
          }))
        ]
      }
    ],
    []
  );

  const isCommentThread = !!openThreadId;

  const atbdId = 1;
  const atbdVersion = 'v2.0';

  const { createThread } = useThreads({
    atbdId,
    atbdVersion
  });

  const { createThreadComment } = useSingleThread({
    threadId: openThreadId
  });

  // The submit function being used is picked according to whether or not we're
  // looking at a single thread or thread list.
  const onSubmitThread = useSubmitThread(createThread);
  const onSubmitThreadComment = useSubmitThreadComment(createThreadComment);

  return (
    <CSSTransition
      in={isPanelOpen}
      timeout={320}
      classNames='comment-center'
      appear
      unmountOnExit
    >
      <CommentCenterPanel as='aside' ref={elementRef}>
        <PanelHeader>
          <PanelHeadline>
            <PanelTitleAlt>
              {isCommentThread ? 'Comment Thread' : 'Comments'}
            </PanelTitleAlt>
            {isCommentThread ? (
              <Button
                useIcon='arrow-left'
                title='See all comments'
                onClick={() => setOpenThreadId(null)}
              >
                View all
              </Button>
            ) : (
              <SectionsDropdownMenu
                menu={commentSectionMenu}
                activeItem={menuActiveItems}
                alignment='left'
                direction='down'
                withChevron
                dropTitle='Options'
                onSelect={onCommentSectionMenuSelect}
              />
            )}
          </PanelHeadline>
          <PanelActions>
            <Button
              useIcon='xmark--small'
              size='small'
              hideText
              title='Close panel'
              onClick={() => setPanelOpen(false)}
            >
              Close panel
            </Button>
          </PanelActions>
        </PanelHeader>
        <PanelBody>
          <CommentShadowScrollbar>
            {isCommentThread ? (
              <CommentThreadsSingle
                threadId={openThreadId}
                setOpenThreadId={setOpenThreadId}
              />
            ) : (
              <CommentThreadsList
                setOpenThreadId={setOpenThreadId}
                filterStatus={selectedStatus}
                filterSection={selectedSection}
              />
            )}
          </CommentShadowScrollbar>
          <CommentFormWrapper>
            <CommentForm
              type={isCommentThread ? 'reply' : 'new'}
              onSubmit={
                isCommentThread ? onSubmitThreadComment : onSubmitThread
              }
            />
          </CommentFormWrapper>
        </PanelBody>
      </CommentCenterPanel>
    </CSSTransition>
  );
}

export default CommentCenter;
