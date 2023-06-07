import { useCallback } from 'react';
import { useHistory } from 'react-router';

import { useAtbds } from '../../../context/atbds-list';
import { documentEdit } from '../../../utils/url-creator';
import { createProcessToast } from '../../common/toasts';

/**
 * Hook to create a click listener for the document create button
 * @returns function
 */
export function useDocumentCreate(title, isPdfType) {
  const { createAtbd } = useAtbds();
  const history = useHistory();

  return useCallback(async () => {
    const processToast = createProcessToast('Creating new Document');
    const result = await createAtbd(title, isPdfType);

    if (result.error) {
      processToast.error(`An error occurred: ${result.error.message}`);
    } else {
      processToast.success('Document successfully created');
      // To trigger the modals to open from other pages, we use the history
      // state as the user is sent from one page to another. See explanation
      // on
      // app/assets/scripts/components/documents/use-document-modals.js
      history.push(`${documentEdit(result.data)}?welcome=true`, {
        menuAction: 'view-tracker'
      });
    }
  }, [createAtbd, history, title, isPdfType]);
}
