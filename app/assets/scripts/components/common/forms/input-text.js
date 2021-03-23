import React from 'react';
import { PropTypes as T } from 'prop-types';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody,
  FormLabel,
  FormInput,
  FormHelper
} from '@devseed-ui/form';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';

import Tip from '../tooltip';

/**
 * From group input structure.
 *
 * @prop {string} id Input field id
 * @prop {string} name Input field name
 * @prop {string} label Label for the input
 * @prop {mixed} value Input value
 * @prop {string} inputSize Styled input size option
 * @prop {string} inputVariation Styled input variation option
 * @prop {function} onChange On change event handler
 * @prop {string} placeholder Input placeholder value.
 */
export default function InputText(props) {
  const {
    id,
    name,
    label,
    value,
    inputSize,
    inputVariation,
    placeholder,
    onChange,
    description,
    helper
  } = props;

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
        <FormInput
          type='text'
          variation={inputVariation}
          name={name}
          id={id}
          size={inputSize}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        {helper && <FormHelper>{helper}</FormHelper>}
      </FormGroupBody>
    </FormGroup>
  );
}

InputText.propTypes = {
  id: T.string,
  name: T.string,
  label: T.string,
  value: T.oneOfType([T.string, T.number]),
  inputSize: T.string,
  inputVariation: T.string,
  placeholder: T.oneOfType([T.string, T.number]),
  onChange: T.func,
  description: T.string,
  helper: T.node
};
