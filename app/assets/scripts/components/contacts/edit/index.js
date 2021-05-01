import React, { useMemo } from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm } from 'formik';
import { Form } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
// import ReferencesManager from './references-manager';

import { updateContact } from '../../../context/contacts-list';

const defaultValues = {
  id: null,
  first_name: '',
  middle_name: '',
  last_name: '',
  uuid: '',
  url: '',
  mechanisms: null,
  roles: null,
  title: ''
};

export default function ContactEdit() {
  const { id } = useParams();
  const history = useHistory();
  const {
    contact,
    fetchSingleContact,
    updateContact,
    deleteContact
  } = useSingleContact({
    id
  });

  useEffect(() => {
    fetchSingleContact();
  }, [id]);
  const getInitialValues = (contact) => ({
    ...contact,
    ...defaultValues
  });

  const initialValues = getInitialValues(contact);

  const onSubmit = updateContact(contactId, contactData);

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
        <InpageBody>
          <FormBlock>
            <FormBlockHeading>Edit Contact</FormBlockHeading>
            <Form as={FormikForm}>
              {/* <ReferencesManager referenceIndex={referenceIndex} /> */}
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

ContactEdit.propTypes = {
  renderInpageHeader: T.func,
  step: T.object,
  id: T.oneOfType([T.string, T.number]),
  version: T.string,
  atbd: T.shape({
    id: T.number,
    document: T.object
  })
};
