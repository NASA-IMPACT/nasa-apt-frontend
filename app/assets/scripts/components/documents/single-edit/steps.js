import React from 'react'; /* eslint-disable react/display-name */

export const STEPS = [
  {
    id: 'identifying_information',
    label: 'Identifying information',
    StepComponent: () => <p>Identifying information coming soon!</p>
  },
  {
    id: 'contacts',
    label: 'Contact information',
    StepComponent: () => <p>Contact information coming soon!</p>
  },
  {
    id: 'references',
    label: 'References',
    StepComponent: () => <p>References coming soon!</p>
  },
  {
    id: 'introduction',
    label: 'Introduction',
    StepComponent: () => <p>Introduction coming soon!</p>
  },
  {
    id: 'algorithm_description',
    label: 'Algorithm description',
    StepComponent: () => <p>Algorithm description coming soon!</p>
  },
  {
    id: 'algorithm_usage',
    label: 'Algorithm usage',
    StepComponent: () => <p>Algorithm usage coming soon!</p>
  },
  {
    id: 'algorithm_implementation',
    label: 'Algorithm implementation',
    StepComponent: () => <p>Algorithm implementation coming soon!</p>
  },
  {
    id: 'journal_details',
    label: 'Journal details',
    StepComponent: () => <p>Journal details coming soon!</p>
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
