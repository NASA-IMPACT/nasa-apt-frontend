import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router';
import get from 'lodash.get';
import set from 'lodash.set';
import {
  Formik,
  Form as FormikForm,
  useFormikContext,
  FieldArray
} from 'formik';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { glsp } from '@devseed-ui/theme-provider';
import { VerticalDivider } from '@devseed-ui/toolbar';
import { Form, FormFieldsetBody } from '@devseed-ui/form';

import App from '../../common/app';
import {
  Inpage,
  InpageBody,
  InpageHeaderSticky,
  InpageActions
} from '../../../styles/inpage';
import UhOh from '../../uhoh';
import ContactNavHeader from '../contact-nav-header';
import ContactActionsMenu from '../contact-actions-menu';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import { SectionFieldset } from '../../common/forms/section-fieldset';
import { FormikInputText } from '../../common/forms/input-text';
import { FieldMultiItem } from '../../common/forms/field-multi-item';
import { FormikInputSelect } from '../../common/forms/input-select';
import { DeletableFieldset } from '../../common/forms/deletable-fieldset';
import ButtonSecondary from '../../../styles/button-secondary';
import Tip from '../../common/tooltip';

import { useContacts, useSingleContact } from '../../../context/contacts-list';
import { contactDeleteConfirmAndToast } from '../contact-delete-process';
import { getValuesFromObj } from '../../../utils/get-values-object';
import { formString } from '../../../utils/strings';
import { createProcessToast } from '../../common/toasts';
import { contactView } from '../../../utils/url-creator';

const ContactDetails = styled.div`
  display: grid;
  grid-gap: ${glsp()};
  grid-template-columns: repeat(3, 1fr);

  & > * {
    height: min-content;

    &:last-child {
      grid-column: auto / span 2;
    }
  }
`;

const DeletableFieldsetMechanisms = styled(DeletableFieldset)`
  ${FormFieldsetBody} {
    grid-template-columns: repeat(2, 1fr);

    & > * {
      height: min-content;
    }
  }
`;

const contactMechanismTypes = [
  'Direct line',
  'Email',
  'Facebook',
  'Fax',
  'Mobile',
  'Modem',
  'Primary',
  'TDD/TTY phone',
  'Telephone',
  'Twitter',
  'U.S.',
  'Other'
].map((m) => ({ value: m, label: m }));

const emptyMechanismValue = {
  mechanism_type: contactMechanismTypes[0].value,
  mechanism_value: ''
};

const defaultValues = {
  first_name: '',
  middle_name: '',
  last_name: '',
  uuid: '',
  url: '',
  mechanisms: [emptyMechanismValue]
};

const detailsFields = [
  {
    id: 'first_name',
    label: 'First name',
    required: true
  },
  {
    id: 'middle_name',
    label: 'Middle name'
  },
  {
    id: 'last_name',
    label: 'Last name',
    required: true
  },
  {
    id: 'uuid',
    label: 'Uuid'
  },
  {
    id: 'url',
    label: 'Url'
  }
];

export default function ContactView() {
  const { id } = useParams();
  const history = useHistory();

  const { deleteContact } = useContacts();
  const { contact, updateContact, fetchSingleContact } = useSingleContact({
    id
  });

  useEffect(() => {
    fetchSingleContact();
  }, [id]);

  const onContactMenuAction = useCallback(
    async (menuId) => {
      if (menuId === 'delete') {
        await contactDeleteConfirmAndToast({
          contact: contact.data,
          deleteContact,
          history
        });
      }
    },
    [contact.data, deleteContact, history]
  );

  const onSubmit = useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const processToast = createProcessToast('Saving changes');
      const result = await updateContact(values);
      setSubmitting(false);

      if (result.error) {
        processToast.error(`An error occurred: ${result.error.message}`);
      } else {
        resetForm({ values });
        processToast.success('Changes saved');
        history.push(contactView(values.id));
      }
    },
    [updateContact, history]
  );

  const validate = useCallback((values) => {
    let errors = {};

    if (!values.first_name.trim()) {
      errors.first_name = 'First name is required';
    }

    if (!values.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }

    values.mechanisms.forEach((m, i) => {
      if (!m.mechanism_type.trim()) {
        set(errors, `mechanisms.${i}.mechanism_type`, 'Type is required');
      }
      if (!m.mechanism_value.trim()) {
        set(errors, `mechanisms.${i}.mechanism_value`, 'Value is required');
      }
    });

    return errors;
  }, []);

  // We only want to handle errors when the contact request fails. Mutation errors,
  // tracked by the `mutationStatus` property are handled in the submit
  // handlers.
  if (contact.status === 'failed') {
    const errCode = contact.error?.response.status;

    if (errCode === 400 || errCode === 404) {
      return <UhOh />;
    } else if (contact.error) {
      // This is a serious server error. By throwing it will be caught by the
      // error boundary. There's no recovery from this error.
      throw contact.error;
    }
  }

  const { status, data } = contact;

  const initialValues = getValuesFromObj(data || {}, defaultValues);

  return (
    <App pageTitle='Contact edit'>
      {status === 'loading' && <GlobalLoading />}
      {status === 'succeeded' && (
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
        >
          <Inpage>
            <InpageHeaderSticky data-element='inpage-header'>
              <ContactNavHeader
                contactId={data.id}
                name={`${data.first_name} ${data.last_name}`}
                mode='edit'
              />
              <InpageActions>
                <SaveButton />
                <VerticalDivider variation='light' />
                <ContactActionsMenu
                  contactId={data.id}
                  variation='achromic-plain'
                  onSelect={onContactMenuAction}
                />
              </InpageActions>
            </InpageHeaderSticky>
            <InpageBody>
              <FormBlock>
                <FormBlockHeading>Contact Information</FormBlockHeading>
                <Form as={FormikForm}>
                  <SectionFieldset label='Contact'>
                    <ContactDetails>
                      {detailsFields.map(({ id, label, required }) => (
                        <FormikInputText
                          key={id}
                          id={id}
                          name={id}
                          label={label}
                          labelHint={required ? '(required)' : null}
                          description={formString(`contacts.${id}`)}
                        />
                      ))}
                    </ContactDetails>
                    <FieldArray
                      name='mechanisms'
                      render={({ remove, push, form, name }) => {
                        const fieldValues = get(form.values, name);
                        const hasSingleValue = fieldValues.length === 1;
                        return (
                          <FieldMultiItem
                            id={name}
                            label='Contact mechanisms'
                            description={formString(
                              `contacts.mechanisms.fieldset`
                            )}
                            onAddClick={() => push(emptyMechanismValue)}
                          >
                            {fieldValues.map((field, index) => (
                              <DeletableFieldsetMechanisms
                                /* eslint-disable-next-line react/no-array-index-key */
                                key={index}
                                id={`${name}.${index}`}
                                disableDelete={hasSingleValue}
                                deleteDescription={
                                  hasSingleValue
                                    ? 'At least one mechanism is required'
                                    : null
                                }
                                label={`Entry #${index + 1}`}
                                onDeleteClick={() => remove()}
                              >
                                <FormikInputSelect
                                  id={`${name}.${index}.mechanism_type`}
                                  name={`${name}.${index}.mechanism_type`}
                                  options={contactMechanismTypes}
                                  label='Type'
                                  labelHint='(required)'
                                  description={formString(
                                    `contacts.mechanisms.mechanism_type`
                                  )}
                                />
                                <FormikInputText
                                  id={`${name}.${index}.mechanism_value`}
                                  name={`${name}.${index}.mechanism_value`}
                                  label='Value'
                                  labelHint='(required)'
                                  description={formString(
                                    `contacts.mechanisms.mechanism_value`
                                  )}
                                />
                              </DeletableFieldsetMechanisms>
                            ))}
                          </FieldMultiItem>
                        );
                      }}
                    />
                  </SectionFieldset>
                </Form>
              </FormBlock>
            </InpageBody>
          </Inpage>
        </Formik>
      )}
    </App>
  );
}

// Moving the save button to a component of its own to use Formik context.
const SaveButton = () => {
  const { dirty, isSubmitting, submitForm } = useFormikContext();

  return (
    <Tip position='top-end' title='There are unsaved changes' open={dirty}>
      <ButtonSecondary
        title='Save current changes'
        disabled={isSubmitting || !dirty}
        onClick={submitForm}
        useIcon='tick--small'
      >
        Save
      </ButtonSecondary>
    </Tip>
  );
};
