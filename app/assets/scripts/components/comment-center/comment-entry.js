import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import T from 'prop-types';
import nl2br from 'react-nl2br';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import collecticon from '@devseed-ui/collecticons';

import { Link } from '../../styles/clean/link';
import Datetime from '../common/date';
import UserIdentity from '../common/user-identity';
import DropdownMenu from '../common/dropdown-menu';
import CommentForm from './comment-form';

const AuthoringInfoCmp = (props) => {
  const { date, isEdited, isThread, ...rest } = props;

  const d = (
    <React.Fragment>
      <Datetime date={date} useDistanceToNow /> {isEdited && '(edited)'}
    </React.Fragment>
  );

  return isThread ? <div {...rest}>{d}</div> : <Link {...rest}>{d}</Link>;
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
  const { comment, truncateComment } = props;

  if (!truncateComment) return <p>{nl2br(comment)}</p>;

  const shortComment = comment.slice(0, MAX_COMMENT_LENGTH);
  return (
    <p>
      {nl2br(shortComment)}
      {comment.length > MAX_COMMENT_LENGTH && (
        <React.Fragment>
          ...{' '}
          <Link to='' title='Read full comment'>
            (Read more)
          </Link>
        </React.Fragment>
      )}
    </p>
  );
};

CommentBody.propTypes = {
  truncateComment: T.bool,
  comment: T.string
};

export const COMMENT = 'comment';
export const COMMENT_THREAD = 'comment-thread';
export const COMMENT_THREAD_REPLY = 'comment-thread-reply';

export default function CommentEntry(props) {
  const {
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

  const isReply = type === COMMENT_THREAD_REPLY;
  const isThread = type === COMMENT_THREAD;

  const commentMenuProps = useMemo(
    () => ({
      triggerProps: {
        hideText: true,
        useIcon: 'ellipsis-vertical',
        size: 'small'
      },
      triggerLabel: 'ATBD options',
      menu: {
        id: 'actions',
        items: [
          {
            id: 'edit',
            label: 'Edit',
            title: 'Edit this comment'
          }
        ]
      }
    }),
    []
  );

  return (
    <CommentEntrySelf isResolved={isResolved} isReply={isReply}>
      <CommentEntryHeader>
        <CommentEntryHeadline>
          <UserIdentity user={author} />
          <AuthoringInfo
            date={date}
            isEdited={isEdited}
            isThread={isReply || isThread}
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
          />
        )}
      </CommentEntryContent>
    </CommentEntrySelf>
  );
}

CommentEntry.propTypes = {
  author: T.object,
  type: T.oneOf([COMMENT, COMMENT_THREAD, COMMENT_THREAD_REPLY]),
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
