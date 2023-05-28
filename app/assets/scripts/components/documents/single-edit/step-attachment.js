import React, { useCallback, useEffect } from 'react';
import T from 'prop-types';
import set from 'lodash.set';
import { Formik, Form as FormikForm } from 'formik';
import { Form } from '@devseed-ui/form';
import { GlobalLoading } from '@devseed-ui/global-loading';

import { Inpage, InpageBody } from '../../../styles/inpage';
import {
  FormBlock,
  FormBlockHeading,
  FormSectionNotes
} from '../../../styles/form-block';
import { FormikSectionFieldset } from '../../common/forms/section-fieldset';

import { useSingleAtbd } from '../../../context/atbds-list';
import { getDocumentSectionLabel } from './sections';
import { LocalStore } from './local-store';
import { FormikUnloadPrompt } from '../../common/unload-prompt';

function StepAttachement(props) {
  const {
    atbd,
    id,
    version,
    step,
    renderInpageHeader,
    renderFormFooter
  } = props;
  const { updateAtbd } = useSingleAtbd({ id, version });
  const initialValues = step.getInitialValues(atbd);

  const onSubmit = useCallback(() => {}, []);

  const validate = useCallback((values) => {
    let errors = {};

    return errors;
  }, []);

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
              <FormikSectionFieldset
                label={getDocumentSectionLabel('attachment')}
                sectionName='sections_completed.attachment'
                commentSection='attachment'
              >
                <FormSectionNotes>Hello world</FormSectionNotes>
              </FormikSectionFieldset>
              {renderFormFooter()}
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepAttachement.propTypes = {
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

export default StepAttachement;
