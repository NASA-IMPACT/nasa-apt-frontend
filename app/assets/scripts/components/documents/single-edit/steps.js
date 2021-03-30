import React from 'react'; /* eslint-disable react/display-name */
import get from 'lodash.get';

import StepIdentifyingInformation from './step-identifying-information';

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
    ...Object.keys(remainingKeys).reduce((acc, key) => {
      const value = defaults[key];
      const source = get(obj, key);
      const isObject = !Array.isArray(value) && value instanceof Object;
      return {
        ...acc,
        [key]: isObject ? getFromObj(source || {}, value) : source || value
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
    getInitialValues: (atbd) => {
      return {};
    }
  },
  {
    id: 'references',
    label: 'References',
    StepComponent: () => <p>References coming soon!</p>,
    getInitialValues: (atbd) => {
      return {};
    }
  },
  {
    id: 'introduction',
    label: 'Introduction',
    StepComponent: () => <p>Introduction coming soon!</p>,
    getInitialValues: (atbd) => {
      return {};
    }
  },
  {
    id: 'algorithm_description',
    label: 'Algorithm description',
    StepComponent: () => <p>Algorithm description coming soon!</p>,
    getInitialValues: (atbd) => {
      return {};
    }
  },
  {
    id: 'algorithm_usage',
    label: 'Algorithm usage',
    StepComponent: () => <p>Algorithm usage coming soon!</p>,
    getInitialValues: (atbd) => {
      return {};
    }
  },
  {
    id: 'algorithm_implementation',
    label: 'Algorithm implementation',
    StepComponent: () => <p>Algorithm implementation coming soon!</p>,
    getInitialValues: (atbd) => {
      return {};
    }
  },
  {
    id: 'journal_details',
    label: 'Journal details',
    StepComponent: () => <p>Journal details coming soon!</p>,
    getInitialValues: (atbd) => {
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
