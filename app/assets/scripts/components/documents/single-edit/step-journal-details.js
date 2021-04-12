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
import { formString } from '../../../utils/strings';

export default function StepJournalDetails(props) {
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
            <p>
              The journal details will only be included in the Journal PDF
              export.
            </p>
            <Form as={FormikForm}>
              <FormikSectionFieldset
                label='Discussion'
                sectionName='sections_completed.discussion'
              >
                <FormikInputEditor
                  id='journal_discussion'
                  name='document.journal_discussion'
                  label='List discussion points'
                  description={formString('journal_details.discussion')}
                />
              </FormikSectionFieldset>

              <FormikSectionFieldset
                label='Acknowledgements'
                sectionName='sections_completed.acknowledgements'
              >
                <FormikInputEditor
                  id='journal_acknowledgements'
                  name='document.journal_acknowledgements'
                  label='List of acknowledgements'
                  description={formString('journal_details.acknowledgements')}
                />
              </FormikSectionFieldset>
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepJournalDetails.propTypes = {
  renderInpageHeader: T.func,
  step: T.object,
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  atbd: T.shape({
    id: T.number,
    document: T.object
  })
};
