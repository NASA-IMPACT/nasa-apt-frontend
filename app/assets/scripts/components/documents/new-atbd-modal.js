import styled from 'styled-components';
import React from 'react';
import T from 'prop-types';
import kebabcase from 'lodash.kebabcase';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { FormInput, FormLabel, FormGroup, FormSwitch } from '@devseed-ui/form';
import { glsp } from '@devseed-ui/theme-provider';

import FormInfoTip from '../common/forms/form-info-tooltip';
import { useDocumentCreate } from '../documents/single-edit/use-document-create';

const StyledFormInput = styled(FormInput)`
  width: 100%;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${glsp(2)};
`;

const TooltipContent =
  'If your ATBD was created externally, you can add it as a PDF into APT. <br /><br /><strong> Caution</strong>: Importing ATBDs as PDFs restricts editing and searching capabilities. <br /><br />For more information, please click <a href="/new-atbd" target="_blank" rel="no_opener"> here</a>.';

const MAX_ALIAS_CHARS = 32;
const toAliasFormat = (v) => kebabcase(v).slice(0, MAX_ALIAS_CHARS);

function NewATBDModal(props) {
  const { onCancel } = props;
  const [title, setTitle] = React.useState('Untitled document');
  const [alias, setAlias] = React.useState(() => toAliasFormat(title));
  const [isPdfType, setIsPdfType] = React.useState(false);
  const handleNewATBDClick = useDocumentCreate(title, alias, isPdfType);

  const handleTitleInputChange = React.useCallback((e) => {
    setTitle(e.target.value);
    setAlias(toAliasFormat(e.target.value));
  }, []);

  const handleAliasInputChange = React.useCallback((e) => {
    setAlias(toAliasFormat(e.target.value));
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
            <FormLabel htmlFor='atbd-title'>ATBD Title</FormLabel>
            <StyledFormInput
              id='atbd-title'
              type='text'
              placeholder='Untitled document'
              value={title}
              onChange={handleTitleInputChange}
              autoFocus
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor='atbd-alias'>Alias</FormLabel>
            <StyledFormInput
              id='atbd-alias'
              type='text'
              placeholder='Alias'
              value={alias}
              onChange={handleAliasInputChange}
            />
          </FormGroup>
          <FormSwitch
            checked={isPdfType}
            onChange={handleIsPdfTypeChange}
            autoFocus
          >
            Add an external ATBD
            <FormInfoTip title={TooltipContent} />
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
