import React, { useCallback } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { Auth } from 'aws-amplify';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { Form, FormHelperMessage } from '@devseed-ui/form';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { Inpage, InpageBody } from '../../../styles/inpage';
import { FormBlock, FormBlockHeading } from '../../../styles/form-block';
import { FormikInputText } from '../../common/forms/input-text';
import { SectionFieldset } from '../../common/forms/section-fieldset';

import { createProcessToast } from '../../common/toasts';

const PwdConstraintList = styled.ul`
  list-style: disc;
  margin-left: ${glsp(1.5)};
`;

const PwdConstraint = styled(FormHelperMessage)`
  ${({ valid }) =>
    valid &&
    css`
      color: ${themeVal('color.success')};
    `}
`;

export default function SectionSecurity(props) {
  const { renderInpageHeader, user, section } = props;

  const initialValues = section.getInitialValues(user);

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const processToast = createProcessToast('Saving changes.');
    try {
      await Auth.changePassword(
        user.rawCognitoUser,
        values.password,
        values.newPassword
      );
      processToast.success('Changes saved');
      resetForm();
    } catch (error) {
      processToast.error(`An error occurred: ${error.message}`);
    }
    setSubmitting(false);
  };

  const validate = useCallback((values) => {
    let errors = {};

    if (!values.password?.trim()) {
      errors.password = 'Current password is required';
    }

    const newPwd = values.newPassword?.trim() || '';

    if (!newPwd.match(/[0-9]/)) {
      errors.pwdNumber = true;
    }
    if (!newPwd.match(/[a-z]/)) {
      errors.pwdLower = true;
    }
    if (!newPwd.match(/[A-Z]/)) {
      errors.pwdUpper = true;
    }
    if (!newPwd.match(/[*.!@#$%^&(){}[\]:;<>,.?/~_+-=|\\]/)) {
      errors.pwdSymbol = true;
    }
    if (newPwd.length < 8) {
      errors.pwdLength = true;
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
              <SectionFieldset label='Password'>
                <FormikInputText
                  id='password'
                  name='password'
                  label='Current password'
                  type='password'
                />
                <PasswordField />
              </SectionFieldset>
            </Form>
          </FormBlock>
        </InpageBody>
      </Inpage>
    </Formik>
  );
}

SectionSecurity.propTypes = {
  renderInpageHeader: T.func,
  user: T.object,
  section: T.object
};

const PasswordField = () => {
  const { touched, errors } = useFormikContext();

  const getValidState = (err) => {
    if (!touched.newPassword) return {};
    return errors[err] ? { invalid: true } : { valid: true };
  };

  return (
    <FormikInputText
      id='new-password'
      name='newPassword'
      label='New password'
      type='password'
      helper={
        <div>
          <FormHelperMessage>A password must have:</FormHelperMessage>
          <PwdConstraintList>
            <li>
              <PwdConstraint {...getValidState('pwdLength')}>
                at least 8 characters
              </PwdConstraint>
            </li>
            <li>
              <PwdConstraint {...getValidState('pwdUpper')}>
                one uppercase letter
              </PwdConstraint>
            </li>
            <li>
              <PwdConstraint {...getValidState('pwdLower')}>
                one lowercase letter
              </PwdConstraint>
            </li>
            <li>
              <PwdConstraint {...getValidState('pwdNumber')}>
                one number
              </PwdConstraint>
            </li>
            <li>
              <PwdConstraint {...getValidState('pwdSymbol')}>
                one special character
              </PwdConstraint>
            </li>
          </PwdConstraintList>
        </div>
      }
    />
  );
};
