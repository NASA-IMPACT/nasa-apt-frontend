import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Field } from 'formik';
import { FormHelperMessage } from '@devseed-ui/form';

import FormGroupStructure from './form-group-structure';
import FullEditor from '../../slate/editor';

/**
 * InputText component for usage with Formik
 *
 * @prop {string} id Field id
 * @prop {string} name Field name
 * @prop {string} label Label for the field
 * @prop {string} description Field description shown in a tooltip
 * @prop {node} helper Helper message shown below input.
 */
export function FormikInputEditor({ helper, id, ...props }) {
  return (
    <Field {...props}>
      {({ field, meta, form }) => {
        return (
          <FormGroupStructure
            {...props}
            id={id}
            helper={
              meta.touched && meta.error ? (
                <FormHelperMessage invalid>{meta.error}</FormHelperMessage>
              ) : (
                helper
              )
            }
          >
            <FullEditor
              id={id}
              value={field.value}
              onChange={(value) => {
                form.setFieldValue(field.name, value);
                form.setFieldTouched(field.name);
              }}
            />
          </FormGroupStructure>
        );
      }}
    </Field>
  );
}

FormikInputEditor.propTypes = {
  id: T.string,
  helper: T.node
};
