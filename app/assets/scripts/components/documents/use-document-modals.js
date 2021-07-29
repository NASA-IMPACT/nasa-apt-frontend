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
  ReqDenyModal
} from './document-governance-modals';

import useSafeState from '../../utils/use-safe-state';
import { documentDraftMajorConfirmAndToast } from './document-draft-major-process';
import {
  useSubmitForCollaborators,
  useSubmitForDocumentInfo,
  useSubmitForGovernance,
  useSubmitForMinorVersion,
  useSubmitForPublishingVersion
} from './single-edit/use-submit';
import { createProcessToast } from '../common/toasts';
import { REVIEW_DONE } from './status';
import {
  ConfirmationModalProse,
  createBinaryControlsRenderer,
  showConfirmationPrompt
} from '../common/confirmation-prompt';

const MODAL_DOCUMENT_INFO = 'modal-document-info';
const MODAL_MINOR_VERSION = 'modal-minor-version';
const MODAL_PUBLISHING = 'modal-publishing';
const MODAL_DOCUMENT_COLLABORATOR = 'modal-document-collaborator';
const MODAL_DOCUMENT_LEAD_AUTHOR = 'modal-document-lead-author';
const MODAL_REQ_REVIEW_DENY = 'modal-req-review-deny';
const MODAL_REQ_REVIEW_ALLOW = 'modal-req-review-allow';
const MODAL_REQ_PUBLICATION_DENY = 'modal-req-publication-deny';

/**
 * Waits for a promise showing a message in case of error or success.
 *
 * @param {Promise} opt.promise The promise to wait for.
 * @param {Promise} opt.start The message to show when the process starts
 * @param {Promise} opt.success The message in case the promise succeeds
 * @param {Promise} opt.error The message in case of error. The error message
 * itself is shown after this message
 */
export const eventProcessToasts = async ({
  promise,
  start,
  success,
  error
}) => {
  const processToast = createProcessToast(start);
  const result = await promise;
  if (result.error) {
    processToast.error(
      `${error || 'An error occurred'}: ${result.error.message}`
    );
  } else {
    processToast.success(success);
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
    onCollaboratorsSubmit,
    onReviewReqDenySubmit,
    onReviewReqApproveSubmit,
    onPublicationReqDenySubmit
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
      <ReqDenyModal
        revealed={activeModal === MODAL_REQ_REVIEW_DENY}
        title='Deny review request'
        content={
          <p>
            You are about to deny the request to start the review process for
            version <strong>{atbd.version}</strong> of document{' '}
            <strong>{atbd.title}</strong>
          </p>
        }
        onSubmit={onReviewReqDenySubmit}
        onClose={hideModal}
      />
      <ReqReviewApproveModal
        revealed={activeModal === MODAL_REQ_REVIEW_ALLOW}
        atbd={atbd}
        onSubmit={onReviewReqApproveSubmit}
        onClose={hideModal}
      />
      <ReqDenyModal
        revealed={activeModal === MODAL_REQ_PUBLICATION_DENY}
        title='Deny publication request'
        content={
          <p>
            You are about to deny the publication request for version{' '}
            <strong>{atbd.version}</strong> of document{' '}
            <strong>{atbd.title}</strong>
          </p>
        }
        onSubmit={onPublicationReqDenySubmit}
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
  onCollaboratorsSubmit: T.func,
  onReviewReqDenySubmit: T.func,
  onReviewReqApproveSubmit: T.func,
  onPublicationReqDenySubmit: T.func
};

export const useDocumentModals = ({
  atbd,
  createAtbdVersion,
  updateAtbd,
  publishAtbdVersion,
  fevReqReview,
  fevCancelReviewReq,
  fevApproveReviewReq,
  fevDenyReviewReq,
  fevSetOwnReviewStatus,
  fevOpenReview,
  fevReqPublication,
  fevCancelPublicationReq,
  fevApprovePublicationReq,
  fevDenyPublicationReq
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
        case 'req-review':
          await handleRequestReview({
            fn: fevReqReview
          });
          break;
        case 'cancel-req-review':
          await handleCancelRequestReview({
            fn: fevCancelReviewReq
          });
          break;
        case 'req-review-allow':
          setActiveModal(MODAL_REQ_REVIEW_ALLOW);
          break;
        case 'req-review-deny':
          setActiveModal(MODAL_REQ_REVIEW_DENY);
          break;
        case 'set-own-review-done':
          await handleSetOwnReviewDone({
            atbd,
            fn: fevSetOwnReviewStatus,
            args: [
              {
                payload: { review_status: REVIEW_DONE }
              }
            ]
          });
          break;
        case 'open-review':
          await handleOpenReview({
            atbd,
            fn: fevOpenReview
          });
          break;
        case 'req-publication':
          await handleRequestPublication({
            fn: fevReqPublication
          });
          break;
        case 'cancel-req-publication':
          await handleCancelRequestPublication({
            fn: fevCancelPublicationReq
          });
          break;
        case 'req-publication-allow':
          await handleRequestPublicationAllow({
            atbd,
            fn: fevApprovePublicationReq
          });
          break;
        case 'req-publication-deny':
          setActiveModal(MODAL_REQ_PUBLICATION_DENY);
          break;
      }
    },
    [
      atbd,
      createAtbdVersion,
      history,
      setActiveModal,
      fevReqReview,
      fevCancelReviewReq,
      fevSetOwnReviewStatus,
      fevOpenReview,
      fevReqPublication,
      fevApprovePublicationReq,
      fevCancelPublicationReq
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

  const onReviewReqDenySubmit = useSubmitForGovernance(
    fevDenyReviewReq,
    hideModal,
    {
      start: 'Denying request for review',
      success: 'Review request denied successfully',
      error: 'Error denying review request'
    }
  );

  const onReviewReqApproveSubmit = useSubmitForGovernance(
    fevApproveReviewReq,
    hideModal,
    {
      start: 'Approving request for review',
      success: 'Review request approved successfully',
      error: 'Error approving review request'
    }
  );

  const onPublicationReqDenySubmit = useSubmitForGovernance(
    fevDenyPublicationReq,
    hideModal,
    {
      start: 'Denying request for publication',
      success: 'Review publication denied successfully',
      error: 'Error denying publication request'
    }
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
      onCollaboratorsSubmit,
      onReviewReqDenySubmit,
      onReviewReqApproveSubmit,
      onPublicationReqDenySubmit
    }
  };
};

export async function handleRequestReview({ fn, args = [] }) {
  return eventProcessToasts({
    promise: fn(...args),
    start: 'Requesting review',
    success: 'Review requested successfully',
    error: 'Error while requesting review'
  });
}

export async function handleCancelRequestReview({ fn, args = [] }) {
  return eventProcessToasts({
    promise: fn(...args),
    start: 'Cancelling requested review',
    success: 'Review request cancelled successfully',
    error: 'Error while cancelling requested review'
  });
}

export async function handleSetOwnReviewDone({ atbd, fn, args = [] }) {
  const { result } = await showConfirmationPrompt({
    title: 'Are you sure?',
    content: (
      <p>
        You&apos;re about to conclude your review for version{' '}
        <strong>{atbd.version}</strong> of document{' '}
        <strong>{atbd.title}</strong>.
      </p>
    ),
    /* eslint-disable-next-line react/display-name, react/prop-types */
    renderControls: createBinaryControlsRenderer({
      confirmVariation: 'primary-raised-dark',
      confirmIcon: 'tick--small',
      confirmTitle: 'Conclude review',
      cancelVariation: 'base-raised-light',
      cancelIcon: 'xmark--small'
    })
  });

  if (result) {
    return eventProcessToasts({
      promise: fn(...args),
      start: 'Concluding review',
      success: 'Review concluded successfully',
      error: 'Error while concluding review'
    });
  }
}

export async function handleOpenReview({ atbd, fn, args = [] }) {
  const revTotal = atbd.reviewers.length;
  const revCompleted = atbd.reviewers.filter(
    (r) => r.review_status === REVIEW_DONE
  ).length;

  const { result } = await showConfirmationPrompt({
    title: 'Are you sure?',
    content: (
      <ConfirmationModalProse>
        {!!revTotal &&
          (revCompleted === 0 ? (
            <p>No reviewer has concluded their review yet.</p>
          ) : revTotal === revCompleted ? (
            <p>All reviewers have concluded their review.</p>
          ) : (
            <p>
              Only {revCompleted} out of {revTotal} reviewers have concluded
              their review.
            </p>
          ))}
        <p>
          You&apos;re about to transition the version{' '}
          <strong>{atbd.version}</strong> of document{' '}
          <strong>{atbd.title}</strong> to the open review stage.
        </p>
        <p>The authors will be able to edit the document again.</p>
      </ConfirmationModalProse>
    ),
    /* eslint-disable-next-line react/display-name, react/prop-types */
    renderControls: createBinaryControlsRenderer({
      confirmVariation: 'primary-raised-dark',
      confirmIcon: 'tick--small',
      confirmTitle: 'Transition document to open review',
      cancelVariation: 'base-raised-light',
      cancelIcon: 'xmark--small'
    })
  });

  if (result) {
    return eventProcessToasts({
      promise: fn(...args),
      start: 'Transitioning document to open review',
      success: 'Review opened successfully',
      error: 'Error while opening review'
    });
  }
}

export async function handleRequestPublication({ fn, args = [] }) {
  return eventProcessToasts({
    promise: fn(...args),
    start: 'Requesting publication',
    success: 'Publication requested successfully',
    error: 'Error while requesting publication'
  });
}

export async function handleCancelRequestPublication({ fn, args = [] }) {
  return eventProcessToasts({
    promise: fn(...args),
    start: 'Cancelling requested publication',
    success: 'Publication request cancelled successfully',
    error: 'Error while cancelling requested publication'
  });
}

export async function handleRequestPublicationAllow({ atbd, fn, args = [] }) {
  const { result } = await showConfirmationPrompt({
    title: 'Are you sure?',
    content: (
      <ConfirmationModalProse>
        <p>
          You&apos;re about to transition the version{' '}
          <strong>{atbd.version}</strong> of document{' '}
          <strong>{atbd.title}</strong> to the publication stage.
        </p>
      </ConfirmationModalProse>
    ),
    /* eslint-disable-next-line react/display-name, react/prop-types */
    renderControls: createBinaryControlsRenderer({
      confirmVariation: 'primary-raised-dark',
      confirmIcon: 'tick--small',
      confirmTitle: 'Transition document to publication',
      cancelVariation: 'base-raised-light',
      cancelIcon: 'xmark--small'
    })
  });

  if (result) {
    return eventProcessToasts({
      promise: fn(...args),
      start: 'Transitioning document to publication',
      success: 'Document is now in publication',
      error: 'Error while moving to publication'
    });
  }
}
