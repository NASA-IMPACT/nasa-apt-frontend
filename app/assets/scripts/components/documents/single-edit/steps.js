import React from 'react'; /* eslint-disable react/display-name */
import get from 'lodash.get';

import { editorEmptyValue } from '../../slate';

import StepIdentifyingInformation from './step-identifying-information';
import StepIntroduction from './step-introduction';
import StepAlgoDescription from './step-algo-description';
import StepAlgoUsage from './step-algo-usage';
import StepJournalDetails from './step-journal-details';
import StepAlgoImplementation from './step-algo-implementation';
import StepReferences from './step-references';

const editorSymbol = Symbol.for('<editor>');
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
      const value = defValue === editorSymbol ? editorEmptyValue : defValue;
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
    StepComponent: StepReferences,
    getInitialValues: (atbd) => {
      return getFromObj(atbd, {
        document: {
          publication_references: [
            // Default is empty and set when adding an array field in the form.
            // {
            //   id: '',
            //   authors: '',
            //   title: '',
            //   series: '',
            //   edition: '',
            //   volume: '',
            //   issue: '',
            //   publication_place: '',
            //   publisher: '',
            //   pages: '',
            //   isbn: '',
            //   year: '',
            //   doi: '',
            //   other_reference_details: '',
            //   report_number: '',
            //   online_resource: ''
            // }
          ]
        }
      });
    }
  },
  {
    id: 'introduction',
    label: 'Introduction',
    StepComponent: StepIntroduction,
    getInitialValues: (atbd) => {
      return getFromObj(atbd, {
        document: {
          introduction: editorSymbol,
          historical_perspective: editorSymbol,
          // Publication references are needed in steps with <editor> fields in
          // case the users wants to insert one.
          publication_references: []
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
          scientific_theory: editorSymbol,
          scientific_theory_assumptions: editorSymbol,
          mathematical_theory: editorSymbol,
          mathematical_theory_assumptions: editorSymbol,
          algorithm_input_variables: [
            // Default is empty and set when adding an array field in the form.
            // {
            //   name: editorSymbol
            //   long_name: editorSymbol
            //   unit: editorSymbol
            // }
          ],
          algorithm_output_variables: [
            // Default is empty and set when adding an array field in the form.
            // {
            //   name: editorSymbol
            //   long_name: editorSymbol
            //   unit: editorSymbol
            // }
          ],
          // Publication references are needed in steps with <editor> fields in
          // case the users wants to insert one.
          publication_references: []
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
          algorithm_usage_constraints: editorSymbol,
          performance_assessment_validation_methods: editorSymbol,
          performance_assessment_validation_uncertainties: editorSymbol,
          performance_assessment_validation_errors: editorSymbol,
          // Publication references are needed in steps with <editor> fields in
          // case the users wants to insert one.
          publication_references: []
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
    StepComponent: StepAlgoImplementation,
    getInitialValues: (atbd) => {
      return getFromObj(atbd, {
        document: {
          algorithm_implementations: [
            // Default is empty and set when adding an array field in the form.
            // {
            //   url: '',
            //   description: editorSymbol
            // }
          ],
          data_access_input_data: [
            // Default is empty and set when adding an array field in the form.
            // {
            //   url: '',
            //   description: editorSymbol
            // }
          ],
          data_access_output_data: [
            // Default is empty and set when adding an array field in the form.
            // {
            //   url: '',
            //   description: editorSymbol
            // }
          ],
          data_access_related_urls: [
            // Default is empty and set when adding an array field in the form.
            // {
            //   url: '',
            //   description: editorSymbol
            // }
          ],
          // Publication references are needed in steps with <editor> fields in
          // case the users wants to insert one.
          publication_references: []
        },
        sections_completed: {
          algorithm_implementations: 'incomplete',
          data_access_input_data: 'incomplete',
          data_access_output_data: 'incomplete',
          data_access_related_urls: 'incomplete'
        }
      });
    }
  },
  {
    id: 'journal_details',
    label: 'Journal details',
    StepComponent: StepJournalDetails,
    getInitialValues: (atbd) => {
      return getFromObj(atbd, {
        document: {
          journal_discussion: editorSymbol,
          journal_acknowledgements: editorSymbol,
          // Publication references are needed in steps with <editor> fields in
          // case the users wants to insert one.
          publication_references: []
        },
        sections_completed: {
          discussion: 'incomplete',
          acknowledgements: 'incomplete'
        }
      });
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
