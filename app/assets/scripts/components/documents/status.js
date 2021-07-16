/**
 * File with mappings for the different statuses.
 */

// 1.  (DRAFT) --> Request closed review --> (CLOSED_REVIEW_REQUESTED)
// 2.  (CLOSED_REVIEW_REQUESTED) --> Cancel closed review request --> (DRAFT)
// 3.  (CLOSED_REVIEW_REQUESTED) --> Deny closed review request --> (DRAFT)
// 4.  (CLOSED_REVIEW_REQUESTED) --> Accept closed review request --> (CLOSED_REVIEW)
// 5.  (CLOSED_REVIEW) --> Open Review --> (OPEN_REVIEW)
// 6.  (OPEN_REVIEW) --> Request Curation --> (CURATION_REQUESTED)
// 7.  (CURATION_REQUESTED) --> Cancel Curation Request --> (OPEN_REVIEW)
// 8.  (CURATION_REQUESTED) --> Deny Curation Request --> (OPEN_REVIEW)
// 9.  (CURATION_REQUESTED) -->  Accept Curation Request --> (CURATION)
// 10. (CURATION) --> Publish --> (PUBLISHED)

const DRAFT = 'Draft';
const CLOSED_REVIEW_REQUESTED = 'CLOSED_REVIEW_REQUESTED';
const CLOSED_REVIEW = 'CLOSED_REVIEW';
const OPEN_REVIEW = 'OPEN_REVIEW';
const CURATION_REQUESTED = 'CURATION_REQUESTED';
const CURATION = 'CURATION';
const PUBLISHED = 'Published';

export const DOCUMENT_STATUS = [
  { id: DRAFT, label: 'Draft' },
  { id: CLOSED_REVIEW_REQUESTED, label: 'Draft' },
  { id: CLOSED_REVIEW, label: 'In closed review' },
  { id: OPEN_REVIEW, label: 'In review' },
  { id: CURATION_REQUESTED, label: 'In review' },
  { id: CURATION, label: 'In publication' },
  { id: PUBLISHED, label: 'Published' }
];

/**
 * Return the document status from its id
 * @param {string} id The status id
 */
export const getDocumentStatus = (id) => {
  return DOCUMENT_STATUS.find((s) => s.id === id);
};

/**
 * Return the label for a given status.
 * @param {object|string} versionOsStatus The doc version or the status string.
 */
export const getDocumentStatusLabel = (versionOsStatus) => {
  return getDocumentStatus(versionOsStatus?.status || versionOsStatus)?.label;
};

/**
 * Checks that the given document or status string matched the given statuses
 * options.
 * @param {object|string} versionOsStatus The doc version or the status string
 * @param {array} statuses Status to check
 * @returns boolean
 */
const isInStatus = (versionOsStatus, statuses) =>
  statuses.includes(versionOsStatus?.status || versionOsStatus);

/**
 * Checks that the given document or status string is in Draft
 * @param {object|string} versionOsStatus The doc version or the status string
 * @returns boolean
 */
export const isDraft = (versionOsStatus) => {
  return isInStatus(versionOsStatus, [DRAFT]);
};
