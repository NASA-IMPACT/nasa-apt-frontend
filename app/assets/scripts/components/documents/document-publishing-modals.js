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

// Modal to handle the creation of a minor version. Allows the user to provide a
// changelog.
export function MinorVersionModal(props) {
  const { atbd, revealed, onClose, onSubmit } = props;

  const initialValues = useMemo(() => {
    const newMinor = atbd.minor + 1;
    const base = `# v${atbd.major}.${newMinor}\n- \n\n`;

    return {
      id: atbd.id,
      changelog: base + (atbd.changelog || ''),
      minor: newMinor
    };
  }, [atbd]);

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
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
          <Form as={FormikForm}>
            <p>
              This action will update the document to version v{atbd.major}.
              {atbd.minor + 1}.
            </p>
            <FormikInputTextarea
              id='changelog'
              name='changelog'
              label='Changelog'
              description='Use the changelog to register what changed in relation to the previous minor version.'
            />
          </Form>
        }
        renderFooter={(bag) => (
          <ModalFooter>
            <DocPubVersionControls
              modalHelpers={bag}
              submitLabel='Update version'
              submitTitle='Update minor version'
            />
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

// Modal to publish an ATBD version. Allows to the user to provide a changelog
// if it is not the first version.
export function PublishingModal(props) {
  const { atbd, revealed, onClose, onSubmit } = props;

  const isFirstVersion = atbd.major === 1;

  const initialValues = useMemo(() => {
    // There's no changelog on version 1.
    if (isFirstVersion) {
      return { id: atbd.id };
    }

    const base = `# v${atbd.major + 1}.0\n- \n\n`;

    return {
      id: atbd.id,
      changelog: base + (atbd.changelog || '')
    };
  }, [atbd, isFirstVersion]);

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Modal
        id='modal'
        size='medium'
        revealed={revealed}
        renderToolbar={() => null}
        onCloseClick={onClose}
        renderHeadline={() => (
          <ModalHeadline>
            <h1>Publish document</h1>
            <ModalSubtitle>Current version is {atbd.version}</ModalSubtitle>
          </ModalHeadline>
        )}
        content={
          <Form as={FormikForm}>
            <p>Are you ready to publish this document?</p>
            <p>
              Once published, a document will be publicly available.
              <br />
              <strong>Please note that this action is irreversible.</strong>
            </p>
            {!isFirstVersion && (
              <React.Fragment>
                <FormikInputTextarea
                  id='changelog'
                  name='changelog'
                  label='Changelog'
                  description='Use the changelog to register what changed in relation to the previous major version.'
                />
              </React.Fragment>
            )}
          </Form>
        }
        renderFooter={(bag) => (
          <ModalFooter>
            <DocPubVersionControls
              modalHelpers={bag}
              submitLabel='Publish'
              submitTitle='Publish document'
            />
          </ModalFooter>
        )}
      />
    </Formik>
  );
}

PublishingModal.propTypes = {
  atbd: T.object,
  revealed: T.bool,
  onClose: T.func,
  onSubmit: T.func
};

// Moving the buttons to a component of its own to use Formik context.
const DocPubVersionControls = (props) => {
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

DocPubVersionControls.propTypes = {
  modalHelpers: T.object,
  submitLabel: T.string,
  submitTitle: T.string
};

/**
 * Show a confirmation prompt to Draft a new major version of a document.
 *
 * @param {string} currentVersion Current ATBD version
 * @param {string} newVersion ATBD version after update
 * @param {string} latestVersion Latest ATBD version after
 */
export const confirmDraftMajorVersion = async (
  currentVersion,
  newVersion,
  latestVersion
) => {
  return showConfirmationPrompt({
    title: 'Draft a new major version',
    subtitle: `Current version is ${currentVersion}`,
    content: (
      <p>
        This action will create a new draft major version ({newVersion}), from
        the latest existing version ({latestVersion})
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
