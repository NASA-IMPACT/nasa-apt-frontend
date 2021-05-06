import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Field } from 'formik';
import { FormSelect, FormHelperMessage } from '@devseed-ui/form';

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
 * @prop {array} options Select options. Must have a value and a label. Value
 * must be unique
 * @prop {string} description Field description shown in a tooltip
 * @prop {node} helper Helper message shown below input.
 */
export function InputSelect(props) {
  const {
    id,
    label,
    labelHint,
    className,
    inputSize,
    inputVariation,
    description,
    helper,
    options,
    // All other props are passed directly to the input
    // name,
    // value,
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
      <FormSelect
        variation={inputVariation}
        id={id}
        size={inputSize}
        {...inputProps}
      >
        {options.map(({ value, label, ...rest }) => (
          <option key={value} value={value} {...rest}>
            {label}
          </option>
        ))}
      </FormSelect>
    </FormGroupStructure>
  );
}

InputSelect.propTypes = {
  id: T.string,
  name: T.string,
  label: T.string,
  labelHint: T.oneOfType([T.bool, T.func, T.string]),
  className: T.string,
  value: T.oneOfType([T.string, T.number]),
  options: T.arrayOf(
    T.shape({
      value: T.oneOfType([T.string, T.number]),
      label: T.oneOfType([T.string, T.number])
    })
  ),
  inputSize: T.string,
  inputVariation: T.string,
  onChange: T.func,
  description: T.string,
  helper: T.node
};

/**
 * InputSelect component for usage with Formik
 *
 * @prop {string} id Input field id
 * @prop {string} name Input field name
 * @prop {string} label Label for the input
 * @prop {function|string} labelHint Hint for the label. Setting it to true
 * shows (optional)
 * @prop {mixed} value Input value
 * @prop {string} inputSize Styled input size option
 * @prop {string} inputVariation Styled input variation option
 * @prop {array} options Select options. Must have a value and a label. Value
 * must be unique
 * @prop {function} onChange On change event handler
 * @prop {string} description Field description shown in a tooltip
 * @prop {node} helper Helper message shown below input.
 */
export function FormikInputSelect({ helper, ...props }) {
  return (
    <Field {...props}>
      {({ field, meta }) => {
        return (
          <InputSelect
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

FormikInputSelect.propTypes = {
  helper: T.node
};
