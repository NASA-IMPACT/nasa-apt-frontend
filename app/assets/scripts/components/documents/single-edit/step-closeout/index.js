import React from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm, useField } from 'formik';
import { Form, FormHelperCounter } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../../styles/form-block';
import RichTextContex2Formik from '../rich-text-ctx-formik';
import { FormikSectionFieldset } from '../../../common/forms/section-fieldset';
import { FormikInputEditor } from '../../../common/forms/input-editor';
import KeywordsField, { updateKeywordValues } from './field-keywords';
import JournalDetailsSection from './journal-details';

import { useSingleAtbd } from '../../../../context/atbds-list';
import { useSubmitForVersionData } from '../use-submit';
import { formString } from '../../../../utils/strings';
import { getDocumentSectionLabel } from '../sections';
import { LocalStore } from '../local-store';

export default function StepCloseout(props) {
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
  // Compose the submit handler.
  // When submitting, get data for the selected keywords from the GCMD api.
  const onSubmit = useSubmitForVersionData(
    updateAtbd,
    atbd,
    updateKeywordValues
  );

  return (
    <Formik
      initialValues={initialValues}
      // There's no need to validate this page since the editor already ensures
      // a valid structure
      //validate={validate}
      onSubmit={onSubmit}
    >
      <Inpage>
        <LocalStore atbd={atbd} />
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
                  <FieldAbstract />

                  <FormikInputEditor
                    id='plain_summary'
                    name='document.plain_summary'
                    label='Plain Language Summary'
                    description={formString('closeout.plain_summary')}
                    growWithContents
                  />

                  <KeywordsField />
                </FormikSectionFieldset>

                <JournalDetailsSection atbd={atbd} />
              </RichTextContex2Formik>
              {renderFormFooter()}
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepCloseout.propTypes = {
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

const MAX_ABSTRACT_WORDS = 250;

function wordCount(value) {
  const keys = Object.keys(value);

  if (keys.includes('children')) {
    return value.children.reduce((sum, child) => sum + wordCount(child), 0);
  }

  if (keys.includes('text')) {
    const trimmed = value.text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }

  return 0;
}

function FieldAbstract() {
  const [{ value }] = useField('document.abstract');
  const words = wordCount(value);

  return (
    <FormikInputEditor
      id='abstract'
      name='document.abstract'
      label='Short ATBD summary'
      description={formString('closeout.abstract')}
      growWithContents
      helper={
        <FormHelperCounter
          value={words}
          max={MAX_ABSTRACT_WORDS}
          warnAt={MAX_ABSTRACT_WORDS - 15}
        >
          word count: {words} / {MAX_ABSTRACT_WORDS}
        </FormHelperCounter>
      }
    />
  );
}
