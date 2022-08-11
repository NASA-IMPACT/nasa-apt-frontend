import { useCallback } from 'react';
import { useHistory } from 'react-router';

import { documentView } from '../../utils/url-creator';
import { documentDeleteVersionConfirmAndToast } from '../documents/document-delete-process';
import { useSingleAtbd, useSingleAtbdEvents } from '../../context/atbds-list';
import {
  handleCancelRequestPublication,
  handleCancelRequestReview,
  handleOpenReview,
  handleRequestPublication,
  handleRequestReview,
  handleSetOwnReviewDone
} from '../documents/use-document-modals';
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
    fevSetOwnReviewStatus,
    fevOpenReview,
    fevReqPublication,
    fevCancelPublicationReq
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
        case 'req-review':
          await handleRequestReview({
            fn: fevReqReview,
            args: [atbdIdKey]
          });
          break;
        case 'cancel-req-review':
          await handleCancelRequestReview({
            fn: fevCancelReviewReq,
            args: [atbdIdKey]
          });
          break;
        case 'set-own-review-done':
          await handleSetOwnReviewDone({
            atbd,
            fn: fevSetOwnReviewStatus,
            args: [
              {
                ...atbdIdKey,
                payload: { review_status: REVIEW_DONE }
              }
            ]
          });
          break;
        case 'open-review':
          await handleOpenReview({
            atbd,
            fn: fevOpenReview,
            args: [atbdIdKey]
          });
          break;
        case 'req-publication':
          await handleRequestPublication({
            fn: fevReqPublication,
            args: [atbdIdKey]
          });
          break;
        case 'cancel-req-publication':
          await handleCancelRequestPublication({
            fn: fevCancelPublicationReq,
            args: [atbdIdKey]
          });
          break;
        case 'update-minor':
        case 'draft-major':
        case 'publish':
        case 'view-info':
        case 'view-changelog':
        case 'view-tracker':
        case 'manage-collaborators':
        case 'change-leading':
        case 'req-review-allow':
        case 'req-review-deny':
        case 'req-publication-allow':
        case 'req-publication-deny':
        case 'toggle-comments':
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
      fevSetOwnReviewStatus,
      fevOpenReview,
      fevReqPublication,
      fevCancelPublicationReq
    ]
  );
}
