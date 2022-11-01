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
  { id: PUBLISHED, label: 'Public' }
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
 * @param {object|string} versionOrStatus The doc version or the status string.
 */
export const getDocumentStatusLabel = (versionOrStatus) => {
  return getDocumentStatus(versionOrStatus?.status || versionOrStatus)?.label;
};

/**
 * Checks that the given document or status string matched the given statuses
 * options.
 * @param {object|string} versionOrStatus The doc version or the status string
 * @param {array} statuses Status to check
 * @returns boolean
 */
const isInStatus = (versionOrStatus, statuses) =>
  statuses.includes(versionOrStatus?.status || versionOrStatus);

/**
 * Checks that the given document or status string is after the given one
 * @param {object|string} versionOrStatus The doc version or the status string
 * @param {status} status Base status to check if the provided is after.
 * @returns boolean
 */
export const isStatusAfter = (versionOrStatus, status) => {
  const statusList = DOCUMENT_STATUS.map((s) => s.id);
  // Status needs to be after the given one.
  const idx = statusList.findIndex((s) => s === status);
  const availableStatuses = statusList.slice(idx + 1);
  return isInStatus(versionOrStatus, availableStatuses);
};

/**
 * Checks that the given document or status string is in Draft
 * @param {object|string} versionOrStatus The doc version or the status string
 * @returns boolean
 */
export const isDraft = (versionOrStatus) => {
  return isInStatus(versionOrStatus, [DRAFT]);
};

/**
 * Checks that the given document or status string is in Draft or Closed Review
 * Requested which is like draft until approved by the curator.
 * @param {object|string} versionOrStatus The doc version or the status string
 * @returns boolean
 */
export const isDraftEquivalent = (versionOrStatus) => {
  return isInStatus(versionOrStatus, [DRAFT, CLOSED_REVIEW_REQUESTED]);
};

/**
 * Checks that the given document or status string is in Closed Review Requested
 * @param {object|string} versionOrStatus The doc version or the status string
 * @returns boolean
 */
export const isReviewRequested = (versionOrStatus) => {
  return isInStatus(versionOrStatus, [CLOSED_REVIEW_REQUESTED]);
};

/**
 * Checks that the given document or status string is in Closed Review
 * @param {object|string} versionOrStatus The doc version or the status string
 * @returns boolean
 */
export const isClosedReview = (versionOrStatus) => {
  return isInStatus(versionOrStatus, [CLOSED_REVIEW]);
};

/**
 * Checks that the given document or status string is in Open Review
 * @param {object|string} versionOrStatus The doc version or the status string
 * @returns boolean
 */
export const isOpenReview = (versionOrStatus) => {
  return isInStatus(versionOrStatus, [OPEN_REVIEW]);
};

/**
 * Checks that the given document or status string is in Closed Review Requested
 * or Open Review or Publication Requested.
 * @param {object|string} versionOrStatus The doc version or the status string
 * @returns boolean
 */
export const isReviewEquivalent = (versionOrStatus) => {
  return isInStatus(versionOrStatus, [
    CLOSED_REVIEW,
    OPEN_REVIEW,
    PUBLICATION_REQUESTED
  ]);
};

/**
 * Checks that the given document or status string is in Publication Requested
 * @param {object|string} versionOrStatus The doc version or the status string
 * @returns boolean
 */
export const isPublicationRequested = (versionOrStatus) => {
  return isInStatus(versionOrStatus, [PUBLICATION_REQUESTED]);
};

/**

 * Checks that the given document or status string is in Publication or after
 * @param {object|string} versionOrStatus The doc version or the status string
 * @returns boolean
 */
export const isPublicationOrAfter = (versionOrStatus) => {
  return isInStatus(versionOrStatus, [PUBLISHED]);
};

/**
 * Checks that the given document or status string is Published
 * @param {object|string} versionOrStatus The doc version or the status string
 * @returns boolean
 */
export const isPublished = (versionOrStatus) => {
  return isInStatus(versionOrStatus, [PUBLISHED]);
};

export const REVIEW_PROGRESS = 'IN_PROGRESS';
export const REVIEW_DONE = 'DONE';

/**
 * Checks that the given reviewer has completed the review.
 * @param {object|string} reviewerOrStatus The reviewer review status or
 * reviewer object.
 * @returns boolean
 */
export const isReviewDone = (reviewerOrStatus) => {
  return (reviewerOrStatus?.review_status || reviewerOrStatus) === REVIEW_DONE;
};

export const JOURNAL_NO_PUBLICATION = 'NO_PUBLICATION';
export const JOURNAL_PUB_INTENDED = 'PUBLICATION_INTENDED';
export const JOURNAL_SUBMITTED = 'PUBLICATION_REQUESTED';
export const JOURNAL_PUBLISHED = 'PUBLISHED';

/**
 * Checks that the given document or status is intended for journal publication
 * @param {object|string} versionOrStatus The doc version or the status string
 * @returns boolean
 */
export const isJournalPublicationIntended = (versionOrStatus) => {
  const status = versionOrStatus?.journal_status || versionOrStatus;
  return !!status && status !== JOURNAL_NO_PUBLICATION;
};
