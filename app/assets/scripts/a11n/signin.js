import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Auth } from 'aws-amplify';
import { Formik, Form as FormikForm, useFormikContext } from 'formik';
import { Button } from '@devseed-ui/button';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Form, FormInput, FormLabel, FormGroup } from '@devseed-ui/form';
import QrCode from 'react-qr-code';
import styled from 'styled-components';

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

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1111;
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${glsp(2)};
  width: 100%;
  max-width: 24rem;
  background-color: #fff;
  padding: ${glsp(1.5, themeVal('layout.gap.medium'))};
  border-radius: ${themeVal('shape.rounded')};
  overflow: auto;
`;

const ModalContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${glsp(1.5)};
  overflow: auto;
`;

const getHostedAuthUiUrl = (page) => {
  const clientId = config.auth.userPoolWebClientId;
  const returnTo = getAppURL().cleanHref;
  return `${config.hostedAuthUi}/${page}?client_id=${clientId}&response_type=token&redirect_uri=${returnTo}`;
};

const altToast = {
  update: (msg) => {
    // eslint-disable-next-line no-console
    console.info(msg);
  },
  success: (msg) => {
    // eslint-disable-next-line no-console
    console.info(msg);
  },
  error: (msg) => {
    // eslint-disable-next-line no-console
    console.error(msg);
  }
};

function SignIn() {
  const { loginCognitoUser, isLogged } = useUser();
  const history = useHistory();
  const [user, setUser] = React.useState();
  const [mfaCode, setMfaCode] = React.useState();
  const [otpCode, setOtpCode] = React.useState('');
  const [mfaEnabled, setMfaEnabled] = React.useState(false);
  const toastRef = React.useRef(altToast);

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

  const qrString = `otpauth://totp/APT:${user?.username}?secret=${mfaCode}`;

  const handleOtpCodeInputChange = React.useCallback((e) => {
    setOtpCode(e.target.value);
  }, []);

  const handleVerifyOtpSubmission = React.useCallback(async () => {
    toastRef.current.update('Verifying OTP, Please wait...');

    try {
      if (mfaEnabled) {
        await Auth.confirmSignIn(user, otpCode, 'SOFTWARE_TOKEN_MFA');
      } else {
        await Auth.verifyTotpToken(user, otpCode);
        await Auth.setPreferredMFA(user, 'TOTP');
      }

      const userInfo = await Auth.currentUserInfo(user);
      loginCognitoUser(user, userInfo);
      toastRef.current.success(
        `Welcome back ${userInfo.attributes.preferred_username}!`
      );
      history.push('/dashboard');
    } catch (error) {
      toastRef.current.error(error.message);
    }
  }, [mfaEnabled, otpCode, user, history, loginCognitoUser]);

  const onSubmit = useCallback(async (values, { setSubmitting }) => {
    toastRef.current = createProcessToast('Signing in. Please wait.');

    try {
      const { email, password } = values;
      const loggedUser = await Auth.signIn(email, password);
      setUser(loggedUser);

      if (loggedUser.preferredMFA === 'NOMFA') {
        toastRef.current.update('Please setup OTP using Authenticator app.');
        const secretCode = await Auth.setupTOTP(loggedUser);
        setMfaCode(secretCode);
        setMfaEnabled(false);
      } else {
        setMfaEnabled(true);
        toastRef.current.update('Please enter OTP to continue.');
      }
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        toastRef.current.error(
          'User account was not confirmed. Please check your email'
        );
      } else {
        toastRef.current.error(error.message);
      }
      setSubmitting(false);
    }
  }, []);

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
      {!mfaEnabled && mfaCode && (
        <Backdrop>
          <Modal>
            <h2>Set-up OTP</h2>
            <div>
              Please use the following code or QR to generate Time-based OTP
              from the Authenticator app.
            </div>
            <ModalContent style={{ maxHeight: '40rem' }}>
              <div>
                <div>Code:</div>
                <code style={{ wordBreak: 'break-word' }}>{mfaCode}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <QrCode
                  style={{ maxWidth: '10rem', width: '10rem', height: '10rem' }}
                  value={qrString}
                />
              </div>
              <div>
                <FormLabel htmlFor='mfa-otp-code'>Enter OTP</FormLabel>
                <FormInput
                  type='text'
                  placeholder='Enter code to verify'
                  value={otpCode}
                  onChange={handleOtpCodeInputChange}
                  autoFocus
                  style={{ width: '100%' }}
                />
              </div>
            </ModalContent>
            <Button
              type='button'
              variation='primary-raised-dark'
              onClick={handleVerifyOtpSubmission}
            >
              Verify
            </Button>
          </Modal>
        </Backdrop>
      )}
      {mfaEnabled && (
        <Backdrop>
          <Modal>
            <h2>Sign-in Confirmation!</h2>
            <ModalContent>
              <FormGroup>
                <FormLabel htmlFor='mfa-otp-code'>Enter OTP</FormLabel>
                <FormInput
                  id='mfa-otp-code'
                  type='text'
                  placeholder='Enter code from Authenticator'
                  value={otpCode}
                  onChange={handleOtpCodeInputChange}
                  autoFocus
                />
              </FormGroup>
            </ModalContent>
            <Button
              type='button'
              variation='primary-raised-dark'
              onClick={handleVerifyOtpSubmission}
            >
              Confirm
            </Button>
          </Modal>
        </Backdrop>
      )}
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
