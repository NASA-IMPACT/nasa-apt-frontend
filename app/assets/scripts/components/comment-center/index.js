import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';

import {
  Panel,
  PanelHeader,
  PanelHeadline,
  PanelTitleAlt,
  PanelBody
} from '../../styles/panel';
import DropdownMenu from '../common/dropdown-menu';

import { useSidePanelPositioner } from '../../utils/use-sidepanel-positioner';
import { useCommentCenter } from '../../context/comment-center';

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
    width: 0;
  }
  .comment-center-enter-active {
    width: 22rem;
    transition: width 320ms ease-in-out;
  }
  .comment-center-exit {
    width: 22rem;
  }
  .comment-center-exit-active {
    width: 0;
    transition: width 320ms ease-in-out;
  }

  ${PanelBody} > * {
    /* Ensure the shadow scrollbar takes up the full height */
    flex: 1;
  }
`;

const CommentCenterTrigger = styled(Button)`
  align-self: flex-start;
  margin-top: ${glsp(0.5)};
`;

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

  const sections_TEMP = [
    {
      id: 'general',
      label: 'General'
    },
    {
      id: 'one',
      label: 'Section one'
    },
    {
      id: 'two',
      label: 'Section two'
    }
  ];

  const statuses_TEMP = [
    {
      id: 'all',
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

  const commentSectionMenu = [
    {
      id: 'status',
      selectable: true,
      items: statuses_TEMP.map((s) => ({
        ...s,
        title: `View ${s.label} comments`,
        keepOpen: true
      }))
    },
    {
      id: 'section',
      selectable: true,
      items: sections_TEMP.map((s) => ({
        ...s,
        title: `View comment threads for section ${s.label}`,
        keepOpen: true
      }))
    }
  ];

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
              <PanelTitleAlt>Comments</PanelTitleAlt>
              <DropdownMenu
                menu={commentSectionMenu}
                activeItem={menuActiveItems}
                alignment='left'
                direction='down'
                withChevron
                dropTitle='Options'
                onSelect={onCommentSectionMenuSelect}
              />
            </PanelHeadline>
          </PanelHeader>
          <PanelBody>Hey</PanelBody>
        </Panel>
      </CSSTransition>
    </CommentCenterSelf>
  );
}

export default CommentCenter;
