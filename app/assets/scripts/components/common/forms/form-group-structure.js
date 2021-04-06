import React from 'react';
import { PropTypes as T } from 'prop-types';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody,
  FormLabel,
  FormHelper
} from '@devseed-ui/form';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';

import Tip from '../tooltip';

/**
 * From group structure.
 *
 * @prop {string} id Id used in the <FormLabel htmlFor={id}>
 * @prop {string} label Label for the group
 * @prop {node} helper Helper message shown below children.
 * @prop {node} children Elements to render inside <FormGroupBody>
 */
export default function FormGroupStructure(props) {
  const { id, label, description, helper, children } = props;

  return (
    <FormGroup>
      <FormGroupHeader>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        {description && (
          <Toolbar size='small'>
            <Tip title={description}>
              <ToolbarIconButton useIcon='circle-information' size='small'>
                More information
              </ToolbarIconButton>
            </Tip>
          </Toolbar>
        )}
      </FormGroupHeader>
      <FormGroupBody>
        {children}
        {helper && <FormHelper>{helper}</FormHelper>}
      </FormGroupBody>
    </FormGroup>
  );
}

FormGroupStructure.propTypes = {
  id: T.string,
  label: T.string,
  description: T.string,
  helper: T.node,
  children: T.node
};
