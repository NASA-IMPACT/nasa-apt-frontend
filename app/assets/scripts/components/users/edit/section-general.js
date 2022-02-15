import React, { useCallback } from 'react';
import T from 'prop-types';
import { Formik, Form as FormikForm } from 'formik';
import { Auth } from 'aws-amplify';
import { Form } from '@devseed-ui/form';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import { FormikInputText } from '../../common/forms/input-text';
import { SectionFieldset } from '../../common/forms/section-fieldset';

import { createProcessToast } from '../../common/toasts';
import { useUser } from '../../../context/user';

export default function SectionGeneral(props) {
  const { renderInpageHeader, user, section } = props;

  const initialValues = section.getInitialValues(user);
  const { loginCognitoUser } = useUser();

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const processToast = createProcessToast('Saving changes.');
    try {
      await Auth.updateUserAttributes(user.rawCognitoUser, {
        preferred_username: values.name
      });
      // Get updated values to store them.
      const updatedUser = await Auth.currentAuthenticatedUser();
      loginCognitoUser(updatedUser);
      processToast.success('Changes saved');
      resetForm({ values });
    } catch (error) {
      processToast.error(`An error occurred: ${error.message}`);
    }
    setSubmitting(false);
  };

  const validate = useCallback((values) => {
    let errors = {};

    if (!values.name?.trim()) {
      errors.name = 'Display name is required';
    }

    return errors;
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      <Inpage>
        {renderInpageHeader()}
        <InpageBody>
          <FormBlock>
            <FormBlockHeading>{section.label}</FormBlockHeading>
            <Form as={FormikForm}>
              <SectionFieldset label='Profile'>
                <FormikInputText id='name' name='name' label='Display name' />
              </SectionFieldset>
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

SectionGeneral.propTypes = {
  renderInpageHeader: T.func,
  user: T.object,
  section: T.object
};
