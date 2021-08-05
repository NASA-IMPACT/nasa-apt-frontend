import React, { useCallback, useEffect, useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import ShadowScrollbar from '@devseed-ui/shadow-scrollbar';
import collecticon from '@devseed-ui/collecticons';

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
import CommentEntry, {
  COMMENT,
  COMMENT_THREAD,
  COMMENT_THREAD_REPLY
} from './comment-entry';

import { useSidePanelPositioner } from '../../utils/use-sidepanel-positioner';
import { useCommentCenter } from '../../context/comment-center';
import {
  DOCUMENT_SECTIONS,
  getDocumentSection
} from '../documents/single-edit/sections';
import { useSingleThread, useThreads } from '../../context/threads-list';
import {
  LoadingSkeleton,
  LoadingSkeletonGroup,
  LoadingSkeletonLine
} from '../common/loading-skeleton';

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

const PanelBodyTransitioned = styled(PanelBody)`
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

const CommentList = styled.ol`
  /* styled-component */
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

const EmptyComment = styled(InfoMsgComment).attrs({
  useIcon: 'speech-balloon'
})`
  /* styled-component */
`;

const ErrorComment = styled(InfoMsgComment).attrs({ useIcon: 'sign-danger' })`
  /* styled-component */
  padding: ${glsp(2)};
`;

const THREAD_CLOSED = 'CLOSED';
const THREAD_OPEN = 'OPEN';

/**
 * Verifies that two dates are the same by checking if the difference between
 * them is less than a second.
 * @param {date} a The date
 * @param {date} b The date
 */
const isSameAproxDate = (a, b) => {
  const deltaT = Math.abs(a.getTime() - b.getTime());
  return deltaT < 1000;
};

const COMMENT_STATUSES = [
  {
    id: 'all-status',
    label: 'All'
  },
  {
    id: 'resolved',
    label: 'Resolved'
  },
  {
    id: 'unresolved',
    label: 'Unresolved'
  }
];

const transitionEndListener = (node, done) =>
  node.addEventListener('transitionend', done, false);

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
        <SwitchTransition>
          <CSSTransition
            key={isCommentThread ? 'single' : 'list'}
            addEndListener={transitionEndListener}
            classNames='fade'
          >
            <PanelBodyTransitioned>
              <CommentShadowScrollbar>
                {isCommentThread ? (
                  <CommentThreadsSingle threadId={openThreadId} />
                ) : (
                  <CommentThreadsList setOpenThreadId={setOpenThreadId} />
                )}
              </CommentShadowScrollbar>
              <CommentFormWrapper>
                <CommentForm type={isCommentThread ? 'reply' : 'new'} />
              </CommentFormWrapper>
            </PanelBodyTransitioned>
          </CSSTransition>
        </SwitchTransition>
      </CommentCenterPanel>
    </CSSTransition>
  );
}

export default CommentCenter;

const LoadingWrapper = styled.div`
  padding: ${glsp(2)};
`;

function CommentThreadsList(props) {
  const { setOpenThreadId } = props;

  const atbdId = 1;
  const atbdVersion = 'v2.0';

  const { threads, fetchThreads } = useThreads({
    atbdId,
    atbdVersion
  });
  const { updateThreadStatus } = useSingleThread();

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const onResolveClick = useCallback(
    (threadId) => {
      const t = threads.data.find((thread) => thread.id === threadId);
      updateThreadStatus({
        atbdId,
        atbdVersion,
        threadId,
        status: t.status === THREAD_CLOSED ? THREAD_OPEN : THREAD_CLOSED
      });
    },
    [threads.data, updateThreadStatus]
  );

  if (threads.status === 'loading') {
    return (
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
    );
  }

  if (threads.status === 'failed') {
    return (
      <ErrorComment>
        <p>Something went wrong loading the comments.</p>
      </ErrorComment>
    );
  }

  if (threads.status === 'succeeded') {
    return threads.data.length ? (
      <CommentList>
        {threads.data.map((c) => (
          <li key={c.id}>
            <CommentEntry
              type={COMMENT}
              commentId={c.id}
              author={{ name: 'miu miu' }}
              isResolved={c.status === THREAD_CLOSED}
              isEdited={
                !isSameAproxDate(
                  new Date(c.created_at),
                  new Date(c.last_updated_at)
                )
              }
              // isEditing={c.isEditing}
              date={new Date(c.last_updated_at)}
              section={getDocumentSection(c.section)}
              replyCount={c.comment_count}
              comment={c.body}
              onViewClick={setOpenThreadId}
              onResolveClick={onResolveClick}
            />
          </li>
        ))}
      </CommentList>
    ) : (
      <EmptyComment>
        <p>There are no threads for this document.</p>
        <p>Say something!</p>
      </EmptyComment>
    );
  }

  return null;
}

CommentThreadsList.propTypes = {
  setOpenThreadId: T.func
};

function CommentThreadsSingle(props) {
  const { threadId } = props;

  const { thread, fetchSingleThread } = useSingleThread({
    threadId
  });

  useEffect(() => {
    fetchSingleThread();
  }, [fetchSingleThread]);

  if (thread.status === 'loading') {
    return (
      <LoadingWrapper>
        {[...Array(2).keys()].map((n) => (
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
    );
  }

  if (thread.status === 'failed') {
    return (
      <ErrorComment>
        <p>Something went wrong loading the comment.</p>
      </ErrorComment>
    );
  }

  if (thread.status === 'succeeded') {
    const t = thread.data;
    return (
      <React.Fragment>
        <CommentEntry
          type={COMMENT_THREAD}
          commentId={t.id}
          author={{ name: 'Alberto Macca' }}
          isResolved={t.status === THREAD_CLOSED}
          isEdited={
            !isSameAproxDate(
              new Date(t.created_at),
              new Date(t.last_updated_at)
            )
          }
          // isEditing={t.isEditing}
          date={new Date(t.last_updated_at)}
          section={getDocumentSection(t.section)}
          replyCount={t.comment_count}
          comment={t.body}
        />
        {t.comments?.length ? (
          <CommentList>
            {t.comments.map((c) => (
              <li key={c.id}>
                <CommentEntry
                  type={COMMENT_THREAD_REPLY}
                  commentId={c.id}
                  author={{ name: 'Alberto Macca' }}
                  isEdited={
                    !isSameAproxDate(
                      new Date(c.created_at),
                      new Date(c.last_updated_at)
                    )
                  }
                  // isEditing={c.isEditing}
                  date={new Date(c.last_updated_at)}
                  comment={c.body}
                />
              </li>
            ))}
          </CommentList>
        ) : (
          <EmptyComment>
            <p>There are no replies.</p>
            <p>Say something!</p>
          </EmptyComment>
        )}
      </React.Fragment>
    );
  }

  return null;
}

CommentThreadsSingle.propTypes = {
  threadId: T.number
};
