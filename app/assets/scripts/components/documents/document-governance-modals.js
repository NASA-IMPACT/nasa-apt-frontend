import React, { useCallback, useEffect, useMemo } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import {
  Formik,
  Form as FormikForm,
  useFormikContext,
  ErrorMessage
} from 'formik';
import { glsp } from '@devseed-ui/theme-provider';
import ShadowScrollbar from '@devseed-ui/shadow-scrollbar';
import { Form, FormHelper, FormHelperMessage } from '@devseed-ui/form';
import { Modal, ModalFooter } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';

import { FormikInputTextarea } from '../common/forms/input-textarea';
import { FormikResetReveal } from '../common/forms/formik-reset-reveal';
import {
  UserSelectableList,
  UserSelectableListLoadingSkeleton
} from '../common/user-selectable-list';

import { useCollaborators } from '../../context/collaborators-list';

const ShadowScrollbarPadded = styled(ShadowScrollbar).attrs({
  scrollbarsProps: {
    autoHeight: true,
    autoHeightMax: 320
  }
})`
  margin: ${glsp(0, -2)};
`;

// Modal to deny requests with a comment field.
export function ReqDenyModal(props) {
  const { title, content, revealed, onClose, onSubmit } = props;

  const validate = useCallback((values) => {
    let errors = {};
    if (!values.comment.trim()) {
      errors.comment = 'This field is required and can not be empty';
    }
    return errors;
  }, []);

  const initialValues = useMemo(() => ({ comment: '' }), []);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      <React.Fragment>
        <FormikResetReveal revealed={revealed} />
        <Modal
          id='modal'
          size='small'
          revealed={revealed}
          title={title}
          onCloseClick={onClose}
          content={
            <Form as={FormikForm}>
              {content}
              <p>Please help the authors understand what happened.</p>
              <FormikInputTextarea
                id='comment'
                name='comment'
                label='Write a comment'
                labelHint='(required)'
              />
            </Form>
          }
          renderFooter={(bag) => (
            <ModalFooter>
              <GovernanceModalControls
                modalHelpers={bag}
                submitLabel='Deny request'
                submitTitle='Deny request'
              />
            </ModalFooter>
          )}
        />
      </React.Fragment>
    </Formik>
  );
}

ReqDenyModal.propTypes = {
  revealed: T.bool,
  onClose: T.func,
  onSubmit: T.func,
  title: T.string,
  content: T.node
};

// Modal to deny the request for review.
export function ReqReviewApproveModal(props) {
  const { atbd, revealed, onClose, onSubmit } = props;

  const {
    collaborators: collabReviewers,
    fetchCollaborators: fetchCollabReviewers
  } = useCollaborators({
    atbdId: atbd.id,
    atbdVersion: atbd.version,
    userFilter: 'invite_reviewers'
  });

  const validate = useCallback((values) => {
    let errors = {};
    if (!values.reviewers.length) {
      errors.reviewers = 'You must select at least one reviewer';
    }
    return errors;
  }, []);

  const initialValues = useMemo(() => ({ reviewers: [] }), []);

  useEffect(() => {
    if (revealed) {
      fetchCollabReviewers();
    }
  }, [fetchCollabReviewers, revealed]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      <React.Fragment>
        <FormikResetReveal revealed={revealed} />
        <Modal
          id='modal'
          size='small'
          revealed={revealed}
          title='Approve review request'
          onCloseClick={onClose}
          content={
            <Form as={FormikForm}>
              <p>
                To start the closed review process for version{' '}
                <strong>{atbd.version}</strong> of document{' '}
                <strong>{atbd.title}</strong> select the reviewers to invite.
              </p>
              {collabReviewers.status === 'loading' && (
                <UserSelectableListLoadingSkeleton />
              )}
              {collabReviewers.status === 'succeeded' && (
                <ShadowScrollbarPadded>
                  <UserSelectableList
                    users={collabReviewers.data}
                    fieldName='reviewers'
                  />
                </ShadowScrollbarPadded>
              )}
              {collabReviewers.status === 'failed' && (
                <p>An error occurred while getting the reviewers.</p>
              )}
              <ErrorMessage name='reviewers'>
                {(msg) => (
                  <FormHelper>
                    <FormHelperMessage invalid>{msg}</FormHelperMessage>
                  </FormHelper>
                )}
              </ErrorMessage>
            </Form>
          }
          renderFooter={(bag) => (
            <ModalFooter>
              <GovernanceModalControls
                modalHelpers={bag}
                submitLabel='Approve request'
                submitTitle='Approve review request of document'
              />
            </ModalFooter>
          )}
        />
      </React.Fragment>
    </Formik>
  );
}

ReqReviewApproveModal.propTypes = {
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
