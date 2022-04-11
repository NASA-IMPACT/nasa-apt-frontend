import React from 'react';
import T from 'prop-types';
import get from 'lodash.get';
import { Formik, Form as FormikForm, FieldArray } from 'formik';
import { Form } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import { FormikInputTextarea } from '../../common/forms/input-textarea';
import { FormikSectionFieldset } from '../../common/forms/section-fieldset';
import { FormikInputText } from '../../common/forms/input-text';
import { FieldMultiItem } from '../../common/forms/field-multi-item';
import { DeletableFieldset } from '../../common/forms/deletable-fieldset';
import RichTextContex2Formik from './rich-text-ctx-formik';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useSubmitForVersionData } from './use-submit';
import { formString } from '../../../utils/strings';
import { getDocumentSectionLabel } from './sections';
import { LocalStore } from './local-store';

// The initial value is the same for
// Algorithm Implementations
// Data Access Input Data
// Data Access Output Data
// Data Access Related Urls
const emptyFieldValue = {
  url: '',
  description: ''
};

export default function StepAlgoImplementation(props) {
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
        <LocalStore atbd={atbd} />
        {renderInpageHeader()}
        <InpageBody>
          <FormBlock>
            <FormBlockHeading>{step.label}</FormBlockHeading>
            <Form as={FormikForm}>
              <RichTextContex2Formik>
                <UrlDescriptionSection
                  sectionLabel={getDocumentSectionLabel(
                    'algorithm_availability'
                  )}
                  sectionName='sections_completed.algorithm_availability'
                  commentSection='algorithm_availability'
                  fieldLabel='Location of Implemented Algorithm'
                  fieldName='document.algorithm_implementations'
                  fieldEmptyMessage='There are no Algorithm Implementations. You can start by adding one.'
                />

                <UrlDescriptionSection
                  sectionLabel={getDocumentSectionLabel(
                    'data_access_input_data'
                  )}
                  sectionName='sections_completed.data_access_input_data'
                  commentSection='data_access_input_data'
                  fieldLabel='Input Data Access'
                  fieldName='document.data_access_input_data'
                  fieldEmptyMessage='There are no entries for Input Data Access. You can start by adding one.'
                />

                <UrlDescriptionSection
                  sectionLabel={getDocumentSectionLabel(
                    'data_access_output_data'
                  )}
                  sectionName='sections_completed.data_access_output_data'
                  commentSection='data_access_output_data'
                  fieldLabel='Output Data Access'
                  fieldName='document.data_access_output_data'
                  fieldEmptyMessage='There are no entries for Output Data Access. You can start by adding one.'
                />

                <UrlDescriptionSection
                  sectionLabel={getDocumentSectionLabel(
                    'data_access_related_urls'
                  )}
                  sectionName='sections_completed.data_access_related_urls'
                  commentSection='data_access_related_urls'
                  fieldLabel='Important Related Urls'
                  fieldName='document.data_access_related_urls'
                  fieldEmptyMessage='There are no Important Related Urls. You can start by adding one.'
                />
              </RichTextContex2Formik>
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepAlgoImplementation.propTypes = {
  renderInpageHeader: T.func,
  step: T.object,
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  atbd: T.shape({
    id: T.number,
    document: T.object
  })
};

// All the sections in this step are like the one below.
// Keeping a separate component in this file since it is very local.
const UrlDescriptionSection = (props) => {
  const {
    sectionLabel,
    sectionName,
    commentSection,
    fieldLabel,
    fieldName,
    fieldEmptyMessage
  } = props;

  const path = fieldName.replace(/^document\./, '');

  const fieldDescription = formString(
    `algorithm_implementation.${path}.fieldset`
  );
  const urlFieldInfo = formString(`algorithm_implementation.${path}.url`);
  const descriptionFieldInfo = formString(
    `algorithm_implementation.${path}.description`
  );

  return (
    <FormikSectionFieldset
      label={sectionLabel}
      sectionName={sectionName}
      commentSection={commentSection}
    >
      <FieldArray
        name={fieldName}
        render={({ remove, push, form, name }) => (
          <FieldMultiItem
            id={name}
            label={fieldLabel}
            description={fieldDescription}
            emptyMessage={fieldEmptyMessage}
            onAddClick={() => push(emptyFieldValue)}
          >
            {get(form.values, name).map((field, index, all) => (
              <DeletableFieldset
                /* eslint-disable-next-line react/no-array-index-key */
                key={index}
                id={`${name}.${index}`}
                label={`Entry #${index + 1}`}
                disableDelete={all.length === 1}
                deleteDescription={
                  all.length === 1 ? 'At least 1 entry is required.' : null
                }
                onDeleteClick={() => remove(index)}
              >
                <FormikInputText
                  id={`${name}.${index}.url`}
                  name={`${name}.${index}.url`}
                  label='Url'
                  description={urlFieldInfo}
                />
                <FormikInputTextarea
                  id={`${name}.${index}.description`}
                  name={`${name}.${index}.description`}
                  label='Description'
                  description={descriptionFieldInfo}
                />
              </DeletableFieldset>
            ))}
          </FieldMultiItem>
        )}
      />
    </FormikSectionFieldset>
  );
};

UrlDescriptionSection.propTypes = {
  sectionLabel: T.string,
  sectionName: T.string,
  commentSection: T.string,
  fieldLabel: T.string,
  fieldName: T.string,
  fieldEmptyMessage: T.node
};
