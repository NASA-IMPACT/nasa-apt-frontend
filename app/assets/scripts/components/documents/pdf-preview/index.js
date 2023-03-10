import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { Previewer, Handler, registerHandlers } from 'pagedjs';
import styled from 'styled-components';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useUser } from '../../../context/user';
import DocumentContent from '../single-view/document-content';
import { ScrollAnchorProvider } from '../single-view/scroll-manager';

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

    function generateSubHeadings(
      currentHeading,
      currentLevel,
      sectionContainer,
      parentContainer,
      parentHeadingNumber
    ) {
      const currentSubHeadings = [];
      let currentEl = currentHeading;

      while (
        currentEl.nextElementSibling !== null &&
        currentEl.nextElementSibling.tagName !== `H${currentLevel}`
      ) {
        if (currentEl.nextElementSibling.tagName === `H${currentLevel + 1}`) {
          currentSubHeadings.push(currentEl.nextElementSibling);
        }

        currentEl = currentEl.nextElementSibling;
      }

      if (currentSubHeadings.length > 0) {
        const subHeadingSections = document.createElement('div');
        subHeadingSections.classList.add('toc-section');
        sectionContainer.append(subHeadingSections);

        currentSubHeadings.forEach((subHeading, i) => {
          const headingNumber = `${parentHeadingNumber}${i + 1}.`;
          if (subHeading.children[0]) {
            subHeading.children[0].prepend(`${headingNumber} `);
          } else {
            subHeading.prepend(`${headingNumber} `);
          }
          const subHeadingTitle = getTitleElement(
            subHeading.id,
            subHeading.innerText
          );
          subHeadingSections.append(subHeadingTitle);

          generateSubHeadings(
            subHeading,
            currentLevel + 1,
            subHeadingSections,
            subHeading.parentNode,
            headingNumber
          );
        });
      }
    }

    function generateHeading() {
      const sectionHeadings = content.querySelectorAll('h2');
      Array.from(sectionHeadings).forEach((h, i) => {
        const section = document.createElement('div');
        section.classList.add('toc-section');
        tocElement.append(section);

        const headingNumber = `${i + 1}.`;
        if (h.children[0]) {
          h.children[0].prepend(`${headingNumber} `);
        }

        const sectionTitle = getTitleElement(h.id, h.innerText);
        section.append(sectionTitle);
        generateSubHeadings(h, 2, section, h.parentNode, headingNumber);
      });
    }

    generateHeading(2, tocElement, content, undefined);
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
            <div>
              <TocHeader>Table of Contents</TocHeader>
              <div
                className='preview-table-of-content'
                id='table-of-contents'
              />
            </div>
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
