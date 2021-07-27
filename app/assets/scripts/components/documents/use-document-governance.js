import { useCallback } from 'react';
import { useSingleAtbd } from '../../context/atbds-list';

/**
 * Creates a callback to be used with the DocumentGovernanceAction component. If
 * an id and version are provided the actions will be fired taking those
 * arguments into account. If not, the values from the atbd passed to callback
 * are used.
 *
 * @param {number} opt.id The document id
 * @param {string} opt.version The document version
 *
 * @returns callback hook
 */
export function useDocumentGovernance({ id, version } = {}) {
  const {
    fevReqReview,
    fevCancelReviewReq,
    fevApproveReviewReq,
    fevDenyReviewReq
  } = useSingleAtbd({ id, version });

  return useCallback(
    async (menuId, { atbd }) => {
      const base =
        id && version
          ? { id, version }
          : { id: atbd.alias || atbd.id, version: atbd.version };

      switch (menuId) {
        case 'req-review':
          return fevReqReview(base);
        case 'cancel-req-review':
          return fevCancelReviewReq(base);
        case 'req-review-allow':
          return fevApproveReviewReq(base);
        case 'req-review-deny':
          return fevDenyReviewReq(base);
      }
    },
    [
      id,
      version,
      fevReqReview,
      fevCancelReviewReq,
      fevApproveReviewReq,
      fevDenyReviewReq
    ]
  );
}
