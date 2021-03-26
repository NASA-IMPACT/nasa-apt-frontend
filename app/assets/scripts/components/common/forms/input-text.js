import React from 'react';
import { PropTypes as T } from 'prop-types';
import {
  FormGroup,
  FormGroupHeader,
  FormGroupBody,
  FormLabel,
  FormInput,
  FormHelper,
  FormHelperMessage
} from '@devseed-ui/form';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';

import Tip from '../tooltip';
import { Field } from 'formik';

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
 * @prop {string} description Field description shown in a tooltip
 * @prop {node} helper Helper message shown below input.
 */
export function InputText(props) {
  const {
    id,
    label,
    inputSize,
    inputVariation,
    description,
    helper,
    // All other props are passed directly to the input
    // name,
    // value,
    // placeholder,
    // onChange,
    // onBlur
    ...inputProps
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
          id={id}
          size={inputSize}
          {...inputProps}
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

/**
 * InputText component for usage with Formik
 *
 * @prop {string} id Input field id
 * @prop {string} name Input field name
 * @prop {string} label Label for the input
 * @prop {mixed} value Input value
 * @prop {string} inputSize Styled input size option
 * @prop {string} inputVariation Styled input variation option
 * @prop {function} onChange On change event handler
 * @prop {string} placeholder Input placeholder value
 * @prop {string} description Field description shown in a tooltip
 * @prop {node} helper Helper message shown below input.
 */
export function FormikInputText({ helper, ...props }) {
  return (
    <Field {...props}>
      {({ field, meta }) => {
        return (
          <InputText
            {...props}
            {...field}
            invalid={!!meta.touched && !!meta.error}
            helper={
              meta.touched && meta.error ? (
                <FormHelperMessage invalid>{meta.error}</FormHelperMessage>
              ) : (
                helper
              )
            }
          />
        );
      }}
    </Field>
  );
}

FormikInputText.propTypes = {
  helper: T.node
};
