import React, { useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { VerticalDivider } from '@devseed-ui/toolbar';
import { Form } from '@devseed-ui/form';

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
import ButtonSecondary from '../../../styles/button-secondary';
import Tip from '../../common/tooltip';
import { ContactFormFields, defaultContactValues } from './contact-form-fields';

import { useContacts, useSingleContact } from '../../../context/contacts-list';
import { contactDeleteConfirmAndToast } from '../contact-delete-process';
import { getValuesFromObj } from '../../../utils/get-values-object';
import { createProcessToast } from '../../common/toasts';
import { contactView } from '../../../utils/url-creator';
import { validateContact } from '../contact-utils';

export default function ContactView() {
  const { id } = useParams();
  const history = useHistory();

  const { deleteContact } = useContacts();
  const { contact, updateContact, fetchSingleContact } = useSingleContact({
    id
  });

  useEffect(() => {
    fetchSingleContact();
  }, [fetchSingleContact]);

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

  const initialValues = getValuesFromObj(data || {}, defaultContactValues);

  return (
    <App pageTitle='Contact edit'>
      {status === 'loading' && <GlobalLoading />}
      {status === 'succeeded' && (
        <Formik
          initialValues={initialValues}
          validate={validateContact}
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
                    <ContactFormFields />
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
