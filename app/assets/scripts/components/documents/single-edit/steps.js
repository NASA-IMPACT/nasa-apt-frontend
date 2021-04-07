import React from 'react'; /* eslint-disable react/display-name */
import get from 'lodash.get';

import { editorEmptyValue } from '../../slate/editor';

import StepIdentifyingInformation from './step-identifying-information';
import StepIntroduction from './step-introduction';
import StepAlgoDescription from './step-algo-description';
import StepAlgoUsage from './step-algo-usage';

/**
 * Returns the default object filled with values from source if they exist. If
 * not the defaults are use.
 *
 * @param {object} obj source object. Expected to be an ATBD
 * @param {object} defaults defaults object
 */
const getFromObj = (obj, defaults) => {
  const recursiveGet = (_obj, _defaults) =>
    Object.keys(_defaults).reduce((acc, key) => {
      const defValue = _defaults[key];
      const source = get(_obj, key);
      const isObject = !Array.isArray(defValue) && defValue instanceof Object;

      // The fallback value can be changed with some tags. This is needed
      // because values set as object are recursively computed.
      const value = defValue === '<editor>' ? editorEmptyValue : defValue;
      return {
        ...acc,
        [key]: isObject ? recursiveGet(source || {}, defValue) : source || value
      };
    }, {});

  return {
    // The id of the atbd will never be changed but is useful to have present.
    id: obj.id,
    ...recursiveGet(obj, defaults)
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
        document: {
          introduction: '<editor>',
          historical_perspective: '<editor>'
        },
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
        document: {
          scientific_theory: '<editor>',
          scientific_theory_assumptions: '<editor>',
          mathematical_theory: '<editor>',
          mathematical_theory_assumptions: '<editor>',
          algorithm_input_variables: '',
          algorithm_output_variables: ''
        },
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
    StepComponent: StepAlgoUsage,
    getInitialValues: (atbd) => {
      return getFromObj(atbd, {
        document: {
          algorithm_usage_constraints: '<editor>',
          performance_assessment_validation_methods: '<editor>',
          performance_assessment_validation_uncertainties: '<editor>',
          performance_assessment_validation_errors: '<editor>'
        },
        sections_completed: {
          constraints: 'incomplete',
          validation: 'incomplete'
        }
      });
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
