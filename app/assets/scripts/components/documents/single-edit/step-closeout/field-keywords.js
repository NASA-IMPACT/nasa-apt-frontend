import React from 'react';
import { useField } from 'formik';
import { FormHelperMessage } from '@devseed-ui/form';

import MultiSelect from '../../../common/forms/multi-select';

import { axiosAPI } from '../../../../utils/axios';
import FormGroupStructure from '../../../common/forms/form-group-structure';

const KEYWORDS_FIELD_NAME = 'keywords';

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

      try {
        const response = await axiosAPI({
          url: `/kms/keyword/${keyword.value}`
        });
        return { ...keyword, path: response.data.fullPath };
      } catch (error) {
        // If th keywords request fail, remove it from the list.
        return null;
      }
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
        onChange={(v) => setValue(v)}
        onBlur={() => setTouched()}
      />
    </FormGroupStructure>
  );
}
