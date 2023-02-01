import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { Previewer } from 'pagedjs';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useUser } from '../../../context/user';
import DocumentContent from '../single-view/document-content';
import { ScrollAnchorProvider } from '../single-view/scroll-manager';

function PdfPreview() {
  const { id, version } = useParams();
  const { atbd, fetchSingleAtbd } = useSingleAtbd({ id, version });
  const { isAuthReady } = useUser();
  const contentRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    isAuthReady && fetchSingleAtbd();
  }, [isAuthReady, id, version, fetchSingleAtbd]);

  useEffect(() => {
    async function generatePreview() {
      if (atbd.status === 'succeeded') {
        const previewer = new Previewer();
        await previewer.preview(
          contentRef.current,
          ['/pdf-preview-styles.css'],
          previewRef.current
        );

        contentRef.current.style.display = 'none';
      }
    }

    generatePreview();
  }, [atbd.status]);

  return (
    <ScrollAnchorProvider disabled>
      {atbd.status === 'loading' && <GlobalLoading />}
      {atbd.status === 'succeeded' && (
        <div>
          <div id='content' ref={contentRef}>
            <DocumentContent
              atbdData={atbd.data}
              disableScrollManagement={true}
            />
          </div>
          <div id='preview' ref={previewRef} />
        </div>
      )}
    </ScrollAnchorProvider>
  );
}

export default PdfPreview;
