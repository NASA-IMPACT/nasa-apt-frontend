import React, { useCallback } from 'react';
import T from 'prop-types';
import set from 'lodash.set';
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
import { isPublished } from '../status';
import { LocalStore } from './local-store';
import { FormikUnloadPrompt } from '../../common/unload-prompt';
import RichTextContex2Formik from './rich-text-ctx-formik';

export default function StepIdentifyingInformation(props) {
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

  const onSubmit = useSubmitForMetaAndVersionData(updateAtbd, atbd, step);

  const validate = useCallback((values) => {
    let errors = {};

    if (!values.title?.trim()) {
      errors.title = 'Title is required';
    }

    if (
      values.citation?.online_resource &&
      !values.citation.online_resource.startsWith('http')
    ) {
      set(errors, 'citation.online_resource', 'Url must start with http');
    }

    return errors;
  }, []);

  // If the current major is greater than 1 means that other versions exist, and
  // they have to be published.
  const hasAnyVersionPublished = isPublished(atbd) || atbd.major > 1;

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      <Inpage>
        <LocalStore atbd={atbd} />
        <FormikUnloadPrompt />
        {renderInpageHeader()}
        <InpageBody>
          <FormBlock>
            <FormBlockHeading>{step.label}</FormBlockHeading>
            <Form as={FormikForm}>
              <RichTextContex2Formik>
                <SectionFieldset
                  label={getDocumentSectionLabel('general')}
                  commentSection='general'
                >
                  <p>
                    <em>
                      For newly created ATBDs, only the title and alias must be
                      completed when starting. Other items are either auto
                      generated or can be input at a later time.
                    </em>
                  </p>
                  <p>
                    <em>
                      Updates to the following two elements affect this and
                      future versions of the document.
                    </em>
                  </p>
                  <FormikInputText
                    id='title'
                    name='title'
                    label='ATBD Title'
                    description={formString('identifying_information.title')}
                  />
                  <FieldAtbdAlias disabled={hasAnyVersionPublished} />
                </SectionFieldset>

                <SectionFieldset label='DOI'>
                  <FormikInputText
                    id='doi'
                    name='doi'
                    label='DOI'
                    description={formString('identifying_information.doi')}
                    helper={
                      <FormHelperMessage>
                        For an existing document with a DOI, enter the DOI name
                        (ex: 10.1000/xyz123) instead of the full URL.
                      </FormHelperMessage>
                    }
                  />
                </SectionFieldset>

                <FormikSectionFieldset
                  label={getDocumentSectionLabel('version_description')}
                  sectionName='sections_completed.version_description'
                  commentSection='version_description'
                >
                  <FormikInputEditor
                    id='version_description'
                    name='document.version_description'
                    label='Version description'
                    description={formString(
                      'identifying_information.version_description'
                    )}
                    helper={
                      <FormHelperMessage>
                        Authors only need to enter information when updating an
                        existing document (i.e version greater than 1).
                      </FormHelperMessage>
                    }
                  />
                </FormikSectionFieldset>

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
                      helper={
                        typeof field.helper === 'function'
                          ? field.helper(atbd)
                          : field.helper
                      }
                    />
                  ))}
                </FormikSectionFieldset>
                {renderFormFooter()}
              </RichTextContex2Formik>
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepIdentifyingInformation.propTypes = {
  renderInpageHeader: T.func,
  renderFormFooter: T.func,
  step: T.object,
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  atbd: T.shape({
    id: T.number,
    title: T.string,
    alias: T.string,
    document: T.object,
    major: T.number
  })
};
