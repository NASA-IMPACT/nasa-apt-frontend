import { useCallback } from 'react';
import { useHistory } from 'react-router';
import ReactGA from 'react-ga4';

import { useAtbds } from '../../../context/atbds-list';
import { documentEdit } from '../../../utils/url-creator';
import { createProcessToast } from '../../common/toasts';

/**
 * Hook to create a click listener for the document create button
 * @returns function
 */
export function useDocumentCreate(title, alias, isPdfType) {
  const { createAtbd } = useAtbds();
  const history = useHistory();

  return useCallback(async () => {
    const processToast = createProcessToast('Creating new Document');
    const result = await createAtbd(title, alias, isPdfType);

    if (result.error) {
      if (result.error.response) {
        const { status } = result.error.response;
        if (status === 400) {
          processToast.error(
            `An error occurred: ${result.error.response.data.detail}`
          );
        } else {
          processToast.error(
            `An error occurred: ${result.error.response.statusText}`
          );
        }
      } else {
        processToast.error(`An error occurred: ${result.error.message}`);
      }
    } else {
      ReactGA.event('atbd_created', {
        type: isPdfType ? 'pdf' : 'regular'
      });

      processToast.success('Document successfully created');
      // To trigger the modals to open from other pages, we use the history
      // state as the user is sent from one page to another. See explanation
      // on
      // app/assets/scripts/components/documents/use-document-modals.js
      history.push(`${documentEdit(result.data)}?welcome=true`, {
        menuAction: 'view-tracker'
      });
    }
  }, [createAtbd, alias, history, title, isPdfType]);
}
