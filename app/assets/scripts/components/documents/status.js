/**
 * File with mappings for the different statuses.
 */

// 1.  (DRAFT) --> Request closed review --> (CLOSED_REVIEW_REQUESTED)
// 2.  (CLOSED_REVIEW_REQUESTED) --> Cancel closed review request --> (DRAFT)
// 3.  (CLOSED_REVIEW_REQUESTED) --> Deny closed review request --> (DRAFT)
// 4.  (CLOSED_REVIEW_REQUESTED) --> Accept closed review request --> (CLOSED_REVIEW)
// 5.  (CLOSED_REVIEW) --> Open Review --> (OPEN_REVIEW)
// 6.  (OPEN_REVIEW) --> Request Publication --> (PUBLICATION_REQUESTED)
// 7.  (PUBLICATION_REQUESTED) --> Cancel Publication Request --> (OPEN_REVIEW)
// 8.  (PUBLICATION_REQUESTED) --> Deny Publication Request --> (OPEN_REVIEW)
// 9.  (PUBLICATION_REQUESTED) -->  Accept Publication Request --> (PUBLICATION)
// 10. (PUBLICATION) --> Publish --> (PUBLISHED)

export const DRAFT = 'DRAFT';
export const CLOSED_REVIEW_REQUESTED = 'CLOSED_REVIEW_REQUESTED';
export const CLOSED_REVIEW = 'CLOSED_REVIEW';
export const OPEN_REVIEW = 'OPEN_REVIEW';
export const PUBLICATION_REQUESTED = 'PUBLICATION_REQUESTED';
export const PUBLICATION = 'PUBLICATION';
export const PUBLISHED = 'PUBLISHED';

export const DOCUMENT_STATUS = [
  { id: DRAFT, label: 'Draft' },
  { id: CLOSED_REVIEW_REQUESTED, label: 'Draft' },
  { id: CLOSED_REVIEW, label: 'In closed review' },
  { id: OPEN_REVIEW, label: 'In review' },
  { id: PUBLICATION_REQUESTED, label: 'In review' },
  { id: PUBLICATION, label: 'In publication' },
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
