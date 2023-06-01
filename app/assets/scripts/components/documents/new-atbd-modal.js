import styled from 'styled-components';
import React from 'react';
import T from 'prop-types';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { FormInput, FormLabel, FormGroup, FormSwitch } from '@devseed-ui/form';
import { glsp } from '@devseed-ui/theme-provider';

import { useDocumentCreate } from '../documents/single-edit/use-document-create';

const StyledFormInput = styled(FormInput)`
  width: 100%;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${glsp(2)};
`;

function NewATBDModal(props) {
  const { onCancel } = props;
  const [title, setTitle] = React.useState('Untitled document');
  const [isPdfType, setIsPdfType] = React.useState(false);
  const handleNewATBDClick = useDocumentCreate(title, isPdfType);

  const handleTitleInputChange = React.useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const handleIsPdfTypeChange = React.useCallback((e) => {
    setIsPdfType(e.target.checked);
  }, []);

  return (
    <Modal
      id='new-atbd-modal'
      revealed={true}
      onCloseClick={onCancel}
      title='Create new ATBD'
      footerContent={
        <Button variation='primary-raised-dark' onClick={handleNewATBDClick}>
          Create new ATBD
        </Button>
      }
      content={
        <ModalContent>
          <FormGroup>
            <FormLabel htmlFor='atbd-title'>Enter ATBD Title</FormLabel>
            <StyledFormInput
              id='atbd-title'
              type='text'
              placeholder='Untitled document'
              value={title}
              onChange={handleTitleInputChange}
              autoFocus
            />
          </FormGroup>
          <FormSwitch
            checked={isPdfType}
            onChange={handleIsPdfTypeChange}
            autoFocus
          >
            PDF Type
          </FormSwitch>
        </ModalContent>
      }
    />
  );
}

NewATBDModal.propTypes = {
  onCancel: T.func
};

export default NewATBDModal;
