import React, {  useEffect } from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm } from 'formik';
import { Form } from '@devseed-ui/form';
import { GlobalLoading } from '@devseed-ui/global-loading';

import { Inpage, InpageBody } from '../../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../../styles/form-block';
import { FormikSectionFieldset } from '../../../common/forms/section-fieldset';
import ContactsList from './contacts-list';

import { useSingleAtbd } from '../../../../context/atbds-list';
import { useSubmitForVersionData } from '../use-submit';
import { useContacts } from '../../../../context/contacts-list';

export default function StepContacts(props) {
  const { renderInpageHeader, atbd, id, version, step } = props;

  const { updateAtbd } = useSingleAtbd({ id, version });
  const { fetchContacts, createContact, contacts } = useContacts();

  const initialValues = step.getInitialValues(atbd);

  const onSubmit = (values) => {
    console.log(values)
  };

  // We need the list of all contacts for the select.
  useEffect(() => {
    fetchContacts();
  }, []);

  // We only want to handle errors when the contact request fails. Mutation
  // errors, tracked by the `mutationStatus` property are handled in the submit
  // handlers.
  if (contacts.status === 'failed' && contacts.error) {
    // This is a serious server error. By throwing it will be caught by the
    // error boundary. There's no recovery from this error.
    throw contacts.error;
  }

  return (
    <Formik
      initialValues={initialValues}
      // There's no need to validate this page since the editor already ensures
      // a valid structure
      //validate={validate}
      onSubmit={onSubmit}
    >
      <Inpage>
        {renderInpageHeader()}
        {contacts.status === 'loading' && <GlobalLoading />}
        {contacts.status === 'succeeded' && (
          <InpageBody>
            <FormBlock>
              <FormBlockHeading>{step.label}</FormBlockHeading>
              <Form as={FormikForm}>
                <FormikSectionFieldset
                  label='Contacts'
                  sectionName='sections_completed.contacts'
                >
                  <ContactsList contactsList={contacts.data} />
                </FormikSectionFieldset>
              </Form>
            </FormBlock>
          </InpageBody>
        )}
      </Inpage>
    </Formik>
  );
}

StepContacts.propTypes = {
  renderInpageHeader: T.func,
  step: T.object,
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  atbd: T.shape({
    id: T.number,
    document: T.object
  })
};
