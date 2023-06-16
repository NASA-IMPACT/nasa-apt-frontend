import React from 'react';
import ButtonSecondary from '../../styles/button-secondary';
import { Can } from '../../a11n';
import { useBooleanState } from '../../utils/common';

import NewATBDModal from './new-atbd-modal';

function CreateDocumentButton() {
  const [showNewATBDModal, setShowNewATBDModalTrue, setShowNewATBDModalFalse] =
    useBooleanState(false);

  return (
    <Can do='create' on='documents'>
      <ButtonSecondary
        variation='primary-raised-dark'
        title='Create new document'
        useIcon='plus--small'
        onClick={setShowNewATBDModalTrue}
      >
        Create document
      </ButtonSecondary>
      {showNewATBDModal && <NewATBDModal onCancel={setShowNewATBDModalFalse} />}
    </Can>
  );
}

export default CreateDocumentButton;
