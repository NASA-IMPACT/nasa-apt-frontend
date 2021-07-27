import React, { useCallback } from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { Form } from '@devseed-ui/form';
import { Modal, ModalFooter } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';

import { FormikInputTextarea } from '../common/forms/input-textarea';
import { FormikResetReveal } from '../common/forms/formik-reset-reveal';

const reasonEmpty = { comment: '' };

// Modal to deny the request for review.
export function ReqReviewDenyModal(props) {
  const { atbd, revealed, onClose, onSubmit } = props;

  const validate = useCallback((values) => {
    let errors = {};
    if (!values.comment.trim()) {
      errors.comment = 'This field is required and can not be empty';
    }
    return errors;
  }, []);

  return (
    <Formik initialValues={reasonEmpty} onSubmit={onSubmit} validate={validate}>
      <React.Fragment>
        <FormikResetReveal revealed={revealed} />
        <Modal
          id='modal'
          size='medium'
          revealed={revealed}
          title='Deny review request'
          onCloseClick={onClose}
          content={
            <Form as={FormikForm}>
              <p>
                You are about to deny the request to start the review process
                for version <strong>{atbd.version}</strong> of document{' '}
                <strong>{atbd.title}</strong>
              </p>
              <p>Please provide a reason to help the authors.</p>
              <FormikInputTextarea
                id='comment'
                name='comment'
                label='Reason'
                labelHint='(required)'
              />
            </Form>
          }
          renderFooter={(bag) => (
            <ModalFooter>
              <GovernanceModalControls
                modalHelpers={bag}
                submitLabel='Deny request'
                submitTitle='Deny review request of document'
              />
            </ModalFooter>
          )}
        />
      </React.Fragment>
    </Formik>
  );
}

ReqReviewDenyModal.propTypes = {
  atbd: T.object,
  revealed: T.bool,
  onClose: T.func,
  onSubmit: T.func
};

// Moving the buttons to a component of its own to use Formik context.
const GovernanceModalControls = (props) => {
  const { modalHelpers, submitLabel, submitTitle } = props;
  const { isSubmitting, submitForm } = useFormikContext();

  return (
    <React.Fragment>
      <Button
        variation='base-raised-light'
        title='Cancel'
        disabled={isSubmitting}
        useIcon='xmark--small'
        onClick={modalHelpers.close}
      >
        Cancel
      </Button>
      <Button
        variation='primary-raised-dark'
        title={submitTitle}
        disabled={isSubmitting}
        useIcon='tick--small'
        onClick={submitForm}
      >
        {submitLabel}
      </Button>
    </React.Fragment>
  );
};

GovernanceModalControls.propTypes = {
  modalHelpers: T.object,
  submitLabel: T.string,
  submitTitle: T.string
};
