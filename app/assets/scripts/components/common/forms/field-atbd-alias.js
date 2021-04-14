import React, { useEffect, useMemo, useRef } from 'react';
import { useFormikContext } from 'formik';
import axios from 'axios';
import deburr from 'lodash.deburr';
import debounce from 'lodash.debounce';
import { FormHelperMessage } from '@devseed-ui/form';

import { InputText } from './input-text';

import { axiosAPI } from '../../../utils/axios';
import useSafeState from '../../../utils/use-safe-state';
import { useAuthToken } from '../../../context/user';
import { formString } from '../../../utils/strings';

window.axiosAPI = axiosAPI;

const toAliasFormat = (v) =>
  deburr(v)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');

const isValidAtbdAlias = async (alias, cancelToken, userToken) => {
  const headers = userToken
    ? {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    : {};

  try {
    await axiosAPI({
      url: `/atbds/${alias}`,
      method: 'head',
      ...headers,
      cancelToken
    });
    // Request was successful. Means atbd with given alias already exists.
    return false;
  } catch (error) {
    // Request errored with 404.
    return axios.isCancel(error) ? null : true;
  }
};

// The alias field needs to be a component so we can access the formik context.
export default function FieldAtbdAlias() {
  const {
    values: { title, alias },
    initialValues,
    touched,
    errors,
    setFieldValue,
    setFieldError,
    handleBlur,
    registerField,
    unregisterField,
    setStatus: setFormikStatus
  } = useFormikContext();

  const { token } = useAuthToken();
  const requestCancelTokenRef = useRef(null);

  // Use mountedRef
  const componentMounted = useRef(false);
  useEffect(() => {
    componentMounted.current = true;
    return () => {
      componentMounted.current = false;
    };
  }, []);

  // To check whether the alias is valid we have to make an api request. This
  // check is being made when the field changes and on blur. When formik runs
  // validation we return the last result because otherwise we'd be making
  // request every time any field changes.
  const [aliasStatus, setAliasStatus] = useSafeState(true); // unchecked, checking, valid, invalid

  // Register the field on Formik.
  useEffect(() => {
    registerField('alias', {
      validate: (value) => {
        // If it had a value the field becomes required.
        if (initialValues.alias && !value) {
          return 'The alias is required';
        }

        if (value) {
          return aliasStatus === 'invalid'
            ? 'This alias is already in use'
            : undefined;
        }
      }
    });

    return () => {
      unregisterField('alias');
    };
  }, [registerField, unregisterField, aliasStatus, initialValues.alias]);

  const checkAliasExist = useMemo(() => {
    const checker = async (value) => {
      // No point in checking if the alias didn't change.
      if (!value || value === initialValues.alias) {
        setAliasStatus('valid');
        setFormikStatus({ working: false });
        return;
      }

      setAliasStatus('checking');

      // Cancel any request that might be ongoing.
      requestCancelTokenRef.current?.cancel();

      const cancelToken = axios.CancelToken.source();
      requestCancelTokenRef.current = cancelToken;

      // Check if the alias is available. If not append a number up to -5. If
      // everything is taken show an error.
      for (let count = 0; count <= 5; count++) {
        const aliasValue = count ? `${value}-${count}` : value;

        const checkResult = await isValidAtbdAlias(
          aliasValue,
          cancelToken.source,
          token
        );

        if (checkResult === null || !componentMounted.current) {
          // Means request was cancelled. Abort. A new request is likely in
          // being issued.
          // Can also be that the component was unmounted.
          return;
        }

        if (checkResult) {
          setAliasStatus('valid');
          setFormikStatus({ working: false });
          return setFieldValue('alias', aliasValue);
        }
      }

      // Attempts exhausted.
      setAliasStatus('invalid');
      setFormikStatus({ working: false });
      setFieldError('alias', 'This alias is already in use');
    };

    // return debounce(checker, 1000);
    const debouncedFn = debounce(checker, 1000);

    const fn = (...args) => {
      setAliasStatus('unchecked');
      setFormikStatus({ working: true });
      return debouncedFn(...args);
    };
    fn.cancel = debouncedFn.cancel;
    fn.flush = debouncedFn.flush;

    return fn;
  }, [
    setAliasStatus,
    setFieldValue,
    setFieldError,
    initialValues.alias,
    setFormikStatus,
    token
  ]);

  // On component unmount, cancel checking to avoid React state update on an
  // unmounted component.
  useEffect(() => {
    return () => {
      checkAliasExist.cancel();
      // Cancel any request that might be ongoing.
      requestCancelTokenRef.current?.cancel();
    };
  }, [checkAliasExist]);

  // Update the value from the title field.
  useEffect(() => {
    // Only create alias from title if:
    if (
      // there's no alias;
      !initialValues.alias &&
      // there was a change in the title. Avoids modifying the field when
      // mounting;
      initialValues.title !== title &&
      // the user didn't input anything yet;
      !touched.alias &&
      // there is an actual title.
      title.trim()
    ) {
      const aliasValue = toAliasFormat(title);
      checkAliasExist(aliasValue);
      setFieldValue('alias', aliasValue);
    }
  }, [
    title,
    initialValues.title,
    initialValues.alias,
    touched.alias,
    checkAliasExist,
    setFieldValue,
    setFormikStatus
  ]);

  return (
    <InputText
      id='alias'
      name='alias'
      label='Alias'
      description={formString('identifying_information.alias')}
      value={alias}
      onBlur={(e) => {
        // On blur check immediately.
        checkAliasExist.flush();
        handleBlur(e);
      }}
      onChange={(e) => {
        const aliasValue = toAliasFormat(e.target.value);
        checkAliasExist(aliasValue);
        setFieldValue('alias', aliasValue);
      }}
      invalid={!!errors.alias}
      helper={
        errors.alias ? (
          <FormHelperMessage invalid>{errors.alias}</FormHelperMessage>
        ) : (
          <>
            <div>
              {initialValues.alias && (
                <FormHelperMessage>
                  <strong>
                    Changing the alias of an existing ATBD may result in broken
                    links.
                  </strong>
                </FormHelperMessage>
              )}
              <FormHelperMessage>
                Only alphanumeric characters and dashes are allowed.
              </FormHelperMessage>
            </div>
            {aliasStatus === 'checking' && (
              <FormHelperMessage>
                Checking if alias is available.
              </FormHelperMessage>
            )}
          </>
        )
      }
    />
  );
}
