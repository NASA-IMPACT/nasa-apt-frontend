import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useUser } from '../../../context/user';
import DocumentContent from '../single-view/document-content';
import { ScrollAnchorProvider } from '../single-view/scroll-manager';

function PdfPreview() {
  const { id, version } = useParams();
  const { atbd, fetchSingleAtbd } = useSingleAtbd({ id, version });
  const { isAuthReady } = useUser();

  useEffect(() => {
    isAuthReady && fetchSingleAtbd();
  }, [isAuthReady, id, version, fetchSingleAtbd]);

  return (
    <ScrollAnchorProvider>
      {atbd.status === 'loading' && <GlobalLoading />}
      {atbd.status === 'succeeded' && <DocumentContent atbdData={atbd.data} />}
    </ScrollAnchorProvider>
  );
}

export default PdfPreview;
