import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Auth } from 'aws-amplify';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { Button } from '@devseed-ui/button';
import { Form } from '@devseed-ui/form';

import App from '../components/common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../styles/inpage';
import { ContentBlock } from '../styles/content-block';
import Prose from '../styles/typography/prose';

import config from '../config';
import { getAppURL } from '../utils/history';
import { SectionFieldset } from '../components/common/forms/section-fieldset';
import { FormikInputText } from '../components/common/forms/input-text';
import { createProcessToast } from '../components/common/toasts';
import { useUser } from '../context/user';

const getHostedAuthUiUrl = (page) => {
  const clientId = config.auth.userPoolWebClientId;
  const returnTo = getAppURL().cleanHref;
  return `${config.hostedAuthUi}/${page}?client_id=${clientId}&response_type=token&redirect_uri=${returnTo}`;
};

function SignIn() {
  const { loginCognitoUser, isLogged } = useUser();
  const history = useHistory();

  useEffect(() => {
    if (isLogged) {
      history.push('/');
    }
  }, [history, isLogged]);

  const initialValues = {
    email: '',
    password: ''
  };

  const validate = useCallback((values) => {
    let errors = {};

    if (values.email.trim() === '') {
      errors.email = 'Email is required';
    }

    if (values.password.trim() === '') {
      errors.password = 'Password is required';
    }

    return errors;
  }, []);

  const onSubmit = useCallback(
    async (values, { setSubmitting }) => {
      const processToast = createProcessToast('Signing in. Please wait.');

      try {
        const { email, password } = values;
        const user = await Auth.signIn(email, password);
        loginCognitoUser(user);
        processToast.success(
          `Welcome back ${user.attributes.preferred_username}!`
        );
        history.push('/dashboard');
      } catch (error) {
        if (error.code === 'UserNotConfirmedException') {
          processToast.error(
            'User account was not confirmed. Please check your email'
          );
        } else {
          processToast.error(error.message);
        }
        setSubmitting(false);
      }
    },
    [history, loginCognitoUser]
  );

  return (
    <App pageTitle='Sign in'>
      <Inpage>
        <InpageHeader>
          <InpageHeadline>
            <InpageTitle>Sign in</InpageTitle>
          </InpageHeadline>
        </InpageHeader>
        <InpageBody>
          <ContentBlock>
            <Prose>
              <Formik
                enableReinitialize
                initialValues={initialValues}
                validate={validate}
                onSubmit={onSubmit}
              >
                <Form as={FormikForm}>
                  <SectionFieldset label='Sign in'>
                    <FormikInputText id='email' name='email' label='Email' />
                    <FormikInputText
                      id='password'
                      name='password'
                      type='password'
                      label='Password'
                    />
                    <p>
                      <a
                        href={getHostedAuthUiUrl('forgotPassword')}
                        title='Recover account password'
                      >
                        Forgot your password?
                      </a>
                    </p>
                    <SigninButton />
                    <p>
                      Need an account?{' '}
                      <a
                        href={getHostedAuthUiUrl('signup')}
                        title='Create an account'
                      >
                        Sign up.
                      </a>
                    </p>
                  </SectionFieldset>
                </Form>
              </Formik>
            </Prose>
          </ContentBlock>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default SignIn;

// Moving the signin button to a component of its own to use Formik context.
const SigninButton = () => {
  const { dirty, isSubmitting } = useFormikContext();

  return (
    <Button
      type='submit'
      title='Sign into account'
      variation='primary-raised-dark'
      useIcon='login'
      disabled={isSubmitting || !dirty}
    >
      Sign in
    </Button>
  );
};
