import React, { useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import T from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { Formik, Form as FormikForm } from 'formik';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Form, FormHelperMessage } from '@devseed-ui/form';

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
import Datetime from '../common/date';
import UserImage from '../common/user-image';
import collecticon from '@devseed-ui/collecticons';
import ShadowScrollbar from '@devseed-ui/shadow-scrollbar';
import {
  FormikInputTextarea,
  InputTextarea
} from '../common/forms/input-textarea';
import useSafeState from '../../utils/use-safe-state';

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

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

  ${Panel} {
    background: ${themeVal('color.surface')};
    width: 22rem;
  }
`;

const CommentCenterTrigger = styled(Button)`
  align-self: flex-start;
  margin-top: ${glsp(0.5)};
`;

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
          <PanelBody>
            <CommentShadowScrollbar>
              <CommentList>
                {[1, 2, 3].map((i) => (
                  <CommentListItem key={i}>
                    <CommentEntry isResolved={!(i % 3)}>
                      <CommentEntryHeader>
                        <CommentEntryHeadline>
                          <CommentAuthor user={{ name: 'Monica Anderson' }} />
                          <AuthoringInfo
                            date={
                              new Date(
                                rand(Date.now(), Date.now() - 20 * 86400000)
                              )
                            }
                            wasEdited={!(i % 2)}
                          />
                        </CommentEntryHeadline>
                        <CommentEntryActions>
                          <Button hideText size='small' useIcon='arrow-return'>
                            Reply
                          </Button>
                          <Button hideText size='small' useIcon='tick'>
                            Resolve comment
                          </Button>
                          <Button
                            hideText
                            size='small'
                            useIcon='ellipsis-vertical'
                          >
                            Options
                          </Button>
                        </CommentEntryActions>
                      </CommentEntryHeader>
                      <CommentEntryContent>
                        <p>
                          In <strong>Data Access Related Url</strong>
                        </p>
                        <p>
                          In publishing and graphic design, Lorem ipsum is a
                          placeholder text commonly used to demonstrate the
                          visual form of a document or a typeface without
                          relying on meaningful content. Lorem ipsum may be used
                          as a placeholder before final copy is available.
                        </p>
                      </CommentEntryContent>
                    </CommentEntry>
                  </CommentListItem>
                ))}
              </CommentList>
            </CommentShadowScrollbar>
            <CommentForm />
          </PanelBody>
        </Panel>
      </CSSTransition>
    </CommentCenterSelf>
  );
}

export default CommentCenter;

const CommentAuthorCmp = (props) => {
  const { user, ...rest } = props;

  return (
    <div {...rest}>
      <UserImage user={user} />
      <strong>{user.name}</strong>
    </div>
  );
};

CommentAuthorCmp.propTypes = {
  user: T.object
};

const CommentAuthor = styled(CommentAuthorCmp)`
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-gap: ${glsp(0.5)};
  align-items: center;
`;

const AuthoringInfoCmp = (props) => {
  const { date, wasEdited, ...rest } = props;

  return (
    <div {...rest}>
      <Datetime date={date} useDistanceToNow /> {wasEdited && '(edited)'}
    </div>
  );
};

AuthoringInfoCmp.propTypes = {
  date: T.object,
  wasEdited: T.bool
};

const AuthoringInfo = styled(AuthoringInfoCmp)`
  font-size: 0.75rem;
  line-height: 1rem;
`;

const CommentShadowScrollbar = styled(ShadowScrollbar)`
  height: 100%;
`;
const CommentList = styled.ol``;
const CommentListItem = styled.li``;
const CommentEntry = styled.article`
  position: relative;
  padding: ${glsp(1, 2)};
  box-shadow: 0 ${themeVal('layout.border')} 0 0 ${themeVal('color.baseAlphaC')};
  display: grid;
  grid-gap: ${glsp()};

  ${({ isResolved }) =>
    isResolved &&
    css`
      &::before {
        ${collecticon('tick--small')}
        position: absolute;
        top: 0;
        left: 0;
        z-index: 4;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        width: 2rem;
        height: 2rem;
        color: ${themeVal('color.surface')};
        line-height: 1;
        background: ${themeVal('color.link')};
        padding: ${glsp(0.125)};
        clip-path: polygon(0 0, 100% 0, 0 100%);
        pointer-events: none;
      }
    `}
`;
const CommentEntryHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-gap: ${glsp(0.5)};
  align-items: flex-start;

  ${CommentAuthor} strong {
    margin-top: ${glsp(-1)};
  }

  ${AuthoringInfo} {
    margin: ${glsp(-0.75, 0, 0, 2.5)};
  }
`;
const CommentEntryHeadline = styled.div``;
const CommentEntryActions = styled.div``;
const CommentEntryContent = styled.div`
  font-size: 0.875rem;
  display: grid;
  grid-gap: ${glsp(0.5)};
`;

const CommentFormCmp = (props) => {
  const { ...rest } = props;
  const [focused, setFocused] = useSafeState(false);
  console.log(
    '🚀 ~ file: index.js ~ line 363 ~ CommentFormCmp ~ focused',
    focused
  );

  const commentFormSectionMenu = {
    id: 'section',
    selectable: true,
    items: sections_TEMP.map((s) => ({
      ...s,
      title: `Write comment for section ${s.label}`
    }))
  };

  return (
    <div {...rest}>
      <Formik initialValues={{}} validate={console.log} onSubmit={console.log}>
        {(props) => {
          console.log(props);
          return (
            <Form onSubmit={props.handleSubmit}>
              <FormikInputTextarea
                id='comment-field'
                name='comment'
                label={
                  <DropdownMenu
                    menu={commentFormSectionMenu}
                    triggerProps={{ forwardedAs: 'a', href: '#comment-field' }}
                    triggerLabel='Comment under General'
                    alignment='left'
                    direction='up'
                    withChevron
                    dropTitle='Options'
                    onSelect={console.log}
                  />
                }
                onBlur={console.log}
              />
              <Button
                variation='primary-raised-dark'
                disabled={props.isSubmitting || !props.dirty}
              >
                Post
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

const CommentForm = styled(CommentFormCmp)`
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
