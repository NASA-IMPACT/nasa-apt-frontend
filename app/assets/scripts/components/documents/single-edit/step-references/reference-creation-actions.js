import React from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';

export default function ReferencesCreationActions(props) {
  const { onAddClick, onUploadClick } = props;

  return (
    <React.Fragment>
      <Button useIcon='plus--small' onClick={onAddClick}>
        Add new
      </Button>
      <Button useIcon='upload-2' onClick={onUploadClick}>
        Import from BibTeX file
      </Button>
    </React.Fragment>
  );
}

ReferencesCreationActions.propTypes = {
  onAddClick: T.func,
  onUploadClick: T.func
};
