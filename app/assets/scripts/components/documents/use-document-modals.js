import React, { useCallback, useEffect } from 'react';
import T from 'prop-types';
import { useHistory, useLocation } from 'react-router';

import DocumentInfoModal from './document-info-modal';
import {
  MinorVersionModal,
  PublishingModal
} from './document-publishing-modals';
import DocumentCollaboratorModal from './document-collaborator-modal';

import useSafeState from '../../utils/use-safe-state';
import { documentDraftMajorConfirmAndToast } from './document-draft-major-process';
import {
  useSubmitForCollaborators,
  useSubmitForDocumentInfo,
  useSubmitForMinorVersion,
  useSubmitForPublishingVersion
} from './single-edit/use-submit';

export function DocumentModals(props) {
  const {
    atbd,
    isViewingDocumentInfo,
    onDocumentInfoSubmit,
    setViewingDocumentInfo,
    isUpdatingMinorVersion,
    onMinorVersionSubmit,
    setUpdatingMinorVersion,
    isPublishingDocument,
    onPublishVersionSubmit,
    setPublishingDocument,
    isManagingCollaborators,
    onCollaboratorsSubmit,
    setManagingCollaborators
  } = props;

  return (
    <React.Fragment>
      <DocumentInfoModal
        revealed={isViewingDocumentInfo}
        atbd={atbd}
        onSubmit={onDocumentInfoSubmit}
        onClose={() => setViewingDocumentInfo(false)}
      />
      <MinorVersionModal
        revealed={isUpdatingMinorVersion}
        atbd={atbd}
        onSubmit={onMinorVersionSubmit}
        onClose={() => setUpdatingMinorVersion(false)}
      />
      <PublishingModal
        revealed={isPublishingDocument}
        atbd={atbd}
        onSubmit={onPublishVersionSubmit}
        onClose={() => setPublishingDocument(false)}
      />
      <DocumentCollaboratorModal
        revealed={isManagingCollaborators}
        atbd={atbd}
        onSubmit={onCollaboratorsSubmit}
        onClose={() => setManagingCollaborators(false)}
      />
    </React.Fragment>
  );
}

DocumentModals.propTypes = {
  atbd: T.object,
  isViewingDocumentInfo: T.bool,
  onDocumentInfoSubmit: T.func,
  setViewingDocumentInfo: T.func,
  isUpdatingMinorVersion: T.bool,
  onMinorVersionSubmit: T.func,
  setUpdatingMinorVersion: T.func,
  isPublishingDocument: T.bool,
  onPublishVersionSubmit: T.func,
  setPublishingDocument: T.func,
  isManagingCollaborators: T.bool,
  onCollaboratorsSubmit: T.func,
  setManagingCollaborators: T.func
};

export const useDocumentModals = ({
  atbd,
  createAtbdVersion,
  updateAtbd,
  publishAtbdVersion
}) => {
  const history = useHistory();
  const location = useLocation();

  const [isUpdatingMinorVersion, setUpdatingMinorVersion] = useSafeState(!1);
  const [isPublishingDocument, setPublishingDocument] = useSafeState(!1);
  const [isViewingDocumentInfo, setViewingDocumentInfo] = useSafeState(!1);
  const [isManagingCollaborators, setManagingCollaborators] = useSafeState(!1);

  const menuHandler = useCallback(
    async (menuId) => {
      switch (menuId) {
        case 'update-minor':
          setUpdatingMinorVersion(true);
          break;
        case 'draft-major':
          await documentDraftMajorConfirmAndToast({
            atbd,
            createAtbdVersion,
            history
          });
          break;
        case 'publish':
          setPublishingDocument(true);
          break;
        case 'view-info':
          setViewingDocumentInfo(true);
          break;
        case 'manage-collaborators':
          setManagingCollaborators(true);
          break;
      }
    },
    [
      atbd,
      createAtbdVersion,
      history,
      setUpdatingMinorVersion,
      setPublishingDocument,
      setViewingDocumentInfo,
      setManagingCollaborators
    ]
  );

  const onMinorVersionSubmit = useSubmitForMinorVersion(
    updateAtbd,
    setUpdatingMinorVersion,
    history
  );

  const onPublishVersionSubmit = useSubmitForPublishingVersion(
    atbd?.version,
    publishAtbdVersion,
    setPublishingDocument
  );

  const onDocumentInfoSubmit = useSubmitForDocumentInfo(updateAtbd);

  const onCollaboratorsSubmit = useSubmitForCollaborators(updateAtbd);

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
      isViewingDocumentInfo,
      onDocumentInfoSubmit,
      setViewingDocumentInfo,
      isUpdatingMinorVersion,
      onMinorVersionSubmit,
      setUpdatingMinorVersion,
      isPublishingDocument,
      onPublishVersionSubmit,
      setPublishingDocument,
      isManagingCollaborators,
      onCollaboratorsSubmit,
      setManagingCollaborators
    }
  };
};
