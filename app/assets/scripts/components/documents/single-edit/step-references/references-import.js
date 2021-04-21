import React from 'react';
import { toast } from 'react-toastify';
import { Button } from '@devseed-ui/button';

import {
  bibtexItemsToRefs,
  parseBibtexFile
} from '../../../../utils/references';
import { showConfirmationPrompt } from '../../../common/confirmation-prompt';

export const confirmImportReferences = async (referenceCount) => {
  const txt =
    referenceCount > 1
      ? `There are ${referenceCount} references`
      : `There is 1 reference`;

  return showConfirmationPrompt({
    title: 'Import references',
    content: (
      <p>
        {txt} in the selected file. Do you want to import them into the form?
      </p>
    ),
    /* eslint-disable-next-line react/display-name, react/prop-types */
    renderControls: ({ confirm, cancel }) => (
      <React.Fragment>
        <Button
          variation='base-plain'
          title='Cancel references import'
          useIcon='xmark--small'
          onClick={cancel}
        >
          Cancel
        </Button>
        <Button
          variation='primary-raised-dark'
          title='Import into form'
          useIcon='tick--small'
          onClick={confirm}
        >
          Import
        </Button>
      </React.Fragment>
    )
  });
};

export const readBibtexFile = async (file) => {
  try {
    const fileData = await parseBibtexFile(file);
    const refs = bibtexItemsToRefs(fileData);

    if (refs.total) {
      const { result } = await confirmImportReferences(refs.total);
      if (result) {
        const refText = refs.total > 1 ? 'references were' : 'reference was';
        toast.info(
          `${refs.total} ${refText} imported. Review and save the form.`
        );
        return refs;
      }
    } else {
      toast.error("The selected file doesn't have any references.");
    }
  } catch (error) {
    toast.error('The selected file is not a valid BibTex file.');
  }
};
