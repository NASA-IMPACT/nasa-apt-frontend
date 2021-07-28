import React, { useCallback, useEffect } from 'react';
import T from 'prop-types';
import { useHistory, useLocation } from 'react-router';

import DocumentInfoModal from './document-info-modal';
import {
  MinorVersionModal,
  PublishingModal
} from './document-publishing-modals';
import {
  DocumentCollaboratorModal,
  DocumentLeadAuthorModal
} from './document-collaborator-modal';
import {
  ReqReviewApproveModal,
  ReqReviewDenyModal
} from './document-governance-modals';

import useSafeState from '../../utils/use-safe-state';
import { documentDraftMajorConfirmAndToast } from './document-draft-major-process';
import {
  useSubmitForCollaborators,
  useSubmitForDocumentInfo,
  useSubmitForMinorVersion,
  useSubmitForPublishingVersion
} from './single-edit/use-submit';
import toasts from '../common/toasts';

const MODAL_DOCUMENT_INFO = 'modal-document-info';
const MODAL_MINOR_VERSION = 'modal-minor-version';
const MODAL_PUBLISHING = 'modal-publishing';
const MODAL_DOCUMENT_COLLABORATOR = 'modal-document-collaborator';
const MODAL_DOCUMENT_LEAD_AUTHOR = 'modal-document-lead-author';
const MODAL_REQ_REVIEW_DENY = 'modal-req-review-deny';
const MODAL_REQ_REVIEW_ALLOW = 'modal-req-review-allow';

/**
 * Waits for a promise showing a message in case of error or success.
 *
 * @param {Promise} opt.promise The promise to wait for.
 * @param {Promise} opt.success The message in case the promise succeeds
 * @param {Promise} opt.error The message in case of error. The error message
 * itself is shown after this message
 */
export const eventProcessToasts = async ({ promise, success, error }) => {
  const result = await promise;
  if (result.error) {
    toasts.error(`${error}: ${result.error.message}`);
  } else {
    toasts.success(success);
  }
};

export function DocumentModals(props) {
  const {
    atbd,
    activeModal,
    hideModal,
    onDocumentInfoSubmit,
    onMinorVersionSubmit,
    onPublishVersionSubmit,
    onCollaboratorsSubmit
  } = props;

  return (
    <React.Fragment>
      <DocumentInfoModal
        revealed={activeModal === MODAL_DOCUMENT_INFO}
        atbd={atbd}
        onSubmit={onDocumentInfoSubmit}
        onClose={hideModal}
      />
      <MinorVersionModal
        revealed={activeModal === MODAL_MINOR_VERSION}
        atbd={atbd}
        onSubmit={onMinorVersionSubmit}
        onClose={hideModal}
      />
      <PublishingModal
        revealed={activeModal === MODAL_PUBLISHING}
        atbd={atbd}
        onSubmit={onPublishVersionSubmit}
        onClose={hideModal}
      />
      <DocumentCollaboratorModal
        revealed={activeModal === MODAL_DOCUMENT_COLLABORATOR}
        atbd={atbd}
        onSubmit={onCollaboratorsSubmit}
        onClose={hideModal}
      />
      <DocumentLeadAuthorModal
        revealed={activeModal === MODAL_DOCUMENT_LEAD_AUTHOR}
        atbd={atbd}
        onSubmit={onCollaboratorsSubmit}
        onClose={hideModal}
      />

      {/* Governance modals */}
      <ReqReviewDenyModal
        revealed={activeModal === MODAL_REQ_REVIEW_DENY}
        atbd={atbd}
        // onSubmit={}
        onClose={hideModal}
      />
      <ReqReviewApproveModal
        revealed={activeModal === MODAL_REQ_REVIEW_ALLOW}
        atbd={atbd}
        // onSubmit={}
        onClose={hideModal}
      />
    </React.Fragment>
  );
}

DocumentModals.propTypes = {
  atbd: T.object,
  activeModal: T.string,
  hideModal: T.func,
  onDocumentInfoSubmit: T.func,
  onMinorVersionSubmit: T.func,
  onPublishVersionSubmit: T.func,
  onCollaboratorsSubmit: T.func
};

export const useDocumentModals = ({
  atbd,
  createAtbdVersion,
  updateAtbd,
  publishAtbdVersion,
  fevReqReview,
  fevCancelReviewReq
}) => {
  const history = useHistory();
  const location = useLocation();

  const [activeModal, setActiveModal] = useSafeState(null);

  const menuHandler = useCallback(
    async (menuId) => {
      switch (menuId) {
        case 'update-minor':
          setActiveModal(MODAL_MINOR_VERSION);
          break;
        case 'draft-major':
          await documentDraftMajorConfirmAndToast({
            atbd,
            createAtbdVersion,
            history
          });
          break;
        case 'publish':
          setActiveModal(MODAL_PUBLISHING);
          break;
        case 'view-info':
          setActiveModal(MODAL_DOCUMENT_INFO);
          break;
        case 'manage-collaborators':
          setActiveModal(MODAL_DOCUMENT_COLLABORATOR);
          break;
        case 'change-leading':
          setActiveModal(MODAL_DOCUMENT_LEAD_AUTHOR);
          break;
        // eventProcessToasts messages must also be updated in
        // app/assets/scripts/components/dashboard/use-document-menu-action.js
        case 'req-review':
          await eventProcessToasts({
            promise: fevReqReview({ id: atbd.id, version: atbd.version }),
            success: 'Review requested successfully',
            error: 'Error while requesting review'
          });
          break;
        // eventProcessToasts messages must also be updated in
        // app/assets/scripts/components/dashboard/use-document-menu-action.js
        case 'cancel-req-review':
          await eventProcessToasts({
            promise: fevCancelReviewReq({ id: atbd.id, version: atbd.version }),
            success: 'Review request cancelled successfully',
            error: 'Error while cancelling requested review'
          });
          break;
        case 'req-review-allow':
          setActiveModal(MODAL_REQ_REVIEW_ALLOW);
          break;
        case 'req-review-deny':
          setActiveModal(MODAL_REQ_REVIEW_DENY);
          break;
      }
    },
    [
      atbd,
      createAtbdVersion,
      history,
      setActiveModal,
      fevReqReview,
      fevCancelReviewReq
    ]
  );

  const hideModal = useCallback(() => setActiveModal(null), [setActiveModal]);

  const onMinorVersionSubmit = useSubmitForMinorVersion(
    updateAtbd,
    hideModal,
    history
  );

  const onPublishVersionSubmit = useSubmitForPublishingVersion(
    atbd?.version,
    publishAtbdVersion,
    hideModal
  );

  const onDocumentInfoSubmit = useSubmitForDocumentInfo(updateAtbd);

  const onCollaboratorsSubmit = useSubmitForCollaborators(
    updateAtbd,
    hideModal
  );

  // To trigger the modals to open from other pages, we use the history state as
  // the user is sent from one page to another. This is happening with the
  // dashboards for example. When the user selects one of the options from
  // the dropdown menu, the user is sent to the atbd view page with {
  // menuAction: <menu-id> } in the history state.
  // We then capture this, show the appropriate modal and clear the history
  // state to prevent the modal from popping up on route change.
  useEffect(() => {
    const { menuAction, ...rest } = location.state || {};
    if (menuAction) {
      menuHandler(menuAction);
      // Using undefined keeps the same path.
      history.replace(undefined, rest);
    }
  }, [menuHandler, history, location]);

  return {
    menuHandler,
    documentModalProps: {
      atbd,
      activeModal,
      hideModal,
      onDocumentInfoSubmit,
      onMinorVersionSubmit,
      onPublishVersionSubmit,
      onCollaboratorsSubmit
    }
  };
};
