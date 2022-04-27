import React, { useCallback, useMemo } from 'react';
import T from 'prop-types';
import set from 'lodash.set';
import { Formik, Form as FormikForm } from 'formik';
import { Form } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../../styles/form-block';
import ReferencesManager from './references-manager';

import { useSingleAtbd } from '../../../../context/atbds-list';
import { useSubmitForVersionData } from '../use-submit';
import { createDocumentReferenceIndex } from '../../../../utils/references';
import { LocalStore } from '../local-store';

export default function StepReferences(props) {
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

  const referenceIndex = useMemo(
    () => createDocumentReferenceIndex(atbd.document),
    [atbd]
  );

  // Semicolons cannot be used to separate authors otherwise the PDF generation
  // fails, because it needs it for the references style.
  const validate = useCallback((values) => {
    const errors = {};
    values.document.publication_references.forEach((ref, index) => {
      if (ref.authors?.includes(';')) {
        set(
          errors,
          ['document', 'publication_references', index, 'authors'],
          'Semicolons (;) are not allowed. Use "and" to separate authors.'
        );
      }
    });
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
        {renderInpageHeader()}
        <InpageBody>
          <FormBlock>
            <FormBlockHeading>{step.label}</FormBlockHeading>
            <Form as={FormikForm}>
              <ReferencesManager referenceIndex={referenceIndex} />
              {renderFormFooter()}
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

StepReferences.propTypes = {
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
