/**
 * File with info for the different sections that exist in the document form.
 * The for is divided by steps and each step has different sections.
 * Each `step-*.js` file will define which sections are available on each step.
 */

export const DOCUMENT_SECTIONS = [
  { id: 'general', label: 'General' },
  { id: 'citation', label: 'Citation' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'introduction', label: 'Introduction' },
  { id: 'context_background', label: 'Context / Background' },
  { id: 'scientific_theory', label: 'Scientific Theory' },
  { id: 'mathematical_theory', label: 'Mathematical Theory' },
  { id: 'input_variables', label: 'Algorithm Input Variables' },
  { id: 'output_variables', label: 'Algorithm Output Variables' },
  { id: 'constraints', label: 'Constraints' },
  { id: 'validation', label: 'Algorithm Validation' },
  { id: 'algorithm_availability', label: 'Algorithm Availability' },
  { id: 'data_access_input_data', label: 'Input Data Access' },
  { id: 'data_access_output_data', label: 'Output Data Access' },
  { id: 'data_access_related_urls', label: 'Important Related Urls' },
  { id: 'discussion', label: 'Discussion' },
  { id: 'acknowledgements', label: 'Acknowledgements' }
];

/**
 * Return the section from its id
 * @param {string} id The section id
 */
export const getDocumentSection = (id) => {
  return DOCUMENT_SECTIONS.find((s) => s.id === id);
};

/**
 * Return the label for a given section.
 * @param {string} id The section id
 */
export const getDocumentSectionLabel = (id) => {
  return getDocumentSection(id)?.label;
};
