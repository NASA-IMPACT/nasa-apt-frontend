import { useCallback } from 'react';
import { useHistory } from 'react-router';

import { documentView } from '../../utils/url-creator';
import { documentDeleteVersionConfirmAndToast } from '../documents/document-delete-process';
import { useSingleAtbd, useSingleAtbdEvents } from '../../context/atbds-list';
import { eventProcessToasts } from '../documents/use-document-modals';
import { REVIEW_DONE } from '../documents/status';
import getDocumentIdKey from '../documents/get-document-id-key';

/**
 * Creates a callback to be used with the DocumentActionMenu component in the
 * dashboard view. The actions triggered from the hub differ from the individual
 * pages. The action modals for example do not open on the hub. The user has to
 * be redirected to the document single page before opening the modals. This is
 * not the case if the action is triggered from the single view page, therefore
 * the callback for the individual pages is defined in the single-edit and
 * single-view pages.
 *
 * @returns callback hook
 */
export function useDocumentHubMenuAction() {
  const history = useHistory();
  const {
    fevReqReview,
    fevCancelReviewReq,
    fevSetOwnReviewStatus
  } = useSingleAtbdEvents({});
  const { deleteAtbdVersion } = useSingleAtbd({});

  return useCallback(
    async (menuId, { atbd }) => {
      const atbdIdKey = getDocumentIdKey(atbd);

      switch (menuId) {
        case 'delete':
          await documentDeleteVersionConfirmAndToast({
            atbd,
            deleteAtbdVersion: () => deleteAtbdVersion(atbdIdKey),
            history
          });
          break;
        // eventProcessToasts messages must also be updated in
        // app/assets/scripts/components/documents/use-document-modals.js
        case 'req-review':
          await eventProcessToasts({
            promise: fevReqReview(atbdIdKey),
            start: 'Requesting review',
            success: 'Review requested successfully',
            error: 'Error while requesting review'
          });
          break;
        // eventProcessToasts messages must also be updated in
        // app/assets/scripts/components/documents/use-document-modals.js
        case 'cancel-req-review':
          await eventProcessToasts({
            promise: fevCancelReviewReq(atbdIdKey),
            start: 'Cancelling requested review',
            success: 'Review request cancelled successfully',
            error: 'Error while cancelling requested review'
          });
          break;
        // eventProcessToasts messages must also be updated in
        // app/assets/scripts/components/documents/use-document-modals.js
        case 'set-own-review-done':
          await eventProcessToasts({
            promise: fevSetOwnReviewStatus({
              ...atbdIdKey,
              payload: { review_status: REVIEW_DONE }
            }),
            start: 'Concluding review',
            success: 'Review concluded successfully',
            error: 'Error while concluding review'
          });
          break;
        case 'update-minor':
        case 'draft-major':
        case 'publish':
        case 'view-info':
        case 'manage-collaborators':
        case 'change-leading':
        case 'req-review-allow':
        case 'req-review-deny':
          // To trigger the modals to open from other pages, we use the history
          // state as the user is sent from one page to another. See explanation
          // on
          // app/assets/scripts/components/documents/use-document-modals.js
          history.push(documentView(atbd), { menuAction: menuId });
          break;
      }
    },
    [
      deleteAtbdVersion,
      history,
      fevReqReview,
      fevCancelReviewReq,
      fevSetOwnReviewStatus
    ]
  );
}
