import React, { useCallback, useMemo } from 'react';
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

const EmptyComment = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: ${glsp(2, 1)};

  ::before {
    ${collecticon('speech-balloon')}
    font-size: 3rem;
    color: ${themeVal('color.baseAlphaE')};
  }
`;

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const COMMENTS = [
  {
    id: '1',
    author: { name: 'Monica Anderson' },
    isResolved: false,
    isEdited: false,
    date: new Date(rand(Date.now(), Date.now() - 20 * 86400000)),
    section: getDocumentSection('general'),
    comment:
      'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
    replies: [
      {
        id: '11',
        author: { name: 'Tom Ridley' },
        isEdited: false,
        isEditing: true,
        date: new Date(rand(Date.now(), Date.now() - 20 * 86400000)),
        comment: 'This is a very nice reply'
      },
      {
        id: '12',
        author: { name: 'Chiara Cortegazza' },
        isEdited: true,
        isEditing: false,
        date: new Date(rand(Date.now(), Date.now() - 20 * 86400000)),
        comment: '👋\nWhat if the reply has emojies? 😁😁'
      }
    ]
  },
  {
    id: '2',
    author: { name: 'Tom Ridley' },
    isResolved: false,
    isEdited: true,
    isEditing: true,
    date: new Date(rand(Date.now(), Date.now() - 20 * 86400000)),
    section: getDocumentSection('data_access_related_urls'),
    comment:
      'Lorem ipsum may be used as a placeholder before final copy is available.'
  },
  {
    id: '3',
    author: { name: 'Bruce Wayne' },
    isResolved: true,
    isEdited: false,
    date: new Date(rand(Date.now(), Date.now() - 20 * 86400000)),
    section: getDocumentSection('algorithm_implementations'),
    comment:
      'Lorem ipsum is a placeholder\n\ntext commonly used to demonstrate the visual form before final copy is available.'
  }
];

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

  const singleComment = COMMENTS.find((c) => c.id === openThreadId);
  const isCommentThread = !!singleComment;

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
            key={isCommentThread ? 'thread' : 'single'}
            addEndListener={transitionEndListener}
            classNames='fade'
          >
            <PanelBodyTransitioned>
              <CommentShadowScrollbar>
                {isCommentThread ? (
                  <React.Fragment>
                    <CommentEntry
                      type={COMMENT_THREAD}
                      commentId={singleComment.id}
                      author={singleComment.author}
                      isResolved={singleComment.isResolved}
                      isEdited={singleComment.isEdited}
                      isEditing={singleComment.isEditing}
                      date={singleComment.date}
                      section={singleComment.section}
                      replyCount={singleComment.replies?.length}
                      comment={singleComment.comment}
                    />
                    {singleComment.replies?.length ? (
                      <CommentList>
                        {singleComment.replies.map((c) => (
                          <li key={c.id}>
                            <CommentEntry
                              type={COMMENT_THREAD_REPLY}
                              commentId={c.id}
                              author={c.author}
                              isEdited={c.isEdited}
                              isEditing={c.isEditing}
                              date={c.date}
                              comment={c.comment}
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
                ) : (
                  <CommentList>
                    {COMMENTS.map((c) => (
                      <li key={c.id}>
                        <CommentEntry
                          type={COMMENT}
                          commentId={c.id}
                          author={c.author}
                          isResolved={c.isResolved}
                          isEdited={c.isEdited}
                          isEditing={c.isEditing}
                          date={c.date}
                          section={c.section}
                          replyCount={c.replies?.length}
                          comment={c.comment}
                          onViewClick={setOpenThreadId}
                        />
                      </li>
                    ))}
                  </CommentList>
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
