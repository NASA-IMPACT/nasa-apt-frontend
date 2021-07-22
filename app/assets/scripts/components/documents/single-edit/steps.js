import { getValuesFromObj, EDITOR_SYM } from '../../../utils/get-values-object';

import StepIdentifyingInformation from './step-identifying-information';
import StepIntroduction from './step-introduction';
import StepAlgoDescription from './step-algo-description';
import StepAlgoUsage from './step-algo-usage';
import StepJournalDetails from './step-journal-details';
import StepAlgoImplementation from './step-algo-implementation';
import StepReferences from './step-references';
import StepContacts from './step-contacts';

export const STEPS = [
  {
    id: 'identifying_information',
    label: 'Identifying information',
    StepComponent: StepIdentifyingInformation,
    getInitialValues: (atbd) => {
      return getValuesFromObj(atbd, {
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
        doi: '',
        sections_completed: {
          citation: 'incomplete'
        }
      });
    }
  },
  {
    id: 'contacts',
    label: 'Contact information',
    StepComponent: StepContacts,
    getInitialValues: (atbd) => {
      return getValuesFromObj(atbd, {
        contacts_link: [
          // {
          //   contact: {}
          //   roles: []
          // }
        ],
        sections_completed: {
          contacts: 'incomplete'
        }
      });
    }
  },
  {
    id: 'references',
    label: 'References',
    StepComponent: StepReferences,
    getInitialValues: (atbd) => {
      return getValuesFromObj(atbd, {
        document: {
          // In the references page we need all the fields with an editor in
          // case the user removes a reference, because we remove the reference
          // node from all the fields.
          introduction: EDITOR_SYM,
          historical_perspective: EDITOR_SYM,
          scientific_theory: EDITOR_SYM,
          scientific_theory_assumptions: EDITOR_SYM,
          mathematical_theory: EDITOR_SYM,
          mathematical_theory_assumptions: EDITOR_SYM,
          algorithm_usage_constraints: EDITOR_SYM,
          performance_assessment_validation_methods: EDITOR_SYM,
          performance_assessment_validation_uncertainties: EDITOR_SYM,
          performance_assessment_validation_errors: EDITOR_SYM,
          journal_discussion: EDITOR_SYM,
          journal_acknowledgements: EDITOR_SYM,
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
      return getValuesFromObj(atbd, {
        document: {
          introduction: EDITOR_SYM,
          historical_perspective: EDITOR_SYM,
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
      return getValuesFromObj(atbd, {
        document: {
          scientific_theory: EDITOR_SYM,
          scientific_theory_assumptions: EDITOR_SYM,
          mathematical_theory: EDITOR_SYM,
          mathematical_theory_assumptions: EDITOR_SYM,
          algorithm_input_variables: [
            // Default is empty and set when adding an array field in the form.
            // {
            //   name: EDITOR_SYM
            //   long_name: EDITOR_SYM
            //   unit: EDITOR_SYM
            // }
          ],
          algorithm_output_variables: [
            // Default is empty and set when adding an array field in the form.
            // {
            //   name: EDITOR_SYM
            //   long_name: EDITOR_SYM
            //   unit: EDITOR_SYM
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
      return getValuesFromObj(atbd, {
        document: {
          algorithm_usage_constraints: EDITOR_SYM,
          performance_assessment_validation_methods: EDITOR_SYM,
          performance_assessment_validation_uncertainties: EDITOR_SYM,
          performance_assessment_validation_errors: EDITOR_SYM,
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
      return getValuesFromObj(atbd, {
        document: {
          algorithm_implementations: [
            // Default is empty and set when adding an array field in the form.
            // {
            //   url: '',
            //   description: EDITOR_SYM
            // }
          ],
          data_access_input_data: [
            // Default is empty and set when adding an array field in the form.
            // {
            //   url: '',
            //   description: EDITOR_SYM
            // }
          ],
          data_access_output_data: [
            // Default is empty and set when adding an array field in the form.
            // {
            //   url: '',
            //   description: EDITOR_SYM
            // }
          ],
          data_access_related_urls: [
            // Default is empty and set when adding an array field in the form.
            // {
            //   url: '',
            //   description: EDITOR_SYM
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
      return getValuesFromObj(atbd, {
        document: {
          journal_discussion: EDITOR_SYM,
          journal_acknowledgements: EDITOR_SYM,
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

export const getDocumentEditStep = (id) => {
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
