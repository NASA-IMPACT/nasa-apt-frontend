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

import useSafeState from '../../utils/use-safe-state';
import { documentDraftMajorConfirmAndToast } from './document-draft-major-process';
import {
  useSubmitForCollaborators,
  useSubmitForDocumentInfo,
  useSubmitForMinorVersion,
  useSubmitForPublishingVersion
} from './single-edit/use-submit';

const MODAL_DOCUMENT_INFO = 'modal-document-info';
const MODAL_MINOR_VERSION = 'modal-minor-version';
const MODAL_PUBLISHING = 'modal-publishing';
const MODAL_DOCUMENT_COLLABORATOR = 'modal-document-collaborator';
const MODAL_DOCUMENT_LEAD_AUTHOR = 'modal-document-lead-author';

export function DocumentModals(props) {
  const {
    atbd,
    activeModal,
    setActiveModal,
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
        onClose={() => setActiveModal(MODAL_DOCUMENT_INFO)}
      />
      <MinorVersionModal
        revealed={activeModal === MODAL_MINOR_VERSION}
        atbd={atbd}
        onSubmit={onMinorVersionSubmit}
        onClose={() => setActiveModal(MODAL_MINOR_VERSION)}
      />
      <PublishingModal
        revealed={activeModal === MODAL_PUBLISHING}
        atbd={atbd}
        onSubmit={onPublishVersionSubmit}
        onClose={() => setActiveModal(MODAL_PUBLISHING)}
      />
      <DocumentCollaboratorModal
        revealed={activeModal === MODAL_DOCUMENT_COLLABORATOR}
        atbd={atbd}
        onSubmit={onCollaboratorsSubmit}
        onClose={() => setActiveModal(MODAL_DOCUMENT_COLLABORATOR)}
      />
      <DocumentLeadAuthorModal
        revealed={activeModal === MODAL_DOCUMENT_LEAD_AUTHOR}
        atbd={atbd}
        onSubmit={onCollaboratorsSubmit}
        onClose={() => setActiveModal(MODAL_DOCUMENT_LEAD_AUTHOR)}
      />
    </React.Fragment>
  );
}

DocumentModals.propTypes = {
  atbd: T.object,
  activeModal: T.string,
  setActiveModal: T.func,
  onDocumentInfoSubmit: T.func,
  onMinorVersionSubmit: T.func,
  onPublishVersionSubmit: T.func,
  onCollaboratorsSubmit: T.func
};

export const useDocumentModals = ({
  atbd,
  createAtbdVersion,
  updateAtbd,
  publishAtbdVersion
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
      }
    },
    [atbd, createAtbdVersion, history, setActiveModal]
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
      setActiveModal,
      onDocumentInfoSubmit,
      onMinorVersionSubmit,
      onPublishVersionSubmit,
      onCollaboratorsSubmit
    }
  };
};
