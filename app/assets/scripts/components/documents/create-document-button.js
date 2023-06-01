import React, { useEffect } from 'react';
import { Button } from '@devseed-ui/button';
import ButtonSecondary from '../../styles/button-secondary';
import { Can } from '../../a11n';

import NewATBDModal from './new-atbd-modal';

function CreateDocumentButton() {
  const [showNewATBDModal, setShowNewATBDModal] = React.useState(false);
  const onCreateClick = React.useCallback(() => {
    setShowNewATBDModal(true);
  }, []);
  const handleNewATBDCancel = React.useCallback(() => {
    setShowNewATBDModal(false);
  }, []);

  return (
    <Can do='create' on='documents'>
      <ButtonSecondary
        variation='primary-raised-dark'
        title='Create new document'
        useIcon='plus--small'
        onClick={onCreateClick}
      >
        Create document
      </ButtonSecondary>
      {showNewATBDModal && <NewATBDModal onCancel={handleNewATBDCancel} />}
    </Can>
  );
}

export default CreateDocumentButton;
