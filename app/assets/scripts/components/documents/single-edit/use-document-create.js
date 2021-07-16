import { useCallback } from 'react';
import { useHistory } from 'react-router';

import { useAtbds } from '../../../context/atbds-list';
import { documentEdit } from '../../../utils/url-creator';
import { createProcessToast } from '../../common/toasts';

/**
 * Hook to create a click listener for the document create button
 * @returns function
 */
export function useDocumentCreate() {
  const { createAtbd } = useAtbds();
  const history = useHistory();

  return useCallback(async () => {
    const processToast = createProcessToast('Creating new Document');
    const result = await createAtbd();

    if (result.error) {
      processToast.error(`An error occurred: ${result.error.message}`);
    } else {
      processToast.success('Document successfully created');
      history.push(documentEdit(result.data));
    }
  }, [createAtbd, history]);
}
