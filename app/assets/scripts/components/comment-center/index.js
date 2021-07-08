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
  PanelBody
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

const CommentCenterSelf = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 100;
  display: grid;
  grid-gap: ${glsp()};
  grid-template-columns: auto 1fr;

  .comment-center-enter {
    margin-right: -22rem;
  }
  .comment-center-enter-active {
    margin-right: 0;
    transition: margin-right 320ms ease-in-out;
  }
  .comment-center-exit {
    margin-right: 0;
  }
  .comment-center-exit-active {
    margin-right: -22rem;
    transition: margin-right 320ms ease-in-out;
  }

  ${Panel} {
    background: ${themeVal('color.surface')};
    width: 22rem;
  }
`;

const CommentCenterTrigger = styled(Button)`
  align-self: flex-start;
  margin-top: ${glsp(0.5)};
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

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const COMMENTS = [
  {
    id: 1,
    author: { name: 'Monica Anderson' },
    isResolved: false,
    isEdited: false,
    date: new Date(rand(Date.now(), Date.now() - 20 * 86400000)),
    section: getDocumentSection('general'),
    comment:
      'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
    replies: [
      {
        id: 11,
        author: { name: 'Tom Ridley' },
        isEdited: false,
        isEditing: true,
        date: new Date(rand(Date.now(), Date.now() - 20 * 86400000)),
        comment: 'This is a very nice reply'
      },
      {
        id: 12,
        author: { name: 'Chiara Cortegazza' },
        isEdited: true,
        isEditing: false,
        date: new Date(rand(Date.now(), Date.now() - 20 * 86400000)),
        comment: '👋\nWhat if the reply has emojies? 😁😁'
      }
    ]
  },
  {
    id: 2,
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
    id: 3,
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

function CommentCenter() {
  const {
    isPanelOpen,
    setPanelOpen,
    selectedSection,
    setSelectedSection,
    selectedStatus,
    setSelectedStatus
  } = useCommentCenter();

  const togglePanel = useCallback(() => {
    setPanelOpen((v) => !v);
  }, [setPanelOpen]);

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

  const isCommentThread = false;

  return (
    <CommentCenterSelf ref={elementRef}>
      <CommentCenterTrigger
        hideText
        useIcon='speech-balloon'
        variation='base-raised-light'
        onClick={togglePanel}
        active={isPanelOpen}
      >
        Toggle comment panel
      </CommentCenterTrigger>
      <CSSTransition
        in={isPanelOpen}
        timeout={320}
        classNames='comment-center'
        appear
        unmountOnExit
      >
        <Panel as='div'>
          <PanelHeader>
            <PanelHeadline>
              <PanelTitleAlt>
                {isCommentThread ? 'Comment Thread' : 'Comments'}
              </PanelTitleAlt>
              {isCommentThread ? (
                <Button useIcon='arrow-left' title='See all comments'>
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
          </PanelHeader>
          <PanelBody>
            <CommentShadowScrollbar>
              {isCommentThread ? (
                <React.Fragment>
                  <CommentEntry
                    type={COMMENT_THREAD}
                    author={COMMENTS[0].author}
                    isResolved={COMMENTS[0].isResolved}
                    isEdited={COMMENTS[0].isEdited}
                    isEditing={COMMENTS[0].isEditing}
                    date={COMMENTS[0].date}
                    section={COMMENTS[0].section}
                    comment={COMMENTS[0].comment}
                  />
                  {COMMENTS[0].replies.map((c) => (
                    <li key={c.id}>
                      <CommentEntry
                        type={COMMENT_THREAD_REPLY}
                        author={c.author}
                        isEdited={c.isEdited}
                        isEditing={c.isEditing}
                        date={c.date}
                        comment={c.comment}
                      />
                    </li>
                  ))}
                </React.Fragment>
              ) : (
                <CommentList>
                  {COMMENTS.map((c) => (
                    <li key={c.id}>
                      <CommentEntry
                        type={COMMENT}
                        author={c.author}
                        isResolved={c.isResolved}
                        isEdited={c.isEdited}
                        isEditing={c.isEditing}
                        date={c.date}
                        section={c.section}
                        comment={c.comment}
                      />
                    </li>
                  ))}
                </CommentList>
              )}
            </CommentShadowScrollbar>
            <CommentFormWrapper>
              <CommentForm type={isCommentThread ? 'reply' : 'new'} />
            </CommentFormWrapper>
          </PanelBody>
        </Panel>
      </CSSTransition>
    </CommentCenterSelf>
  );
}

export default CommentCenter;
