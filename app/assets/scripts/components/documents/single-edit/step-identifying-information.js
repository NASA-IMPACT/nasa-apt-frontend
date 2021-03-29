import React, { useCallback } from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm } from 'formik';
import { Form } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../styles/inpage';
import Constrainer from '../../../styles/constrainer';
import { FormikInputText } from '../../common/forms/input-text';
import SectionFieldset from '../../common/forms/section-fieldset';
import FieldAtbdAlias from '../../common/forms/field-atbd-alias';

import { useSingleAtbd } from '../../../context/atbds-list';
import { createProcessToast } from '../../common/toasts';
import { useHistory } from 'react-router';
import { atbdEdit } from '../../../utils/url-creator';

export default function StepIdentifyingInformation(props) {
  const { renderInpageHeader, atbd, id, version, step } = props;

  const { updateAtbd } = useSingleAtbd({ id, version });
  const history = useHistory();

  const initialValues = {
    title: atbd.title,
    alias: atbd.alias || ''
  };

  const onSubmit = useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast('Saving changes');
      const result = await updateAtbd(values);
      setSubmitting(false);

      if (result.error) {
        processToast.error(`An error occurred: ${result.error.message}`);
      } else {
        // Update the path in case the alias changed.
        if (values.alias) {
          history.replace(atbdEdit(values.alias, version, step));
        }
        processToast.success('Changes saved');
        resetForm({ values });
      }
    },
    [updateAtbd, history, version, step]
  );

  const validate = useCallback((values) => {
    let errors = {};

    if (!values.title?.trim()) {
      errors.title = 'Title is required';
    }

    return errors;
  }, []);

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
  step: T.string,
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  atbd: T.shape({
    title: T.string,
    alias: T.string
  })
};
