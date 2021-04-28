import React from 'react';
import T from 'prop-types';
import get from 'lodash.get';
import styled from 'styled-components';
import { Formik, Form as FormikForm, FieldArray } from 'formik';
import { Form, FormFieldsetBody } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import {
  FormikInlineInputEditor,
  FormikInputEditor
} from '../../common/forms/input-editor';
import { FormikSectionFieldset } from '../../common/forms/section-fieldset';
import { FieldMultiItem } from '../../common/forms/field-multi-item';
import { DeletableFieldset } from '../../common/forms/deletable-fieldset';
import RichTextContex2Formik from './rich-text-ctx-formik';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useSubmitForVersionData } from './use-submit';
import { formString } from '../../../utils/strings';
import { editorEmptyValue } from '../../slate';

const DeletableFieldsetTriptic = styled(DeletableFieldset)`
  ${FormFieldsetBody} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const variableFieldsFormattigOprions = ['subsupscript'];

const variableFieldsEmptyValue = {
  name: editorEmptyValue,
  long_name: editorEmptyValue,
  unit: editorEmptyValue
};

export default function StepAlgoDescription(props) {
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
                  label='Scientific Theory'
                  sectionName='sections_completed.scientific_theory'
                >
                  <FormikInputEditor
                    id='scientific_theory'
                    name='document.scientific_theory'
                    label='Describe the scientific theory'
                    description={formString(
                      'algorithm_description.scientific_theory'
                    )}
                  />

                  <FormikInputEditor
                    id='scientific_theory_assumptions'
                    name='document.scientific_theory_assumptions'
                    label='Scientific theory assumptions'
                    description={formString(
                      'algorithm_description.scientific_theory_assumptions'
                    )}
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
                    description={formString(
                      'algorithm_description.mathematical_theory'
                    )}
                  />

                  <FormikInputEditor
                    id='mathematical_theory_assumptions'
                    name='document.mathematical_theory_assumptions'
                    label='Mathematical theory assumptions'
                    description={formString(
                      'algorithm_description.mathematical_theory_assumptions'
                    )}
                  />
                </FormikSectionFieldset>

                <VariablesSection
                  sectionLabel='Input Variables'
                  sectionName='sections_completed.input_variables'
                  fieldLabel='Variables'
                  fieldName='document.algorithm_input_variables'
                  fieldEmptyMessage='There are no Input Variables. You can start by adding one.'
                />

                <VariablesSection
                  sectionLabel='Output Variables'
                  sectionName='sections_completed.output_variables'
                  fieldLabel='Variables'
                  fieldName='document.algorithm_output_variables'
                  fieldEmptyMessage='There are no Output Variables. You can start by adding one.'
                />
              </RichTextContex2Formik>
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
    id: T.number,
    document: T.object
  })
};

const VariablesSection = (props) => {
  const {
    sectionLabel,
    sectionName,
    fieldLabel,
    fieldName,
    fieldEmptyMessage
  } = props;

  const path = fieldName.replace(/^document\./, '');

  const fieldDescription = formString(`algorithm_description.${path}.fieldset`);

  const nameFieldInfo = formString(`algorithm_description.${path}.name`);
  const longNameFieldInfo = formString(
    `algorithm_description.${path}.long_name`
  );
  const unitFieldInfo = formString(`algorithm_description.${path}.unit`);

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
            onAddClick={() => push(variableFieldsEmptyValue)}
          >
            {get(form.values, name).map((field, index) => (
              <DeletableFieldsetTriptic
                /* eslint-disable-next-line react/no-array-index-key */
                key={index}
                id={`${name}.${index}`}
                label={`Variable #${index + 1}`}
                onDeleteClick={() => remove()}
              >
                <FormikInlineInputEditor
                  id={`${name}.${index}.name`}
                  name={`${name}.${index}.name`}
                  formattingOptions={variableFieldsFormattigOprions}
                  label='Name'
                  description={nameFieldInfo}
                />
                <FormikInlineInputEditor
                  id={`${name}.${index}.long_name`}
                  name={`${name}.${index}.long_name`}
                  formattingOptions={variableFieldsFormattigOprions}
                  label='Long name'
                  description={longNameFieldInfo}
                />
                <FormikInlineInputEditor
                  id={`${name}.${index}.unit`}
                  name={`${name}.${index}.unit`}
                  formattingOptions={variableFieldsFormattigOprions}
                  label='Unit'
                  description={unitFieldInfo}
                />
              </DeletableFieldsetTriptic>
            ))}
          </FieldMultiItem>
        )}
      />
    </FormikSectionFieldset>
  );
};

VariablesSection.propTypes = {
  sectionLabel: T.string,
  sectionName: T.string,
  fieldLabel: T.string,
  fieldName: T.string,
  fieldEmptyMessage: T.node
};
