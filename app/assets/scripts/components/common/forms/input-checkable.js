import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Field } from 'formik';

// Temporary while liv is fixed.
import { FormCheckable } from './devseedui-checkable';

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
export function FormikInputCheckable({
  children,
  textPlacement,
  hideText,
  ...props
}) {
  return (
    <Field {...props}>
      {({ field, meta }) => {
        return (
          <FormCheckable
            {...props}
            {...field}
            textPlacement={textPlacement}
            hideText={hideText}
            invalid={meta.touched && meta.error ? true : undefined}
          >
            {children}
          </FormCheckable>
        );
      }}
    </Field>
  );
}

FormikInputCheckable.propTypes = {
  children: T.node,
  textPlacement: T.string,
  hideText: T.bool
};
