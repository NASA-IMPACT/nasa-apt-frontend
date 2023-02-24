import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { Previewer, Handler, registerHandlers } from 'pagedjs';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useUser } from '../../../context/user';
import DocumentContent from '../single-view/document-content';
import { ScrollAnchorProvider } from '../single-view/scroll-manager';

class AfterRenderHandler extends Handler {
  static renderCallback;

  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }

  afterPreview() {
    if (AfterRenderHandler.renderCallback) {
      AfterRenderHandler.renderCallback();
    }
  }
}

function PdfPreview() {
  const { id, version } = useParams();
  const { atbd, fetchSingleAtbd } = useSingleAtbd({ id, version });
  const { isAuthReady } = useUser();
  const contentRef = useRef(null);
  const previewRef = useRef(null);
  const [previewReady, setPreviewReady] = useState(false);

  useEffect(() => {
    isAuthReady && fetchSingleAtbd();
  }, [isAuthReady, id, version, fetchSingleAtbd]);

  useEffect(() => {
    async function generatePreview() {
      if (atbd.status === 'succeeded') {
        const previewer = new Previewer();
        AfterRenderHandler.renderCallback = () => {
          setPreviewReady(true);
        };

        registerHandlers(AfterRenderHandler);
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
          {previewReady && <div id='pdf-preview-ready' />}
        </div>
      )}
    </ScrollAnchorProvider>
  );
}

export default PdfPreview;
