import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';

import DropdownMenu from '../common/dropdown-menu';
import ButtonSecondary from '../../styles/button-secondary';
import { Can } from '../../a11n';

export default function DocumentGovernanceAction(props) {
  const { atbd, origin, onAction } = props;

  const control = useMemo(() => {
    if (origin === 'hub') {
      const base = {
        size: 'small',
        variation: 'primary-raised-dark'
      };
      return {
        El: Button,
        props: base,
        triggerProps: base
      };
    } else {
      return {
        El: ButtonSecondary,
        props: {},
        triggerProps: {
          forwardedAs: ButtonSecondary
        }
      };
    }
  }, [origin]);

  return (
    <React.Fragment>
      <Can do='req-review' on={atbd}>
        <control.El
          {...control.props}
          title='Submit document for review'
          onClick={useCallback(() => onAction('req-review', { atbd }), [
            onAction,
            atbd
          ])}
        >
          Request review
        </control.El>
      </Can>
      <Can do='cancel-req-review' on={atbd}>
        <control.El
          {...control.props}
          title='Cancel review submission'
          onClick={useCallback(() => onAction('cancel-req-review', { atbd }), [
            onAction,
            atbd
          ])}
        >
          Cancel request
        </control.El>
      </Can>
      <Can do='manage-req-review' on={atbd}>
        <AllowDeny
          id='req-review'
          triggerLabel='Approve request'
          triggerProps={control.triggerProps}
          dropTitle='Request for review'
          onSelect={onAction}
        />
      </Can>
    </React.Fragment>
  );
}

DocumentGovernanceAction.propTypes = {
  onAction: T.func,
  atbd: T.object,
  origin: T.oneOf(['hub', 'single-view', 'single-edit'])
};

const AllowDeny = (props) => {
  const { id, onSelect, triggerLabel, triggerProps, dropTitle } = props;

  const menu = useMemo(
    () => [
      {
        id: 'actions',
        items: [
          {
            id: `${id}-allow`,
            label: 'Allow',
            title: `Allow action ${dropTitle.toLowerCase()}`
          },
          {
            id: `${id}-deny`,
            label: 'Deny',
            title: `Deny action ${dropTitle.toLowerCase()}`
          }
        ]
      }
    ],
    [id, dropTitle]
  );

  return (
    <DropdownMenu
      menu={menu}
      withChevron
      triggerLabel={triggerLabel}
      triggerProps={triggerProps}
      alignment='right'
      direction='down'
      dropTitle={dropTitle}
      onSelect={onSelect}
    />
  );
};

AllowDeny.propTypes = {
  id: T.string,
  triggerLabel: T.string,
  triggerProps: T.object,
  dropTitle: T.string,
  onSelect: T.func
};
