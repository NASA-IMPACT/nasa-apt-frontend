import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { Previewer, Handler, registerHandlers } from 'pagedjs';
import { glsp, media, themeVal } from '@devseed-ui/theme-provider';
import styled from 'styled-components';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useUser } from '../../../context/user';
import DocumentContent from '../single-view/document-content';
import { ScrollAnchorProvider } from '../single-view/scroll-manager';

const Container = styled.div`
  max-width: 52rem;
  padding: 0 ${glsp(themeVal('layout.gap.xsmall'))};

  ${media.smallUp`
    padding: 0 ${glsp(themeVal('layout.gap.small'))};
  `}

  ${media.mediumUp`
    padding: 0 ${glsp(themeVal('layout.gap.medium'))};
  `}

  ${media.largeUp`
    padding: 0 ${glsp(themeVal('layout.gap.large'))};
  `}

  ${media.xlargeUp`
    padding: 0 ${glsp(themeVal('layout.gap.xlarge'))};
  `}
`;

const TocHeader = styled.h1`
  border-bottom: 3px solid #000;
  margin-top: 0;
`;

class AfterRenderHandler extends Handler {
  static renderCallback;

  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }

  beforeParsed(content) {
    function getTitleElement(sectionId, sectionTitle) {
      const title = document.createElement('a');
      const text = document.createElement('span');
      const spacer = document.createElement('span');
      const pageNumber = document.createElement('span');

      title.append(text);
      title.append(spacer);
      title.append(pageNumber);

      title.href = `#${sectionId}`;
      title.classList.add('toc-title');

      text.innerText = sectionTitle;
      text.classList.add('toc-title-text');
      spacer.classList.add('toc-title-spacer');
      pageNumber.classList.add('toc-title-page');

      pageNumber.classList.add('toc-page-number');
      pageNumber.setAttribute('data-target', `#${sectionId}`);

      return title;
    }

    const tocElement = content.querySelector('#table-of-contents');
    const sectionHeadings = content.querySelectorAll('h2');

    Array.from(sectionHeadings).forEach((h) => {
      const section = document.createElement('div');
      section.classList.add('toc-section');
      tocElement.append(section);

      const sectionTitle = getTitleElement(h.id, h.innerText);
      section.append(sectionTitle);

      const parent = h.parentNode;
      const subHeadings = parent.querySelectorAll('h3');
      if (subHeadings.length > 0) {
        const subHeadingsContainer = document.createElement('div');
        subHeadingsContainer.classList.add('sub-headings-container');
        section.append(subHeadingsContainer);
        Array.from(subHeadings).forEach((sh) => {
          const subHeading = getTitleElement(sh.id, sh.innerText);
          subHeadingsContainer.append(subHeading);
        });
      }
    });
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

        contentRef.current.remove();
        // contentRef.current.style.display = 'none';
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
            <Container>
              <TocHeader>Table of Contents</TocHeader>
              <div
                className='preview-table-of-content'
                id='table-of-contents'
              />
            </Container>
            <DocumentContent
              className='preview-page-content'
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
