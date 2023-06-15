import { getValuesFromObj, EDITOR_SYM } from '../../../utils/get-values-object';
import { JOURNAL_NO_PUBLICATION } from '../status';

import StepIdentifyingInformation from './step-identifying-information';
import StepIntroduction from './step-introduction';
import StepAlgoDescription from './step-algo-description';
import StepAlgoUsage from './step-algo-usage';
import StepAlgoImplementation from './step-algo-implementation';
import StepReferences from './step-references';
import StepContacts from './step-contacts';
import StepCloseout from './step-closeout';
import StepAttachment from './step-attachment';

const STEP_IDENTIFYING_INFORMATION = {
  id: 'identifying_information',
  label: 'Identifying Information',
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
      document: {
        version_description: EDITOR_SYM
      },
      sections_completed: {
        version_description: 'incomplete',
        citation: 'incomplete'
      }
    });
  }
};

const STEP_CONTACTS = {
  id: 'contacts',
  label: 'Contact Information',
  StepComponent: StepContacts,
  getInitialValues: (atbd) => {
    return getValuesFromObj(atbd, {
      contacts_link: [
        // {
        //   contact: {}
        //   roles: []
        //   affiliations: []
        // }
      ],
      sections_completed: {
        contacts: 'incomplete'
      }
    });
  }
};

const STEP_REFERENCES = {
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
};

const STEP_INTRODUCTION = {
  id: 'introduction',
  label: 'Algorithm Introduction',
  StepComponent: StepIntroduction,
  getInitialValues: (atbd) => {
    return getValuesFromObj(atbd, {
      document: {
        introduction: EDITOR_SYM,
        historical_perspective: EDITOR_SYM,
        additional_information: EDITOR_SYM,
        // Publication references are needed in steps with <editor> fields in
        // case the users wants to insert one.
        publication_references: []
      },
      sections_completed: {
        introduction: 'incomplete',
        context_background: 'incomplete'
      }
    });
  }
};

const STEP_ATTACHMENT = {
  id: 'attachment',
  label: 'Attachment',
  StepComponent: StepAttachment,
  getInitialValues: (atbd) => {
    return getValuesFromObj(atbd, {
      document: {
        pdf_id: undefined
      },
      sections_completed: {
        attachment: 'incomplete'
      }
    });
  }
};

const STEP_ALGORITHM_DESCRIPTION = {
  id: 'algorithm_description',
  label: 'Algorithm Description',
  StepComponent: StepAlgoDescription,
  getInitialValues: (atbd) => {
    return getValuesFromObj(atbd, {
      document: {
        scientific_theory: EDITOR_SYM,
        scientific_theory_assumptions: EDITOR_SYM,
        mathematical_theory: EDITOR_SYM,
        mathematical_theory_assumptions: EDITOR_SYM,
        algorithm_input_variables_caption: '',
        algorithm_input_variables: [
          // Default is empty and set when adding an array field in the form.
          // {
          //   name: EDITOR_SYM
          //   long_name: EDITOR_SYM
          //   unit: EDITOR_SYM
          // }
        ],
        algorithm_output_variables_caption: '',
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
};

const STEP_ALGORITHM_USAGE = {
  id: 'algorithm_usage',
  label: 'Algorithm Usage',
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
};

const STEP_ALGORITHM_IMPLEMENTATION = {
  id: 'algorithm_implementation',
  label: 'Algorithm Implementation',
  StepComponent: StepAlgoImplementation,
  getInitialValues: (atbd) => {
    return getValuesFromObj(atbd, {
      document: {
        algorithm_implementations: [
          // At least 1 item is required.
          {
            url: '',
            description: ''
          }
        ],
        data_access_input_data: [
          // At least 1 item is required.
          {
            url: '',
            description: ''
          }
        ],
        data_access_output_data: [
          // At least 1 item is required.
          {
            url: '',
            description: ''
          }
        ],
        data_access_related_urls: [
          // At least 1 item is required.
          {
            url: '',
            description: ''
          }
        ],
        // Publication references are needed in steps with <editor> fields in
        // case the users wants to insert one.
        publication_references: []
      },
      sections_completed: {
        algorithm_availability: 'incomplete',
        data_access_input_data: 'incomplete',
        data_access_output_data: 'incomplete',
        data_access_related_urls: 'incomplete'
      }
    });
  }
};

const STEP_CLOSEOUT = {
  id: 'closeout',
  label: 'Closeout',
  StepComponent: StepCloseout,
  getInitialValues: (atbd) => {
    return getValuesFromObj(atbd, {
      journal_status: JOURNAL_NO_PUBLICATION,
      document: {
        abstract: EDITOR_SYM,
        plain_summary: EDITOR_SYM,
        key_points: '',
        journal_discussion: EDITOR_SYM,
        journal_acknowledgements: EDITOR_SYM,
        data_availability: EDITOR_SYM,
        // Publication references are needed in steps with <editor> fields in
        // case the users wants to insert one.
        publication_references: []
      },
      keywords: [
        // Default is empty and set when selecting keywords in the form.
        // {
        //   label: ''
        //   value: ''
        //   id: ''
        //   path: ''
        // }
      ],
      publication_checklist: {
        suggested_reviewers: [
          // Default is empty and set when adding an array field in the form.
          // {
          //   name: ''
          //   email: ''
          // }
        ],
        review_roles: false,
        journal_editor: 'Chelle Gentemann',
        author_affirmations: false
      },
      sections_completed: {
        abstract: 'incomplete',
        discussion: 'incomplete',
        acknowledgements: 'incomplete',
        publication_checklist: 'incomplete'
      }
    });
  }
};

const ATBD_STEPS = [
  STEP_IDENTIFYING_INFORMATION,
  STEP_CONTACTS,
  STEP_REFERENCES,
  STEP_INTRODUCTION,
  STEP_ALGORITHM_DESCRIPTION,
  STEP_ALGORITHM_USAGE,
  STEP_ALGORITHM_IMPLEMENTATION,
  STEP_CLOSEOUT
];

const PDF_STEPS = [
  STEP_IDENTIFYING_INFORMATION,
  STEP_CONTACTS,
  STEP_ATTACHMENT,
  STEP_CLOSEOUT
];

export function getSteps(isPdfMode = false) {
  if (!isPdfMode) {
    return ATBD_STEPS;
  }

  return PDF_STEPS;
}

export const getDocumentEditStep = (id, isPdfMode = false) => {
  const steps = getSteps(isPdfMode);
  // If no id is set, use the first step.
  const idx = id ? steps.findIndex((step) => step.id === id) : 0;

  // Returning an empty objects allows us to correctly deconstruct the object
  // and perform easier validations.
  if (idx < 0) return {};

  return {
    stepNum: idx + 1,
    ...steps[idx]
  };
};

export const getNextDocumentEditStep = (id, isPdfMode = false) => {
  const steps = getSteps(isPdfMode);
  const currentStep = getDocumentEditStep(id, isPdfMode);
  return {
    stepNum: currentStep.stepNum + 1,
    ...steps[currentStep.stepNum]
  };
};
