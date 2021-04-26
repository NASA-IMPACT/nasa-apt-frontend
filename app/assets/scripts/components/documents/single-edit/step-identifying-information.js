import React, { useCallback } from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm } from 'formik';
import { Form } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
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
import { formString } from '../../../utils/strings';
import { formStringSymbol, citationFields } from '../citation';

export default function StepIdentifyingInformation(props) {
  const { renderInpageHeader, atbd, id, version, step } = props;

  const { updateAtbd } = useSingleAtbd({ id, version });
  const history = useHistory();

  const initialValues = step.getInitialValues(atbd);

  const onSubmit = useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast('Saving changes');
      const result = await updateAtbd({
        ...values,
        // If the alias is submitted as empty string (""), the api fails with a
        // 404 error.
        alias: values.alias || null
      });
      setSubmitting(false);

      if (result.error) {
        processToast.error(`An error occurred: ${result.error.message}`);
      } else {
        resetForm({ values });
        processToast.success('Changes saved');
        // Update the path in case the alias changed.
        if (values.alias) {
          history.replace(atbdEdit(values.alias, version, step.id));
        }
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
          <FormBlock>
            <FormBlockHeading>{step.label}</FormBlockHeading>
            <Form as={FormikForm}>
              <SectionFieldset label='General'>
                <FormikInputText
                  id='title'
                  name='title'
                  label='Title'
                  description={formString('identifying_information.title')}
                />
                <FieldAtbdAlias />
              </SectionFieldset>

              <FormikSectionFieldset
                label='Citation'
                sectionName='sections_completed.citation'
              >
                {citationFields.map((field) => (
                  <FormikInputText
                    key={field.name}
                    id={`citation-${field.name}`}
                    name={`citation.${field.name}`}
                    label={field.label}
                    description={
                      field.description === formStringSymbol
                        ? formString(
                            `identifying_information.citation.${field.name}`
                          )
                        : field.description
                    }
                  />
                ))}
              </FormikSectionFieldset>
            </Form>
          </FormBlock>
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
    id: T.number,
    title: T.string,
    alias: T.string,
    document: T.object
  })
};
