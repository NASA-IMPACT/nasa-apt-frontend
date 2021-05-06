import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Field } from 'formik';
import { FormTextarea, FormHelperMessage } from '@devseed-ui/form';

import FormGroupStructure from './form-group-structure';

/**
 * Textarea with form group structure.
 *
 * @prop {string} id Textarea field id
 * @prop {string} name Textarea field name
 * @prop {string} label Label for the textarea
 * @prop {function|string} labelHint Hint for the label. Setting it to true
 * shows (optional)
 * @prop {mixed} value Textarea value
 * @prop {string} inputSize Styled textarea size option
 * @prop {string} inputVariation Styled textarea variation option
 * @prop {function} onChange On change event handler
 * @prop {string} placeholder Textarea placeholder value.
 * @prop {string} description Field description shown in a tooltip
 * @prop {node} helper Helper message shown below textarea.
 */
export function InputTextarea(props) {
  const {
    id,
    label,
    labelHint,
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
      description={description}
      helper={helper}
    >
      <FormTextarea
        variation={inputVariation}
        id={id}
        size={inputSize}
        {...inputProps}
      />
    </FormGroupStructure>
  );
}

InputTextarea.propTypes = {
  id: T.string,
  name: T.string,
  label: T.string,
  labelHint: T.oneOfType([T.bool, T.func, T.string]),
  value: T.oneOfType([T.string, T.number]),
  inputSize: T.string,
  inputVariation: T.string,
  placeholder: T.oneOfType([T.string, T.number]),
  onChange: T.func,
  description: T.string,
  helper: T.node
};

/**
 * InputTextarea component for usage with Formik
 *
 * @prop {string} id Textarea field id
 * @prop {string} name Textarea field name
 * @prop {string} label Label for the textarea
 * @prop {function|string} labelHint Hint for the label. Setting it to true
 * shows (optional)
 * @prop {mixed} value Input value
 * @prop {string} inputSize Styled textarea size option
 * @prop {string} inputVariation Styled textarea variation option
 * @prop {function} onChange On change event handler
 * @prop {string} placeholder Textarea placeholder value
 * @prop {string} description Field description shown in a tooltip
 * @prop {node} helper Helper message shown below textarea.
 */
export function FormikInputTextarea({ helper, ...props }) {
  return (
    <Field {...props}>
      {({ field, meta }) => {
        return (
          <InputTextarea
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

FormikInputTextarea.propTypes = {
  helper: T.node
};
