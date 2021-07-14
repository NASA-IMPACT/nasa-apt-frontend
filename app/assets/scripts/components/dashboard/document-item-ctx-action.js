import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';
import DropdownMenu from '../common/dropdown-menu';
import { Button } from '@devseed-ui/button';

const contextualBtnProps = {
  size: 'small'
};

const AllowDeny = (props) => {
  const { onSelect, triggerLabel, dropTitle } = props;

  const menu = useMemo(
    () => [
      {
        id: 'actions',
        items: [
          {
            id: 'allow',
            label: 'Allow',
            title: `Allow action ${dropTitle.toLowerCase()}`
          },
          {
            id: 'deny',
            label: 'Deny',
            title: `Deny action ${dropTitle.toLowerCase()}`
          }
        ]
      }
    ],
    [dropTitle]
  );

  return (
    <DropdownMenu
      menu={menu}
      withChevron
      triggerLabel={triggerLabel}
      triggerProps={contextualBtnProps}
      alignment='right'
      direction='down'
      dropTitle={dropTitle}
      onSelect={onSelect}
    />
  );
};

AllowDeny.propTypes = {
  triggerLabel: T.string,
  dropTitle: T.string,
  onSelect: T.func
};

const ContextualDocAction = (props) => {
  const { action, onAction } = props;

  const allowDenyCb = useCallback(
    (id) => onAction({ action, allow: id === 'allow' }),
    [onAction, action]
  );

  const singleBtnCb = useCallback(() => onAction({ action, allow: true }), [
    onAction,
    action
  ]);

  switch (action) {
    case 'approve-curation':
      return (
        <AllowDeny
          triggerLabel='Approve request'
          dropTitle='Request for curation'
          onSelect={allowDenyCb}
        />
      );
    case 'approve-review':
      return (
        <AllowDeny
          triggerLabel='Approve request'
          triggerProps={{ size: 'small' }}
          dropTitle='Request for review'
          onSelect={allowDenyCb}
        />
      );
    case 'request-review':
      return (
        <Button
          title='Request review'
          {...contextualBtnProps}
          onClick={singleBtnCb}
        >
          Request review
        </Button>
      );
    case 'request-curation':
      return (
        <Button
          title='Request curation'
          {...contextualBtnProps}
          onClick={singleBtnCb}
        >
          Request curation
        </Button>
      );
    default:
      return <p>Missing `action` prop</p>;
  }
};

ContextualDocAction.propTypes = {
  action: T.string,
  onAction: T.func
};

export default ContextualDocAction;
