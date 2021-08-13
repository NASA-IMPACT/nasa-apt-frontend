import React from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { Form, FormCheckableGroup } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import RichTextContex2Formik from './rich-text-ctx-formik';
import { FormikInputEditor } from '../../common/forms/input-editor';
import { FormikSectionFieldset } from '../../common/forms/section-fieldset';
import { FormikInputCheckable } from '../../common/forms/input-checkable';
import FormGroupStructure from '../../common/forms/form-group-structure';
import Tip from '../../common/tooltip';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useSubmitForVersionData } from './use-submit';
import { formString } from '../../../utils/strings';
import { getDocumentSectionLabel } from './sections';
import {
  isJournalPublicationIntended,
  isPublicationOrAfter,
  JOURNAL_NO_PUBLICATION,
  JOURNAL_PUBLISHED,
  JOURNAL_PUB_INTENDED,
  JOURNAL_SUBMITTED
} from '../status';

export default function StepCloseout(props) {
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
                  label={getDocumentSectionLabel('abstract')}
                  sectionName='sections_completed.abstract'
                  commentSection='abstract'
                >
                  <FormikInputEditor
                    id='abstract'
                    name='document.abstract'
                    label='Short ATBD summary'
                    description={formString('closeout.abstract')}
                  />
                </FormikSectionFieldset>

                <JournalDetails />
              </RichTextContex2Formik>
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepCloseout.propTypes = {
  renderInpageHeader: T.func,
  step: T.object,
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  atbd: T.shape({
    id: T.number,
    document: T.object
  })
};

const journalStatuses = [
  {
    value: JOURNAL_NO_PUBLICATION,
    label: 'Not to be published',
    enabled: () => true
  },
  {
    value: JOURNAL_PUB_INTENDED,
    label: 'To be published',
    enabled: () => true
  },
  {
    value: JOURNAL_SUBMITTED,
    label: 'Submitted',
    enabled: isPublicationOrAfter
  },
  {
    value: JOURNAL_PUBLISHED,
    label: 'Published',
    enabled: isPublicationOrAfter
  }
];

function JournalDetails(props) {
  const { atbd } = props;
  const { values } = useFormikContext();

  return (
    <React.Fragment>
      <FormBlockHeading>Journal details</FormBlockHeading>
      <FormGroupStructure label='Journal publication process'>
        <FormCheckableGroup>
          {journalStatuses.map((s) => {
            const isDisabled = !s.enabled(atbd);

            const radio = (
              <FormikInputCheckable
                key={s.value}
                id={`journal_status-${s.value}`}
                name='journal_status'
                type='radio'
                value={s.value}
                disabled={isDisabled}
              >
                {s.label}
              </FormikInputCheckable>
            );

            return isDisabled ? (
              <Tip
                title='This option can only be selected after the document enters the Publication stage.'
                key={s.value}
              >
                {radio}
              </Tip>
            ) : (
              radio
            );
          })}
        </FormCheckableGroup>
      </FormGroupStructure>

      {isJournalPublicationIntended(values.journal_status) && (
        <React.Fragment>
          <FormikSectionFieldset
            label={getDocumentSectionLabel('discussion')}
            sectionName='sections_completed.discussion'
            commentSection='discussion'
          >
            <FormikInputEditor
              id='journal_discussion'
              name='document.journal_discussion'
              label='Significance Discussion'
              description={formString('closeout.discussion')}
            />
            <FormikInputEditor
              id='data_availability'
              name='document.data_availability'
              label='Data availability statements'
              description={formString('closeout.data_availability')}
            />
          </FormikSectionFieldset>

          <FormikSectionFieldset
            label={getDocumentSectionLabel('acknowledgements')}
            sectionName='sections_completed.acknowledgements'
            commentSection='acknowledgements'
          >
            <FormikInputEditor
              id='journal_acknowledgements'
              name='document.journal_acknowledgements'
              label='Acknowledgment List'
              description={formString('closeout.acknowledgements')}
            />
          </FormikSectionFieldset>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

JournalDetails.propTypes = {
  atbd: T.shape({
    status: T.string
  })
};
