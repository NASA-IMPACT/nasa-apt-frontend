import React from 'react'; /* eslint-disable react/display-name */
import get from 'lodash.get';

import { editorEmptyValue } from '../../slate/editor';

import StepIdentifyingInformation from './step-identifying-information';
import StepIntroduction from './step-introduction';
import StepAlgoDescription from './step-algo-description';

/**
 * Returns the default object filled with values from source if they exist. If
 * not the defaults are use.
 *
 * @param {object} obj source object. Expected to be an ATBD
 * @param {object} defaults defaults object
 */
const getFromObj = (obj, defaults) => {
  const { sections_completed = {}, ...remainingKeys } = defaults;

  return {
    // The id of the atbd will never be changed but is useful to have present.
    id: obj.id,
    ...Object.keys(remainingKeys).reduce((acc, key) => {
      const defValue = defaults[key];
      const source = get(obj, key);
      const isObject = !Array.isArray(defValue) && defValue instanceof Object;

      // The fallback value can be changed with some tags. This is needed
      // because values set as object are recursively computed.
      const value = defValue === '<editor>' ? editorEmptyValue : defValue;
      return {
        ...acc,
        [key]: isObject ? getFromObj(source || {}, defValue) : source || value
      };
    }, {}),
    // The sections_completed must be handled slightly differently. Every time
    // we update sections_completed we must update the whole field, otherwise
    // the contents are replaced. To ensure that the correct values are present
    // we start with the defaults for the current step and update them with
    // whatever is already present in the ATBD. Not every step will use all the
    // sections, but they'll always be submitted.
    sections_completed: {
      ...sections_completed,
      ...(obj.sections_completed || {})
    }
  };
};

export const STEPS = [
  {
    id: 'identifying_information',
    label: 'Identifying information',
    StepComponent: StepIdentifyingInformation,
    getInitialValues: (atbd) => {
      return getFromObj(atbd, {
        title: '',
        alias: '',
        citation: {
          creators: '',
          editors: '',
          title: '',
          series_name: '',
          release_date: '',
          release_place: '',
          publisher: '',
          version: '',
          issue: '',
          additional_details: '',
          online_resource: ''
        },
        sections_completed: {
          citation: 'incomplete'
        }
      });
    }
  },
  {
    id: 'contacts',
    label: 'Contact information',
    StepComponent: () => <p>Contact information coming soon!</p>,
    getInitialValues: () => {
      return {};
    }
  },
  {
    id: 'references',
    label: 'References',
    StepComponent: () => <p>References coming soon!</p>,
    getInitialValues: () => {
      return {};
    }
  },
  {
    id: 'introduction',
    label: 'Introduction',
    StepComponent: StepIntroduction,
    getInitialValues: (atbd) => {
      return getFromObj(atbd, {
        introduction: '<editor>',
        historical_perspective: '<editor>',
        sections_completed: {
          introduction: 'incomplete',
          historical_perspective: 'incomplete'
        }
      });
    }
  },
  {
    id: 'algorithm_description',
    label: 'Algorithm description',
    StepComponent: StepAlgoDescription,
    getInitialValues: (atbd) => {
      return getFromObj(atbd, {
        scientific_theory: '<editor>',
        scientific_theory_assumptions: '<editor>',
        mathematical_theory: '<editor>',
        mathematical_theory_assumptions: '<editor>',
        algorithm_input_variables: '',
        algorithm_output_variables: '',
        sections_completed: {
          scientific_theory: 'incomplete',
          mathematical_theory: 'incomplete',
          input_variables: 'incomplete',
          output_variables: 'incomplete'
        }
      });
    }
  },
  {
    id: 'algorithm_usage',
    label: 'Algorithm usage',
    StepComponent: () => <p>Algorithm usage coming soon!</p>,
    getInitialValues: () => {
      return {};
    }
  },
  {
    id: 'algorithm_implementation',
    label: 'Algorithm implementation',
    StepComponent: () => <p>Algorithm implementation coming soon!</p>,
    getInitialValues: () => {
      return {};
    }
  },
  {
    id: 'journal_details',
    label: 'Journal details',
    StepComponent: () => <p>Journal details coming soon!</p>,
    getInitialValues: () => {
      return {};
    }
  }
];

export const getATBDEditStep = (id) => {
  // If no id is set, use the first step.
  const idx = id ? STEPS.findIndex((step) => step.id === id) : 0;

  // Returning an empty objects allows us to correctly deconstruct the object
  // and perform easier validations.
  if (idx < 0) return {};

  return {
    stepNum: idx + 1,
    ...STEPS[idx]
  };
};
