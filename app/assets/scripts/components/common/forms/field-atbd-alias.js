import React, { useEffect, useMemo, useState } from 'react';
import { useFormikContext } from 'formik';
import deburr from 'lodash.deburr';
import debounce from 'lodash.debounce';
import { FormHelperMessage } from '@devseed-ui/form';

import { InputText } from './input-text';

import { axiosAPI } from '../../../utils/axios';

const toAliasFormat = (v) =>
  deburr(v)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');

const isValidAtbdAlias = async (alias) => {
  try {
    await axiosAPI({
      url: `/atbds/${alias}`,
      method: 'head'
    });
    // Request was successful. Means atbd with given alias already exists.
    return false;
  } catch (error) {
    // Request errored with 404.
    return true;
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
    unregisterField
  } = useFormikContext();

  // To check whether the alias is valid we have to make an api request. This
  // check is being made when the field changes and on blur. When formik runs
  // validation we return the last result because otherwise we'd be making
  // request every time any field changes.
  const [isAliasValid, setAliasValid] = useState(true);

  // Register the field on Formik.
  useEffect(() => {
    registerField('alias', {
      validate: (value) => {
        // If it had a value the field becomes required.
        if (initialValues.alias && !value) {
          return 'The alias is required';
        }

        if (value) {
          return !isAliasValid ? 'This alias is already in use' : undefined;
        }
      }
    });

    return () => {
      unregisterField('alias');
    };
  }, [registerField, unregisterField, isAliasValid, initialValues.alias]);

  const [isCheckingAlias, setCheckingAlias] = useState(false);

  const checkAliasExist = useMemo(() => {
    const checker = async (value) => {
      // No point in checking if the alias didn't change.
      if (!value || value === initialValues.alias) return;

      setCheckingAlias(true);
      // Check if the alias is available. If not append a number up to -5. If
      // everything is taken show an error.
      for (let count = 0; count < 5; count++) {
        const aliasValue = count ? `${value}-${count}` : value;

        if (await isValidAtbdAlias(aliasValue)) {
          setCheckingAlias(false);
          setAliasValid(true);
          return setFieldValue('alias', aliasValue);
        }
      }

      // Attempts exhausted.
      setCheckingAlias(false);
      setAliasValid(false);
      setFieldError('alias', 'This alias is already in use');
    };

    return debounce(checker, 1000);
  }, [setFieldValue, setFieldError, initialValues.alias]);

  // Update the value from the title field.
  useEffect(() => {
    // Only create alias from title if:
    if (
      // there's no alias.
      !initialValues.alias &&
      // there was a change in the title. Avoids modifying the field when
      // mounting.
      initialValues.title !== title &&
      // the user didn't input anything yet.
      !touched.alias &&
      // There is an actual title
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
    touched.title,
    touched.alias,
    checkAliasExist,
    setFieldValue
  ]);

  return (
    <InputText
      id='alias'
      name='alias'
      label='Alias'
      value={alias}
      onBlur={(e) => {
        checkAliasExist(toAliasFormat(e.target.value));
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
            {isCheckingAlias && (
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
