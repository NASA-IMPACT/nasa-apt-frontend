import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Field } from 'formik';
import { FormInput, FormHelperMessage } from '@devseed-ui/form';

import FormGroupStructure from './form-group-structure';

/**
 * Text input with form group structure.
 *
 * @prop {string} id Input field id
 * @prop {string} name Input field name
 * @prop {string} label Label for the input
 * @prop {function|string} labelHint Hint for the label. Setting it to true
 * shows (optional)
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
    labelHint,
    className,
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
    <FormGroupStructure
      id={id}
      label={label}
      labelHint={labelHint}
      className={className}
      description={description}
      helper={helper}
    >
      <FormInput
        type='text'
        variation={inputVariation}
        id={id}
        size={inputSize}
        {...inputProps}
      />
    </FormGroupStructure>
  );
}

InputText.propTypes = {
  id: T.string,
  name: T.string,
  label: T.string,
  labelHint: T.oneOfType([T.bool, T.func, T.string]),
  className: T.string,
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
 * @prop {function|string} labelHint Hint for the label. Setting it to true
 * shows (optional)
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
