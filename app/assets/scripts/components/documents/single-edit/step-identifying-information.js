import React, { useEffect } from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import deburr from 'lodash.deburr';
import { Form, FormHelperMessage } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../styles/inpage';
import Constrainer from '../../../styles/constrainer';
import { FormikInputText, InputText } from '../../common/forms/input-text';
import SectionFieldset from '../../common/forms/section-fieldset';

const toAliasFormat = (v) =>
  deburr(v)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');

export default function StepIdentifyingInformation(props) {
  const { renderInpageHeader, atbd } = props;

  const initialValues = {
    title: atbd.title,
    alias: atbd.alias || ''
  };

  const onSubmit = (values, actions) => {
    console.log('values, actions', values, actions);
  };

  const validate = (values) => {
    let errors = {};

    if (!values.title?.trim()) {
      errors.title = 'Title is required';
    }

    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      <Inpage>
        {renderInpageHeader()}
        <InpageBody>
          <Constrainer>
            <Form as={FormikForm}>
              <SectionFieldset label='Section name'>
                <FormikInputText id='title' name='title' label='Title' />
                <FieldAtbdAlias />
              </SectionFieldset>
            </Form>
          </Constrainer>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepIdentifyingInformation.propTypes = {
  renderInpageHeader: T.func,
  atbd: T.shape({
    title: T.string,
    alias: T.string
  })
};

// The alias field needs to be a component so we can access the formik context.
const FieldAtbdAlias = () => {
  const {
    values: { title, alias },
    initialValues,
    touched,
    errors,
    setFieldValue,
    handleBlur
  } = useFormikContext();

  useEffect(() => {
    // Only create alias from title if:
    if (
      // there's no alias.
      !initialValues.alias &&
      // there was a change in the title. Avoids modifying the field when
      // mounting.
      initialValues.title !== title &&
      // the user didn't input anything yet.
      !touched.alias &&
      // There is an actual title
      title.trim()
    ) {
      setFieldValue('alias', toAliasFormat(title));
    }
  }, [
    title,
    initialValues.title,
    initialValues.alias,
    touched.title,
    touched.alias,
    setFieldValue
  ]);

  return (
    <InputText
      id='alias'
      name='alias'
      label='Alias'
      value={alias}
      onBlur={handleBlur}
      onChange={(e) => setFieldValue('alias', toAliasFormat(e.target.value))}
      invalid={!!touched.alias && !!errors.alias}
      helper={
        touched.alias &&
        errors.alias && (
          <FormHelperMessage invalid>{errors.alias}</FormHelperMessage>
        )
      }
    />
  );
};
