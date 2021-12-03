import { round } from '../../utils/format';
import { STEPS } from './single-edit/steps';
import { isJournalPublicationIntended } from './status';

// The closeout step is special. There are sections which should only be
// considered if the document is intended for journal publication.
const CLOSEOUT_JOURNAL_SECTIONS = [
  'discussion',
  'acknowledgements',
  'publication_checklist'
];

/**
 * Removes the given keys from the sections.
 * @param {object} sections Dictionary of sections
 * @param {array} sectionsToRemove List of keys of the sections to remove
 * @returns Object
 */
const filterSections = (sections, sectionsToRemove) =>
  Object.entries(sections).reduce(
    (acc, [k, v]) => (sectionsToRemove.includes(k) ? acc : { ...acc, [k]: v }),
    {}
  );

/**
 * From a an object with section_name: status calculate the percentage of
 * completeness.
 *
 * @param {object} sections Sections and their status (complete | incomplete)
 */
const calculateCompleteness = (sections) => {
  const sectionsKeys = Object.keys(sections);
  const sectionsComplete = sectionsKeys.reduce(
    (acc, k) => acc + Number(sections[k] === 'complete'),
    0
  );
  const sectionsTotal = sectionsKeys.length;

  return {
    percent: sectionsTotal
      ? round((sectionsComplete / sectionsTotal) * 100, 0)
      : 100,
    complete: sectionsComplete,
    total: sectionsTotal
  };
};

/**
 * Calculates the total completeness of an ATBD taking all the sections into
 * account.
 *
 * @param {object} atbd ATBD version data
 */
export const calculateDocumentCompleteness = (atbd) => {
  const allSections = STEPS.reduce((acc, step) => {
    // We can use getInitialValues to get the status of the sections
    // while adding any section that is not yet in the database.
    const { sections_completed = {}, journal_status } = step.getInitialValues(
      atbd
    );

    // The closeout step is special. There are sections which should only be
    // considered if the document is intended for journal publication.
    if (
      step.id === 'closeout' &&
      !isJournalPublicationIntended(journal_status)
    ) {
      return {
        ...acc,
        ...filterSections(sections_completed, CLOSEOUT_JOURNAL_SECTIONS)
      };
    }

    return {
      ...acc,
      ...sections_completed
    };
  }, {});

  return calculateCompleteness(allSections);
};

/**
 * Calculates the completeness of an ATBD edit step.
 *
 * @param {object} atbd ATBD version data
 * @param {object} step The step for which to calculate completeness
 */
export const calculateDocumentStepCompleteness = (atbd, step) => {
  const { getInitialValues } = step;
  // We can use getInitialValues to get the status of the sections
  // while adding any section that is not yet in the database.
  const { sections_completed = {}, journal_status } = getInitialValues(atbd);

  // The closeout step is special. There are sections which should only be
  // considered if the document is intended for journal publication.
  if (step.id === 'closeout' && !isJournalPublicationIntended(journal_status)) {
    return calculateCompleteness(
      filterSections(sections_completed, CLOSEOUT_JOURNAL_SECTIONS)
    );
  }

  return calculateCompleteness(sections_completed);
};
