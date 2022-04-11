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

export default function StepIntroduction(props) {
  const {
    renderInpageHeader,
    renderFormFooter,
    atbd,
    id,
    version,
    step
  } = props;

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
                  label={getDocumentSectionLabel('introduction')}
                  sectionName='sections_completed.introduction'
                  commentSection='introduction'
                >
                  <FormikInputEditor
                    id='introduction'
                    name='document.introduction'
                    label='Introduce the algorithm'
                    description={formString('introduction.introduction')}
                  />
                </FormikSectionFieldset>

                <FormikSectionFieldset
                  label={getDocumentSectionLabel('context_background')}
                  sectionName='sections_completed.context_background'
                  commentSection='context_background'
                >
                  <FormikInputEditor
                    id='historical_perspective'
                    name='document.historical_perspective'
                    label='Historical perspective'
                    description={formString(
                      'introduction.historical_perspective'
                    )}
                  />
                  <FormikInputEditor
                    id='additional_information'
                    name='document.additional_information'
                    label='Additional information'
                    description={formString(
                      'introduction.additional_information'
                    )}
                  />
                </FormikSectionFieldset>
              </RichTextContex2Formik>
              {renderFormFooter()}
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepIntroduction.propTypes = {
  renderInpageHeader: T.func,
  renderFormFooter: T.func,
  step: T.object,
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  atbd: T.shape({
    id: T.number,
    document: T.object
  })
};
