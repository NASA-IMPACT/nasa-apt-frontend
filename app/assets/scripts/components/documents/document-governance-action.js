import React, { useMemo } from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';

import DropdownMenu from '../common/dropdown-menu';
import ButtonSecondary from '../../styles/button-secondary';
import { Can } from '../../a11n';

import { useSingleAtbd } from '../../context/atbds-list';

export default function DocumentGovernanceAction(props) {
  const { atbdId, version, atbd, origin, onAction } = props;

  // We need to access the mutation status to disable the action buttons when
  // the action is in flight.
  const {
    atbd: { mutationStatus }
  } = useSingleAtbd({ id: atbdId, version });

  const isMutating = mutationStatus === 'loading';

  // The governance actions are present on the dashboard and on the document
  // header, but they have a different style.
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
          useIcon='arrow-up-right'
          disabled={isMutating}
          onClick={() => onAction('req-review', { atbd })}
        >
          Request review
        </control.El>
      </Can>
      <Can do='cancel-req-review' on={atbd}>
        <control.El
          {...control.props}
          title='Cancel review request'
          useIcon='xmark--small'
          disabled={isMutating}
          onClick={() => onAction('cancel-req-review', { atbd })}
        >
          Cancel request
        </control.El>
      </Can>
      <Can do='set-own-review-done' on={atbd}>
        <control.El
          {...control.props}
          title='Conclude review of this document'
          useIcon='tick--small'
          disabled={isMutating}
          onClick={() => onAction('set-own-review-done', { atbd })}
        >
          Conclude review
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
      <Can do='open-review' on={atbd}>
        <control.El
          {...control.props}
          title='Transition document to open review stage'
          useIcon='tick--small'
          onClick={() => onAction('open-review', { atbd })}
        >
          Conclude closed review
        </control.El>
      </Can>
      <Can do='req-publication' on={atbd}>
        <control.El
          {...control.props}
          title='Submit document for publication'
          useIcon='arrow-up-right'
          disabled={isMutating}
          onClick={() => onAction('req-publication', { atbd })}
        >
          Request publication
        </control.El>
      </Can>
      <Can do='cancel-req-publication' on={atbd}>
        <control.El
          {...control.props}
          title='Cancel publication request'
          useIcon='xmark--small'
          disabled={isMutating}
          onClick={() => onAction('cancel-req-publication', { atbd })}
        >
          Cancel request
        </control.El>
      </Can>
      <Can do='manage-req-publication' on={atbd}>
        <AllowDeny
          id='req-publication'
          triggerLabel='Approve request'
          triggerProps={control.triggerProps}
          dropTitle='Request for publication'
          onSelect={onAction}
        />
      </Can>
      <Can do='publish' on={atbd}>
        <control.El
          {...control.props}
          title='Publish document'
          useIcon='arrow-up'
          disabled={isMutating}
          onClick={() => onAction('publish', { atbd })}
        >
          Publish
        </control.El>
      </Can>
    </React.Fragment>
  );
}

DocumentGovernanceAction.propTypes = {
  atbdId: T.oneOfType([T.number, T.string]),
  version: T.string,
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
            label: 'Allow...',
            title: `Allow action ${dropTitle.toLowerCase()}`
          },
          {
            id: `${id}-deny`,
            label: 'Deny...',
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