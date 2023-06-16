import React from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';
import FormInfoTip from '../../../common/forms/form-info-tooltip';

import { FauxFileDialog } from '../../../common/faux-file-dialog';

const TooltipContent =
  "For more information about BibTeX, and to learn how to import a BibTeX file into APT, please watch <a target='_blank' rel='noreferrer' href='https://drive.google.com/file/d/11SX-BQLdqoZqGPKRim9vKny182sAfoEx/view'>this video</a>.";

export default function ReferencesCreationActions(props) {
  const { onAddClick, onFileSelect } = props;

  return (
    <React.Fragment>
      <Button useIcon='plus--small' onClick={onAddClick}>
        Add new
      </Button>
      <FauxFileDialog name='bibtex-file' onFileSelect={onFileSelect}>
        {(fieProps) => (
          <>
            <Button useIcon='upload-2' {...fieProps}>
              Import from BibTeX file
            </Button>
            <FormInfoTip title={TooltipContent} />
          </>
        )}
      </FauxFileDialog>
    </React.Fragment>
  );
}

ReferencesCreationActions.propTypes = {
  onAddClick: T.func,
  onFileSelect: T.func
};
