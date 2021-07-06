import React from 'react';
import { PropTypes as T } from 'prop-types';
import { FastField } from 'formik';
import { FormHelperMessage } from '@devseed-ui/form';

import FormGroupStructure from './form-group-structure';
import { RichTextEditor, InlineRichTextEditor } from '../../slate';

/**
 * InputText component for usage with Formik
 *
 * @prop {string} id Field id
 * @prop {string} name Field name
 * @prop {string} label Label for the field
 * @prop {function|string} labelHint Hint for the label. Setting it to true
 * shows (optional)
 * @prop {string} description Field description shown in a tooltip
 * @prop {node} helper Helper message shown below input.
 */
export function FormikInputEditor({ helper, id, ...props }) {
  return (
    <FastField {...props}>
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
            <RichTextEditor
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
    </FastField>
  );
}

FormikInputEditor.propTypes = {
  id: T.string,
  helper: T.node
};

/**
 * InputText component for usage with Formik
 *
 * @prop {string} id Field id
 * @prop {string} name Field name
 * @prop {string} label Label for the field
 * @prop {function|string} labelHint Hint for the label. Setting it to true
 * shows (optional)
 * @prop {string} description Field description shown in a tooltip
 * @prop {Array<string>} formattingOptions List of formatting options for the inline editor
 * @prop {node} helper Helper message shown below input.
 */
export function FormikInlineInputEditor({
  helper,
  id,
  formattingOptions,
  ...props
}) {
  return (
    <FastField {...props}>
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
            <InlineRichTextEditor
              formattingOptions={formattingOptions}
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
    </FastField>
  );
}

FormikInlineInputEditor.propTypes = {
  id: T.string,
  helper: T.node,
  formattingOptions: T.array
};
