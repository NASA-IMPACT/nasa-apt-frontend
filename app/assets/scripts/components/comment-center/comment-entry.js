import React, { useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import T from 'prop-types';
import nl2br from 'react-nl2br';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import collecticon from '@devseed-ui/collecticons';

import Datetime from '../common/date';
import UserIdentity from '../common/user-identity';
import DropdownMenu, { MenuItemReasonDisabled } from '../common/dropdown-menu';
import CommentForm from './comment-form';

import { useUser } from '../../context/user';

const getDefaultPrevented = (fn, ...args) => (e) => {
  e?.preventDefault?.();
  fn?.(...args);
};

const AuthoringInfoCmp = (props) => {
  const { date, isEdited, isThread, ...rest } = props;

  const d = (
    <React.Fragment>
      <Datetime date={date} useDistanceToNow /> {isEdited && '(edited)'}
    </React.Fragment>
  );

  return isThread ? <div {...rest}>{d}</div> : <a {...rest}>{d}</a>;
};

AuthoringInfoCmp.propTypes = {
  date: T.object,
  isThread: T.bool,
  isEdited: T.bool
};

const AuthoringInfo = styled(AuthoringInfoCmp)`
  display: block;
  font-size: 0.75rem;
  line-height: 1rem;

  &,
  &:visited {
    color: inherit;
  }
`;

const CommentEntrySelf = styled.article`
  position: relative;
  padding: ${glsp(1, 2)};
  box-shadow: 0 ${themeVal('layout.border')} 0 0 ${themeVal('color.baseAlphaC')};
  display: grid;
  grid-gap: ${glsp()};

  ${({ isReply }) =>
    isReply &&
    css`
      padding-left: ${glsp(3)};
    `}

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

  ${UserIdentity} strong {
    margin-top: ${glsp(-1)};
  }

  ${AuthoringInfo} {
    margin: ${glsp(-0.75, 0, 0, 2.5)};
  }
`;

const CommentEntryHeadline = styled.div`
  /* styled-component*/
`;

const CommentEntryActions = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${glsp(0.25)};
`;

const CommentEntryContent = styled.div`
  font-size: 0.875rem;
  display: grid;
  grid-gap: ${glsp(0.5)};

  textarea {
    min-height: 4rem;

    &:focus {
      min-height: 20rem;
    }
  }
`;

const CommentReplyButton = styled(Button)`
  position: relative;

  ::after {
    content: attr(data-reply-count);
    font-size: 0.625rem;
    line-height: 0.875rem !important;
    position: absolute;
    right: -0.25rem;
    top: -0.5rem;
    padding: ${glsp(0, 0.25)};
    color: #fff;
    background: ${themeVal('color.primary')};
    border-radius: ${themeVal('shape.ellipsoid')};
  }
`;

const MAX_COMMENT_LENGTH = 140;

const CommentBody = (props) => {
  const { comment, truncateComment, onReadMore } = props;

  if (!truncateComment) return <p>{nl2br(comment)}</p>;

  const shortComment = comment.slice(0, MAX_COMMENT_LENGTH);
  return (
    <p>
      {nl2br(shortComment)}
      {comment.length > MAX_COMMENT_LENGTH && (
        <React.Fragment>
          ...{' '}
          <a href='#' title='Read full comment' onClick={onReadMore}>
            (Read more)
          </a>
        </React.Fragment>
      )}
    </p>
  );
};

CommentBody.propTypes = {
  onReadMore: T.func,
  truncateComment: T.bool,
  comment: T.string
};

export const THREAD_LIST_ITEM = 'thread-list-item';
export const THREAD_SINGLE = 'thread-single';
export const THREAD_REPLY = 'thread-reply';

export default function CommentEntry(props) {
  const {
    commentId,
    onMenuAction,
    onViewClick,
    onResolveClick,
    author,
    type,
    isResolved,
    isEdited,
    isEditing,
    replyCount,
    date,
    section,
    comment
  } = props;

  const { user, isCurator } = useUser();

  const isReply = type === THREAD_REPLY;
  const isThread = type === THREAD_SINGLE;

  const isEntryAuthor = author.sub === user.id;

  const commentMenuProps = useMemo(
    () => ({
      triggerProps: {
        hideText: true,
        useIcon: 'ellipsis-vertical',
        size: 'small'
      },
      triggerLabel: 'ATBD options',
      menu: [
        {
          id: 'actions',
          items: [
            {
              id: 'edit',
              label: 'Edit',
              title: 'Edit this comment',
              /* eslint-disable-next-line react/display-name */
              render: (props) => (
                <MenuItemReasonDisabled
                  {...props}
                  isDisabled={!isEntryAuthor && !isCurator}
                  tipMessage='You can only edit your own comments'
                />
              )
            }
          ]
        },
        {
          id: 'actions2',
          items: [
            type === THREAD_REPLY
              ? {
                  id: 'delete-comment',
                  title: 'Delete comment',
                  label: 'Delete',
                  /* eslint-disable-next-line react/display-name */
                  render: (props) => (
                    <MenuItemReasonDisabled
                      {...props}
                      isDisabled={!isEntryAuthor && !isCurator}
                      tipMessage='You can only delete your own comments'
                    />
                  )
                }
              : {
                  id: 'delete-thread',
                  title: 'Delete thread',
                  label: 'Delete',
                  /* eslint-disable-next-line react/display-name */
                  render: (props) => (
                    <MenuItemReasonDisabled
                      {...props}
                      isDisabled={!isEntryAuthor && !isCurator}
                      tipMessage='You can only delete your own comments threads'
                    />
                  )
                }
          ]
        }
      ]
    }),
    [type, isEntryAuthor, isCurator]
  );

  const onSelect = useCallback(
    (menuItem, payload = {}) =>
      onMenuAction(
        menuItem,
        type === THREAD_REPLY
          ? { ...payload, commentId }
          : // When dealing with a thread the commentId prop is actually the thread id.
            { ...payload, threadId: commentId }
      ),
    [type, onMenuAction, commentId]
  );

  return (
    <CommentEntrySelf isResolved={isResolved} isReply={isReply}>
      <CommentEntryHeader>
        <CommentEntryHeadline>
          <UserIdentity name={author.preferred_username} email={author.email} />
          <AuthoringInfo
            date={date}
            isEdited={isEdited}
            isThread={isReply || isThread}
            href='#'
            onClick={getDefaultPrevented(onViewClick, commentId)}
          />
        </CommentEntryHeadline>
        <CommentEntryActions>
          {!isReply && (
            <React.Fragment>
              <CommentReplyButton
                hideText
                size='small'
                useIcon='arrow-return'
                title={
                  replyCount ? `Reply comment (${replyCount})` : 'Reply Comment'
                }
                data-reply-count={replyCount > 99 ? '99+' : replyCount || null}
                onClick={getDefaultPrevented(onViewClick, commentId)}
              >
                Reply
              </CommentReplyButton>
              <Button
                hideText
                size='small'
                useIcon={isResolved ? 'arrow-spin-ccw' : 'tick'}
                title={
                  isResolved
                    ? 'Unresolve comment thread'
                    : 'Resolve comment thread'
                }
                onClick={getDefaultPrevented(onResolveClick, commentId)}
              >
                {isResolved ? 'Unresolve' : 'Resolve'} comment
              </Button>
            </React.Fragment>
          )}
          <DropdownMenu
            {...commentMenuProps}
            alignment='right'
            direction='down'
            withChevron
            dropTitle='Options'
            onSelect={onSelect}
          />
        </CommentEntryActions>
      </CommentEntryHeader>
      <CommentEntryContent>
        {section && (
          <p>
            In <strong>{section.label}</strong>
          </p>
        )}
        {isEditing ? (
          <CommentForm type='edit' comment={comment} />
        ) : (
          <CommentBody
            comment={comment}
            truncateComment={!isReply && !isThread}
            onReadMore={getDefaultPrevented(onViewClick, commentId)}
          />
        )}
      </CommentEntryContent>
    </CommentEntrySelf>
  );
}

CommentEntry.propTypes = {
  commentId: T.number,
  onMenuAction: T.func,
  onViewClick: T.func,
  onResolveClick: T.func,
  author: T.object,
  type: T.oneOf([THREAD_LIST_ITEM, THREAD_SINGLE, THREAD_REPLY]),
  isResolved: T.bool,
  isEdited: T.bool,
  isEditing: T.bool,
  date: T.object,
  section: T.shape({
    id: T.string,
    label: T.string
  }),
  replyCount: T.number,
  comment: T.string
};
