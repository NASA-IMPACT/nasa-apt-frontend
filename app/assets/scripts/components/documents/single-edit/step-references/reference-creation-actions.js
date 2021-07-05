import React from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';

import { FauxFileDialog } from '../../../common/faux-file-dialog';

export default function ReferencesCreationActions(props) {
  const { onAddClick, onFileSelect } = props;

  return (
    <React.Fragment>
      <Button useIcon='plus--small' onClick={onAddClick}>
        Add new
      </Button>
      <FauxFileDialog name='bibtex-file' onFileSelect={onFileSelect}>
        {(fieProps) => (
          <Button useIcon='upload-2' {...fieProps}>
            Import from BibTeX file
          </Button>
        )}
      </FauxFileDialog>
    </React.Fragment>
  );
}

ReferencesCreationActions.propTypes = {
  onAddClick: T.func,
  onFileSelect: T.func
};
