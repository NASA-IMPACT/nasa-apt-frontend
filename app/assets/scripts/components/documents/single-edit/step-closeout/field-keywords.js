import React, { useEffect, useRef } from 'react';
import { useField } from 'formik';
import { FormHelperMessage } from '@devseed-ui/form';

import MultiSelect from '../../../common/forms/multi-select';
import FormGroupStructure from '../../../common/forms/form-group-structure';
import Tip from '../../../common/tooltip';

import { axiosAPI } from '../../../../utils/axios';
import { selectComponents } from '../../../common/forms/select-combo';
import useSafeState from '../../../../utils/use-safe-state';
import { components } from 'react-select';

const KEYWORDS_FIELD_NAME = 'keywords';

const fetchKeywordPath = async (uuid) => {
  try {
    const response = await axiosAPI({
      url: `/kms/keyword/${uuid}`
    });
    return response.data.fullPath;
  } catch (error) {
    return null;
  }
};

/**
 * Updates the selected keywords, by fetching additional information from the
 * keywords api.
 * @param {object} formValues The submitted form values
 * @returns object
 */
export const updateKeywordValues = async (formValues) => {
  const data = await Promise.all(
    formValues[KEYWORDS_FIELD_NAME].map(async (keyword) => {
      // If there's a path key, it means that data was already fetched for this keyword
      if (keyword.path) return keyword;

      const path = await fetchKeywordPath(keyword.value);
      // If the keywords request fails (null), remove it from the list.
      return path ? { ...keyword, path } : null;
    })
  );
  return {
    ...formValues,
    [KEYWORDS_FIELD_NAME]: data.filter(Boolean)
  };
};

/**
 * Fetches the keywords that match the current requested input value.
 * @param {string} v Current input value
 * @returns array
 */
const keywordsLoader = async (v) => {
  try {
    const response = await axiosAPI({
      url: `/kms/concepts/concept_scheme/sciencekeywords/pattern/${v}`
    });
    const keywords = response.data.concepts.map((c) => ({
      label: c.prefLabel,
      value: c.uuid,
      id: c.id
    }));
    return keywords;
  } catch (error) {
    return [];
  }
};

// Components to override the react-select
/* eslint-disable react/prop-types */
const Option = (props) => {
  const { children, isFocused, isDisabled, data } = props;
  const [keywordPathValue, setKeywordPathValue] = useSafeState();

  const focusRef = useRef();
  focusRef.current = isFocused;

  useEffect(() => {
    if (isDisabled || !isFocused || keywordPathValue) return;

    const run = async () => {
      // To avoid making several requests, we only start the request if the user
      // lingers a bit on the option.
      await new Promise((r) => setTimeout(r, 250));
      if (!focusRef.current) return;

      const path = await fetchKeywordPath(data.value);
      setKeywordPathValue(path);
    };

    run();
  }, [
    isFocused,
    isDisabled,
    setKeywordPathValue,
    keywordPathValue,
    data.value
  ]);

  return (
    <selectComponents.Option {...props}>
      <Tip
        title={
          keywordPathValue
            ? keywordPathValue.replace(/\|/g, ' > ')
            : 'Loading...'
        }
        open={isFocused}
      >
        {children}
      </Tip>
    </selectComponents.Option>
  );
};

const MultiValueLabel = (props) => {
  const { data } = props;
  const [keywordPathValue, setKeywordPathValue] = useSafeState();

  useEffect(() => {
    // On mount get the path if not set. The path will be set if the options
    // were saved on the atbd. If the option has just been selected it won't
    // have a path.
    if (!data.path) {
      const run = async () => {
        const path = await fetchKeywordPath(data.value);
        setKeywordPathValue(path);
      };

      run();
    } else {
      setKeywordPathValue(data.path);
    }
  }, [data.path, data.value, keywordPathValue, setKeywordPathValue]);

  return (
    <Tip
      title={
        keywordPathValue ? keywordPathValue.replace(/\|/g, ' > ') : 'Loading...'
      }
    >
      <components.MultiValueLabel {...props} />
    </Tip>
  );
};

const keywordsFieldComponents = { Option, MultiValueLabel };
/* eslint-enable react/prop-types */

export default function KeywordsField() {
  const [field, meta, helpers] = useField(KEYWORDS_FIELD_NAME);
  const { value, touched, error } = meta;
  const { setValue, setTouched } = helpers;

  return (
    <FormGroupStructure
      id='document-keywords'
      name={field.name}
      label='Keywords'
      helper={
        touched && error ? (
          <FormHelperMessage invalid>{error}</FormHelperMessage>
        ) : null
      }
    >
      <MultiSelect
        id='document-keywords'
        name={field.name}
        loadOptions={keywordsLoader}
        value={value}
        components={keywordsFieldComponents}
        onChange={(v) => setValue(v)}
        onBlur={() => setTouched()}
      />
    </FormGroupStructure>
  );
}
