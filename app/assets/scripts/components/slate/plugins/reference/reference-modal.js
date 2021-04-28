import React, { useCallback, useMemo, useState } from 'react';
import T from 'prop-types';
import { useSlate } from 'slate-react';
import styled from 'styled-components';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { Form } from '@devseed-ui/form';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { glsp } from '@devseed-ui/theme-provider';

import { SectionFieldset } from '../../../common/forms/section-fieldset';
import FormGroupStructure from '../../../common/forms/form-group-structure';
import ReferenceFormFields from '../../../documents/single-edit/step-references/reference-form-fields';
import SelectCombo from '../../../common/forms/select-combo';

import { insertReference } from '.';
import { useRichContext } from '../common/rich-context';
import {
  formatReference,
  getReferenceEmptyValue
} from '../../../../utils/references';

const ReferenceSelectWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: ${glsp()};

  > * {
    grid-column: 1 / span 2;
  }
`;

export function ReferencesModal() {
  const editor = useSlate();
  const { references, onReferenceUpsert } = useRichContext();
  const [selectedRefId, setSelectedRefId] = useState(null);

  const { visible } = editor.referenceModal.getData();

  const initialValues = useMemo(() => {
    if (!selectedRefId || selectedRefId === 'new') {
      return getReferenceEmptyValue({ isNew: true });
    }

    const existingReference = (references || []).find(
      (r) => r.id === selectedRefId
    );

    return getReferenceEmptyValue(existingReference);
  }, [selectedRefId, references]);

  const closeModal = useCallback(() => {
    setSelectedRefId(null);
    editor.referenceModal.reset();
  }, [editor]);

  const onSubmit = useCallback(
    (values) => {
      insertReference(editor, values.id);
      onReferenceUpsert?.(values);
      closeModal();
    },
    [closeModal, onReferenceUpsert, editor]
  );

  const validate = useCallback((values) => {
    let errors = {};

    if (!values.title?.trim()) {
      errors.title = 'Title is required';
    }

    return errors;
  }, []);

  const selectOptions = useMemo(
    () =>
      (references || []).map((r) => ({
        label: formatReference(r) || 'Empty reference',
        value: r.id
      })),
    [references]
  );

  const onRefSelect = useCallback((option) => {
    setSelectedRefId(option.value);
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      <Modal
        id='modal'
        size='large'
        revealed={visible}
        onCloseClick={closeModal}
        title='References'
        content={
          <Form as={FormikForm}>
            <SectionFieldset label='Reference'>
              <ReferenceSelectWrapper>
                <FormGroupStructure
                  id='reference'
                  label='Select existing or create new'
                >
                  <SelectCombo options={selectOptions} onChange={onRefSelect} />
                </FormGroupStructure>
              </ReferenceSelectWrapper>
              {selectedRefId && <ReferenceFormFields id='reference' />}
            </SectionFieldset>
          </Form>
        }
        footerContent={
          <React.Fragment>
            <Button
              onClick={closeModal}
              useIcon='xmark--small'
              variation='base-raised-light'
            >
              Cancel
            </Button>
            <RefConfirmButton selectedRefId={selectedRefId} />
          </React.Fragment>
        }
      />
    </Formik>
  );
}

ReferencesModal.propTypes = {};

// Moving the save button to a component of its own to use Formik context.
const RefConfirmButton = (props) => {
  const { selectedRefId } = props;
  const { isSubmitting, submitForm } = useFormikContext();

  const title = 'Insert';

  return (
    <Button
      title={title}
      disabled={isSubmitting || !selectedRefId}
      onClick={submitForm}
      useIcon='tick--small'
      variation='primary-raised-dark'
    >
      {title}
    </Button>
  );
};

RefConfirmButton.propTypes = {
  selectedRefId: T.string
};
