import React, { useMemo } from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { Form } from '@devseed-ui/form';
import { Modal, ModalHeadline, ModalFooter } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';

import {
  showConfirmationPrompt,
  ModalSubtitle
} from '../common/confirmation-prompt';
import { FormikInputTextarea } from '../common/forms/input-textarea';

export function MinorVersionModal(props) {
  const { atbd, revealed, onClose, onSubmit } = props;

  const initialValues = useMemo(
    () => ({
      id: atbd.id,
      changelog: atbd.changelog || '',
      minor: atbd.minor + 1
    }),
    [atbd]
  );

  return (
    <Formik
      initialValues={initialValues}
      // There's no need to validate this page since the editor already ensures
      // a valid structure
      //validate={validate}
      onSubmit={onSubmit}
    >
      <Modal
        id='modal'
        size='medium'
        revealed={revealed}
        renderToolbar={() => null}
        onCloseClick={onClose}
        renderHeadline={() => (
          <ModalHeadline>
            <h1>Update minor version</h1>
            <ModalSubtitle>Current version is {atbd.version}</ModalSubtitle>
          </ModalHeadline>
        )}
        content={
          <React.Fragment>
            <Form as={FormikForm}>
              <p>
                This action will update the document to version v{atbd.major}.
                {atbd.minor + 1}.
              </p>
              <FormikInputTextarea
                id='changelog'
                name='changelog'
                label='Changelog'
              />
            </Form>
          </React.Fragment>
        }
        renderFooter={(bag) => (
          <ModalFooter>
            <MinorVersionModalControls modalHelpers={bag} />
          </ModalFooter>
        )}
      />
    </Formik>
  );
}

MinorVersionModal.propTypes = {
  atbd: T.object,
  revealed: T.bool,
  onClose: T.func,
  onSubmit: T.func
};

// Moving the buttons to a component of its own to use Formik context.
const MinorVersionModalControls = (props) => {
  const { modalHelpers } = props;
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
        title='Update minor version'
        disabled={isSubmitting}
        useIcon='tick--small'
        onClick={submitForm}
      >
        Update version
      </Button>
    </React.Fragment>
  );
};

MinorVersionModalControls.propTypes = {
  modalHelpers: T.object
};

/**
 * Show a confirmation prompt to Draft a new major version of a document.
 *
 * @param {Atbd} atbd ATBD document
 */
export const confirmDraftMajorVersion = async (atbd) => {
  return showConfirmationPrompt({
    title: 'Draft a new major version',
    subtitle: `Current version is ${atbd.version}`,
    content: (
      <p>
        This action will create a new draft major version (v{atbd.major + 1}
        .0).
        <br />
        All document content will be copied to the new draft, with the exception
        of the DOI information.
      </p>
    ),
    /* eslint-disable-next-line react/display-name, react/prop-types */
    renderControls: ({ confirm, cancel }) => (
      <React.Fragment>
        <Button
          variation='base-raised-light'
          title='Cancel'
          useIcon='xmark--small'
          onClick={cancel}
        >
          Cancel
        </Button>
        <Button
          variation='primary-raised-dark'
          title='Draft new major version'
          useIcon='tick--small'
          onClick={confirm}
        >
          Draft new version
        </Button>
      </React.Fragment>
    )
  });
};

/**
 * Show a confirmation prompt to Draft a new major version of a document.
 *
 * @param {Atbd} atbd ATBD document
 */
export const confirmPublishVersion = async () => {
  return showConfirmationPrompt({
    title: 'Publish document',
    content: (
      <React.Fragment>
        <p>Are you ready to publish this document?</p>
        <p>Please note that this action is irreversible.</p>
      </React.Fragment>
    ),
    /* eslint-disable-next-line react/display-name, react/prop-types */
    renderControls: ({ confirm, cancel }) => (
      <React.Fragment>
        <Button
          variation='base-raised-light'
          title='Cancel'
          useIcon='xmark--small'
          onClick={cancel}
        >
          Cancel
        </Button>
        <Button
          variation='primary-raised-dark'
          title='Publish'
          useIcon='tick--small'
          onClick={confirm}
        >
          Publish
        </Button>
      </React.Fragment>
    )
  });
};
