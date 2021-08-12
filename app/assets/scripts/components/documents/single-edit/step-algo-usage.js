import React from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm } from 'formik';
import { Form } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import { FormikInputEditor } from '../../common/forms/input-editor';
import { FormikSectionFieldset } from '../../common/forms/section-fieldset';
import RichTextContex2Formik from './rich-text-ctx-formik';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useSubmitForVersionData } from './use-submit';
import { formString } from '../../../utils/strings';
import { getDocumentSectionLabel } from './sections';

export default function StepAlgoUsage(props) {
  const { renderInpageHeader, atbd, id, version, step } = props;

  const { updateAtbd } = useSingleAtbd({ id, version });
  const initialValues = step.getInitialValues(atbd);

  const onSubmit = useSubmitForVersionData(updateAtbd, atbd);

  return (
    <Formik
      initialValues={initialValues}
      // There's no need to validate this page since the editor already ensures
      // a valid structure
      //validate={validate}
      onSubmit={onSubmit}
    >
      <Inpage>
        {renderInpageHeader()}
        <InpageBody>
          <FormBlock>
            <FormBlockHeading>{step.label}</FormBlockHeading>
            <Form as={FormikForm}>
              <RichTextContex2Formik>
                <FormikSectionFieldset
                  label={getDocumentSectionLabel('constraints')}
                  sectionName='sections_completed.constraints'
                  commentSection='constraints'
                >
                  <FormikInputEditor
                    id='algorithm_usage_constraints'
                    name='document.algorithm_usage_constraints'
                    label='Describe the limitations and constraints on output data product use'
                    description={formString('algorithm_usage.constraints')}
                  />
                </FormikSectionFieldset>

                <FormBlockHeading>Performance Assessment</FormBlockHeading>

                <FormikSectionFieldset
                  label={getDocumentSectionLabel('validation')}
                  sectionName='sections_completed.validation'
                  commentSection='validation'
                >
                  <FormikInputEditor
                    id='performance_assessment_validation_methods'
                    name='document.performance_assessment_validation_methods'
                    label='Validation Methods'
                    description={formString(
                      'algorithm_usage.validation_methods'
                    )}
                  />

                  <FormikInputEditor
                    id='performance_assessment_validation_uncertainties'
                    name='document.performance_assessment_validation_uncertainties'
                    label='Uncertainties'
                    description={formString(
                      'algorithm_usage.validation_uncertainties'
                    )}
                  />

                  <FormikInputEditor
                    id='performance_assessment_validation_errors'
                    name='document.performance_assessment_validation_errors'
                    label='Estimated Errors'
                    description={formString(
                      'algorithm_usage.validation_errors'
                    )}
                  />
                </FormikSectionFieldset>
              </RichTextContex2Formik>
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepAlgoUsage.propTypes = {
  renderInpageHeader: T.func,
  step: T.object,
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  atbd: T.shape({
    id: T.number,
    document: T.object
  })
};
