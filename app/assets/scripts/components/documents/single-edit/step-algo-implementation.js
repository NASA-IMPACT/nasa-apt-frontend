import React from 'react';
import T from 'prop-types';
import get from 'lodash.get';
import { Formik, Form as FormikForm, FieldArray } from 'formik';
import { Form } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import { FormikInputEditor } from '../../common/forms/input-editor';
import { FormikSectionFieldset } from '../../common/forms/section-fieldset';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useSubmitForVersionData } from './use-submit';
import { FormikInputText } from '../../common/forms/input-text';
import { editorEmptyValue } from '../../slate/editor';
import { FieldMultiItem } from '../../common/forms/field-multi-item';
import { DeletableFieldset } from '../../common/forms/deletable-fieldset';

// The initial value is the same for
// Algorithm Implementations
// Data Access Input Data
// Data Access Output Data
// Data Access Related Urls
const emptyFieldValue = {
  url: '',
  description: editorEmptyValue
};

export default function StepAlgoImplementation(props) {
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
              <UrlDescriptionSection
                sectionLabel='Algorithm Implementation'
                sectionName='sections_completed.algorithm_implementations'
                fieldLabel='Algorithm Implementations'
                fieldName='document.algorithm_implementations'
                // fieldDescription='Description for the array fields popover'
                fieldEmptyMessage='There are no Algorithm Implementations. You can start by adding one.'
                urlFieldInfo='The direct access mechanisms to the algorithm implementation source code.'
                descriptionFieldInfo='Relevant information needed to execute the algorithm implementation. May include, but not be limited to, execution instructions, memory requirements, programming languages and dependencies.'
              />

              <UrlDescriptionSection
                sectionLabel='Data Access Input'
                sectionName='sections_completed.data_access_input_data'
                fieldLabel='Data Access Inputs'
                fieldName='document.data_access_input_data'
                // fieldDescription='Description for the array fields popover'
                fieldEmptyMessage='There are no Data Access Inputs. You can start by adding one.'
                urlFieldInfo='Algorithm input data access URL.'
                descriptionFieldInfo='Description of the data access method. Provides context on how to access the data.'
              />

              <UrlDescriptionSection
                sectionLabel='Data Access Output'
                sectionName='sections_completed.data_access_output_data'
                fieldLabel='Data Access Outputs'
                fieldName='document.data_access_output_data'
                // fieldDescription='Description for the array fields popover'
                fieldEmptyMessage='There are no Data Access Outputs. You can start by adding one.'
                urlFieldInfo='Algorithm output data access URL.'
                descriptionFieldInfo='Description of the data access method. Provides context on how to access the data.'
              />

              <UrlDescriptionSection
                sectionLabel='Data Access Related Urls'
                sectionName='sections_completed.data_access_related_urls'
                fieldLabel='Data Access Related Urls'
                fieldName='document.data_access_related_urls'
                // fieldDescription='Description for the array fields popover'
                fieldEmptyMessage='There are no Data Access Related Urls. You can start by adding one.'
                urlFieldInfo='Alternative data access mechanisms including links to machine services, ordering services and DAAC websites.'
                descriptionFieldInfo='Description of the alternative data access method provided.'
              />
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
    fieldLabel,
    fieldName,
    fieldDescription,
    fieldEmptyMessage,
    urlFieldInfo,
    descriptionFieldInfo
  } = props;

  return (
    <FormikSectionFieldset label={sectionLabel} sectionName={sectionName}>
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
            {get(form.values, name).map((field, index) => (
              <DeletableFieldset
                /* eslint-disable-next-line react/no-array-index-key */
                key={index}
                id={`${name}.${index}`}
                label={`Entry #${index + 1}`}
                onDeleteClick={() => remove()}
              >
                <FormikInputText
                  id={`${name}.${index}.url`}
                  name={`${name}.${index}.url`}
                  label='Url'
                  description={urlFieldInfo}
                />
                <FormikInputEditor
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
  fieldLabel: T.string,
  fieldName: T.string,
  fieldDescription: T.string,
  fieldEmptyMessage: T.node,
  urlFieldInfo: T.string,
  descriptionFieldInfo: T.string
};
