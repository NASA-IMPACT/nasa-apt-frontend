import React from 'react';
import T from 'prop-types';
import {
  FormFieldset,
  FormFieldsetHeader,
  FormFieldsetBody,
  FormLegend
} from '@devseed-ui/form';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';
import Tip from '../tooltip';

/**
 * Fieldset for multi item fields with a trash icon
 *
 * @prop {string} label Label for the fieldset section
 * @prop {function} onDeleteClick Callback for delete click.
 */
export function DeletableFieldset(props) {
  const {
    children,
    label,
    onDeleteClick,
    disableDelete,
    deleteDescription,
    ...rest
  } = props;

  return (
    <FormFieldset {...rest}>
      <FormFieldsetHeader>
        <FormLegend>{label}</FormLegend>
        <Toolbar size='small'>
          <Tip title={deleteDescription}>
            <ToolbarIconButton
              disabled={disableDelete}
              useIcon='trash-bin'
              size='small'
              onClick={onDeleteClick}
            >
              Delete
            </ToolbarIconButton>
          </Tip>
        </Toolbar>
      </FormFieldsetHeader>
      <FormFieldsetBody>{children}</FormFieldsetBody>
    </FormFieldset>
  );
}

DeletableFieldset.propTypes = {
  children: T.node,
  label: T.string,
  onDeleteClick: T.func,
  disableDelete: T.bool,
  deleteDescription: T.string
};
