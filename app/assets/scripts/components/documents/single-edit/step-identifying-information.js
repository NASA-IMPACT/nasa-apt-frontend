import React, { useCallback } from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm } from 'formik';
import { Form, FormHelperMessage } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import { FormikInputText } from '../../common/forms/input-text';
import { FormikInputEditor } from '../../common/forms/input-editor';
import {
  FormikSectionFieldset,
  SectionFieldset
} from '../../common/forms/section-fieldset';
import FieldAtbdAlias from '../../common/forms/field-atbd-alias';

import { useSingleAtbd } from '../../../context/atbds-list';
import { formString } from '../../../utils/strings';
import { formStringSymbol, citationFields } from '../citation';
import { useSubmitForMetaAndVersionData } from './use-submit';
import { getDocumentSectionLabel } from './sections';

export default function StepIdentifyingInformation(props) {
  const { renderInpageHeader, atbd, id, version, step } = props;

  const { updateAtbd } = useSingleAtbd({ id, version });

  const initialValues = step.getInitialValues(atbd);

  const onSubmit = useSubmitForMetaAndVersionData(updateAtbd, atbd, step);

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
              <SectionFieldset
                label={getDocumentSectionLabel('general')}
                commentSection='general'
              >
                <p>
                  <em>
                    Updates to the general information will affect all versions.
                  </em>
                </p>
                <FormikInputText
                  id='title'
                  name='title'
                  label='ATBD Title'
                  description={formString('identifying_information.title')}
                />
                <FieldAtbdAlias />
              </SectionFieldset>

              <SectionFieldset label='DOI'>
                <FormikInputText
                  id='doi'
                  name='doi'
                  label='DOI'
                  description={formString('identifying_information.doi')}
                  helper={
                    <FormHelperMessage>
                      Use the DOI name (ex: 10.1000/xyz123) instead of the full
                      url
                    </FormHelperMessage>
                  }
                />
              </SectionFieldset>

              <SectionFieldset label='Version information'>
                <FormikInputEditor
                  id='version_description'
                  name='document.version_description'
                  label='Version description'
                  description={formString(
                    'identifying_information.version_description'
                  )}
                  helper={
                    <FormHelperMessage>
                      This field is only important when document version is
                      greater than 1.
                    </FormHelperMessage>
                  }
                />
              </SectionFieldset>

              <FormikSectionFieldset
                label={getDocumentSectionLabel('citation')}
                sectionName='sections_completed.citation'
                commentSection='citation'
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
                    helper={field.helper}
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
