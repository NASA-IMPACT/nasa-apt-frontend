import React from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm } from 'formik';
import { Form } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../styles/inpage';
import Constrainer from '../../../styles/constrainer';
import { FormikInputText } from '../../common/forms/input-text';
import SectionFieldset from '../../common/forms/section-fieldset';
import FieldAtbdAlias from '../../common/forms/field-atbd-alias';

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
