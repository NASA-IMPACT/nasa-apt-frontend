import React from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm } from 'formik';
import { Form } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import { FormikInputEditor } from '../../common/forms/input-editor';
import { FormikSectionFieldset } from '../../common/forms/section-fieldset';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useSubmitForVersionData } from './use-submit';

export default function StepAlgoDescription(props) {
  const { renderInpageHeader, atbd, id, version, step } = props;

  const { updateAtbd } = useSingleAtbd({ id, version });
  const initialValues = step.getInitialValues(atbd);

  const onSubmit = useSubmitForVersionData(updateAtbd);

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
              <FormikSectionFieldset
                label='Scientific Theory'
                sectionName='sections_completed.scientific_theory'
              >
                <FormikInputEditor
                  id='scientific_theory'
                  name='document.scientific_theory'
                  label='Describe the scientific theory'
                />

                <FormikInputEditor
                  id='scientific_theory_assumptions'
                  name='document.scientific_theory_assumptions'
                  label='Scientific theory assumptions'
                />
              </FormikSectionFieldset>

              <FormikSectionFieldset
                label='Mathematical Theory'
                sectionName='sections_completed.mathematical_theory'
              >
                <FormikInputEditor
                  id='mathematical_theory'
                  name='document.mathematical_theory'
                  label='Describe the mathematical theory'
                />

                <FormikInputEditor
                  id='mathematical_theory_assumptions'
                  name='document.mathematical_theory_assumptions'
                  label='Mathematical theory assumptions'
                />
              </FormikSectionFieldset>

              <FormikSectionFieldset
                label='Input Variables'
                sectionName='sections_completed.input_variables'
              >
                Coming Soon.
              </FormikSectionFieldset>

              <FormikSectionFieldset
                label='Output Variables'
                sectionName='sections_completed.output_variables'
              >
                Coming Soon.
              </FormikSectionFieldset>
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepAlgoDescription.propTypes = {
  renderInpageHeader: T.func,
  step: T.object,
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  atbd: T.shape({
    title: T.string,
    alias: T.string
  })
};
