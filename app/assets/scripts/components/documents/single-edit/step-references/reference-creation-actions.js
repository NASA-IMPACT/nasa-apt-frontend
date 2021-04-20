import React, { useCallback, useRef } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { visuallyHidden } from '@devseed-ui/theme-provider';

const FileInput = styled.input`
  ${visuallyHidden()}
`;

export default function ReferencesCreationActions(props) {
  const { onAddClick, onFileSelect } = props;

  return (
    <React.Fragment>
      <Button useIcon='plus--small' onClick={onAddClick}>
        Add new
      </Button>
      <FileInputElement name='bibtex-file' onFileSelect={onFileSelect}>
        {(fieProps) => (
          <Button useIcon='upload-2' {...fieProps}>
            Import from BibTeX file
          </Button>
        )}
      </FileInputElement>
    </React.Fragment>
  );
}

ReferencesCreationActions.propTypes = {
  onAddClick: T.func,
  onFileSelect: T.func
};

/**
 * Creates a file input triggered by the element returned by the children
 *
 * @prop {string} id Id for the file input
 * @prop {string} name Name for the file input
 * @prop {func} onFileSelect Callback for when the file is selected. Called with the selected file.
 * @prop {func} children Render function for the trigger element
 */
export function FileInputElement(props) {
  const { name, id, onFileSelect, children } = props;

  const fileInputRef = useRef(null);

  const onUploadClick = useCallback(() => fileInputRef.current.click(), []);
  const onChangeFile = useCallback(
    (e) => {
      const file = e.target.files[0];
      e.target.value = '';
      onFileSelect(file);
    },
    [onFileSelect]
  );

  if (typeof children !== 'function') {
    throw new Error('<FileInputElement /> expects a single function child');
  }

  return (
    <React.Fragment>
      {children({ onClick: onUploadClick })}
      <FileInput
        type='file'
        id={id}
        name={name}
        ref={fileInputRef}
        onChange={onChangeFile}
      />
    </React.Fragment>
  );
}

FileInputElement.propTypes = {
  name: T.string,
  id: T.string,
  onFileSelect: T.func,
  children: T.func
};
