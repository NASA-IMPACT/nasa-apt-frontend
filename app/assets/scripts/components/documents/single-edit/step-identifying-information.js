import React, { useCallback } from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm } from 'formik';
import { Form } from '@devseed-ui/form';
import { Heading } from '@devseed-ui/typography';

import { Inpage, InpageBody } from '../../../styles/inpage';
import Constrainer from '../../../styles/constrainer';
import { FormikInputText } from '../../common/forms/input-text';
import {
  FormikSectionFieldset,
  SectionFieldset
} from '../../common/forms/section-fieldset';
import FieldAtbdAlias from '../../common/forms/field-atbd-alias';

import { useSingleAtbd } from '../../../context/atbds-list';
import { createProcessToast } from '../../common/toasts';
import { useHistory } from 'react-router';
import { atbdEdit } from '../../../utils/url-creator';

export default function StepIdentifyingInformation(props) {
  const { renderInpageHeader, atbd, id, version, step } = props;

  const { updateAtbd } = useSingleAtbd({ id, version });
  const history = useHistory();

  const initialValues = step.getInitialValues(atbd);

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
          history.replace(atbdEdit(values.alias, version, step.id));
        }
        processToast.success('Changes saved');
        resetForm({ values });
      }
    },
    [updateAtbd, history, version, step.id]
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
            <Heading>{step.label}</Heading>
            <Form as={FormikForm}>
              <SectionFieldset label='General'>
                <FormikInputText id='title' name='title' label='Title' />
                <FieldAtbdAlias />
              </SectionFieldset>

              <FormikSectionFieldset
                label='Citation'
                sectionName='sections_completed.citation'
              >
                <FormikInputText
                  id='citation-creators'
                  name='citation.creators'
                  label='Creators'
                />
                <FormikInputText
                  id='citation-editors'
                  name='citation.editors'
                  label='Editors'
                />
                <FormikInputText
                  id='citation-title'
                  name='citation.title'
                  label='Title'
                />
                <FormikInputText
                  id='citation-series_name'
                  name='citation.series_name'
                  label='Series name'
                />
                <FormikInputText
                  id='citation-release_date'
                  name='citation.release_date'
                  label='Release date'
                />
                <FormikInputText
                  id='citation-release_place'
                  name='citation.release_place'
                  label='Release place'
                />
                <FormikInputText
                  id='citation-publisher'
                  name='citation.publisher'
                  label='Publisher'
                />
                <FormikInputText
                  id='citation-version'
                  name='citation.version'
                  label='Version'
                />
                <FormikInputText
                  id='citation-issue'
                  name='citation.issue'
                  label='Issue'
                />
                <FormikInputText
                  id='citation-additional_details'
                  name='citation.additional_details'
                  label='Additional details'
                />
                <FormikInputText
                  id='citation-online_resource'
                  name='citation.online_resource'
                  label='Online resource'
                />
              </FormikSectionFieldset>
            </Form>
          </Constrainer>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepIdentifyingInformation.propTypes = {
  renderInpageHeader: T.func,
  step: T.object,
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  atbd: T.shape({
    title: T.string,
    alias: T.string
  })
};
