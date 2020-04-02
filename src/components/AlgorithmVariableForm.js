import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Value } from 'slate';

import { InputFormGroup } from './common/Input';
import Form from '../styles/form/form';
import { getValidOrBlankDocument } from './editorBlankDocument';
import InputEditor from './common/InputEditor';
import SaveFormButton from '../styles/button/save-form';

const name = 'name';
const long_name = 'long_name';
const unit = 'unit';

export const InnerAlgorithmVariableForm = (props) => {
  const {
    values,
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    t
  } = props;
  const submitEnabled = !Object.keys(errors).length
                                  && Object.keys(touched).length >= 3;

  const editorOnChange = id => (val) => {
    setFieldValue(id, val);
    // For some reason not fully understood blur events work weirdly with slate
    // causing race conditions and infinite loops.
    // One option is to use a blur event with a setTimeout to move the state
    // changing code to the next tick. Example:
    // const editorOnBlur = id => (event, editor, next) => {
    //   setTimeout(() => setFieldTouched(id), 0);
    //   next();
    // };
    // The above code works but the author suggested for the change event to be
    // used instead https://github.com/ianstormtaylor/slate/issues/2640#issuecomment-476447608
    // So we compare the previous focused state with the current and set the
    // field as touched when needed.
    // Some relevant issues:
    // https://github.com/ianstormtaylor/slate/issues/2434
    // https://github.com/ianstormtaylor/slate/issues/2640
    // Quick compare to see if the field changed before the "blur".
    const prev = JSON.stringify(values[id].toJSON());
    const next = JSON.stringify(val.toJSON());
    if ((values[id].selection.isFocused && !val.selection.isFocused) || prev !== next) {
      setFieldTouched(id);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputFormGroup>
        <InputEditor
          id={name}
          label="Name"
          onChange={editorOnChange(name)}
          value={values[name]}
          error={errors[name]}
          touched={!!touched[name]}
          info={t.name}
        />
        <InputEditor
          id={long_name}
          label="Long Name"
          onChange={editorOnChange(long_name)}
          value={values[long_name]}
          error={errors[long_name]}
          touched={!!touched[long_name]}
          info={t.long_name}
        />
        <InputEditor
          id={unit}
          label="Unit"
          onChange={editorOnChange(unit)}
          value={values[unit]}
          error={errors[unit]}
          touched={!!touched[unit]}
          info={t.unit}
        />
      </InputFormGroup>
      <SaveFormButton disabled={!submitEnabled}>
        Save new variable
      </SaveFormButton>
    </Form>
  );
};

InnerAlgorithmVariableForm.propTypes = {
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  t: PropTypes.object
};

export const AlgorithmVariableForm = withFormik({
  mapPropsToValues: (props) => {
    const { atbd_id, atbd_version } = props;
    const initialValues = {
      atbd_id,
      atbd_version,
      [name]: Value.fromJSON(getValidOrBlankDocument('')),
      [long_name]: Value.fromJSON(getValidOrBlankDocument('')),
      [unit]: Value.fromJSON(getValidOrBlankDocument(''))
    };
    return initialValues;
  },

  // validate: (values, props) => {
  //   // TODO: Add proper validation!
  //   return {};
  //   let errors = {};
  //   const { schemaKey } = props;
  //   const schema = apiSchema.definitions[`${schemaKey}s`];
  //   schema.required = schema.required.filter(
  //     property => (property !== `${schemaKey}_id`)
  //   );
  //   errors = transformErrors(
  //     validator.validate(values, schema).errors
  //   );
  //   return errors;
  // },

  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const { create } = props;
    const parsedVals = {
      ...values,
      [name]: values[name].toJSON(),
      [long_name]: values[long_name].toJSON(),
      [unit]: values[unit].toJSON()
    };
    create(parsedVals);
    setSubmitting(false);
    resetForm();
  }
})(InnerAlgorithmVariableForm);

AlgorithmVariableForm.propTypes = {
  create: PropTypes.func.isRequired,
  schemaKey: PropTypes.string.isRequired,
  atbd_id: PropTypes.number.isRequired,
  atbd_version: PropTypes.number.isRequired,
  t: PropTypes.object
};

export default AlgorithmVariableForm;
