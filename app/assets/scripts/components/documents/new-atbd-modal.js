import styled from 'styled-components';
import React from 'react';
import T from 'prop-types';
import kebabcase from 'lodash.kebabcase';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { FormInput, FormLabel, FormGroup } from '@devseed-ui/form';
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
  'If your ATBD was created externally, you can add it as a PDF into APT. <br /><br /><strong> Caution</strong>: Importing ATBDs as PDFs restricts editing and searching capabilities. <br /><br />For more information, please see the difference between the two workflows <a href="/new-atbd" target="_blank" rel="no_opener"> here</a>, or watch <a href="https://drive.google.com/file/d/16MuIDDlXtnDFBpfY6pJbHjjJS3KrzBnQ/view?usp=drive_link" target="_blank" rel="no_opener"> this video</a>.';

const MAX_ALIAS_CHARS = 32;
const toAliasFormat = (v) => kebabcase(v).slice(0, MAX_ALIAS_CHARS);

function NewATBDModal(props) {
  const { onCancel } = props;
  const [title, setTitle] = React.useState('Untitled document');
  const [alias, setAlias] = React.useState(() => toAliasFormat(title));

  const handleNewAtbdClick = useDocumentCreate(title, alias, false);
  const handleNewPdfAtbdClick = useDocumentCreate(title, alias, true);

  const handleTitleInputChange = React.useCallback((e) => {
    setTitle(e.target.value);
    setAlias(toAliasFormat(e.target.value));
  }, []);

  const handleAliasInputChange = React.useCallback((e) => {
    setAlias(toAliasFormat(e.target.value));
  }, []);

  return (
    <Modal
      id='new-atbd-modal'
      revealed={true}
      onCloseClick={onCancel}
      title='Create new ATBD'
      footerContent={
        <>
          <Button variation='primary-raised-dark' onClick={handleNewAtbdClick}>
            Create new ATBD in APT
          </Button>
          <Button
            variation='primary-raised-light'
            onClick={handleNewPdfAtbdClick}
          >
            Upload existing ATBD PDF <FormInfoTip title={TooltipContent} />
          </Button>
        </>
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
        </ModalContent>
      }
    />
  );
}

NewATBDModal.propTypes = {
  onCancel: T.func
};

export default NewATBDModal;
