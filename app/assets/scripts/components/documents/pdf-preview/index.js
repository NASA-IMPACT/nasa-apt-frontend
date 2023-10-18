import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { GlobalLoading } from '@devseed-ui/global-loading';
import styled from 'styled-components';

import { useSingleAtbd } from '../../../context/atbds-list';
import { useUser } from '../../../context/user';
import DocumentBody from '../single-view/document-body';
import DocumentTitle from '../single-view/document-title';
import { DocumentProse } from '../single-view/document-content';
import { ScrollAnchorProvider } from '../single-view/scroll-manager';
import {
  PLACEMENTS,
  applyNumberCaptionsToDocument
} from '../../../utils/apply-number-captions-to-document';
import { IMAGE_BLOCK } from '../../slate/plugins/constants';

const TocHeader = styled.h1`
  border-bottom: 3px solid #000;
  margin-top: 0;
`;

const PreviewContainer = styled.div`
  @media print {
    @page {
      size: portrait;
      margin: 15mm;
    }
  }
`;

function generateTocAndHeadingNumbering(content) {
  // Returns title element to be injected in the ToC
  // Adds the dashed line and space for title and page number
  function getTitleElement(sectionId, sectionTitle) {
    const title = document.createElement('a');
    const text = document.createElement('span');
    // const spacer = document.createElement('span');
    // const pageNumber = document.createElement('span');

    title.append(text);
    // title.append(spacer);
    // title.append(pageNumber);

    title.href = `#${sectionId}`;
    title.classList.add('toc-title');

    text.innerText = sectionTitle;
    text.classList.add('toc-title-text');
    // spacer.classList.add('toc-title-spacer');
    // pageNumber.classList.add('toc-title-page');

    // pageNumber.classList.add('toc-page-number');
    // pageNumber.setAttribute('data-target', `#${sectionId}`);

    return title;
  }

  const hiddenContents = content.querySelectorAll('.pdf-preview-hidden');
  Array.from(hiddenContents).forEach((hiddenContent) => {
    hiddenContent.remove();
  });

  const tocElement = content.querySelector('#table-of-contents');

  // This function iteratively finds the subheadings
  // (h3, h4, h5, ...) in the content and creates ToC entry
  function generateSubHeadings(
    currentHeading,
    currentLevel,
    sectionContainer,
    parentContainer,
    parentHeadingNumber
  ) {
    const currentSubHeadings = [];

    // We separately handle the user-defined subheadings, since they
    // don't follow the pattern of other subheadings
    const userDefinedHeadings =
      currentHeading.nextElementSibling?.querySelectorAll(
        `H${currentLevel + 1}`
      );

    if (userDefinedHeadings) {
      currentSubHeadings.push(
        ...Array.from(userDefinedHeadings).filter(
          (subHeading) =>
            !subHeading.classList.contains('pdf-preview-no-toc') ||
            subHeading
              .closest('section')
              ?.classList.contains('pdf-preview-no-toc')
        )
      );
    }

    let currentEl = currentHeading;
    // The subheadings are in the same hierarcy / nesting
    // So, we find smaller sub-headings between current level of
    // sub-headings.
    while (
      currentEl.nextElementSibling !== null &&
      currentEl.nextElementSibling.tagName !== `H${currentLevel}`
    ) {
      const nextSibling = currentEl.nextElementSibling;
      const isSubHeading = nextSibling.tagName === `H${currentLevel + 1}`;

      if (isSubHeading) {
        const nonPreviewable =
          nextSibling.classList.contains('pdf-preview-no-toc') ||
          nextSibling
            .closest('section')
            ?.classList.contains('pdf-preview-no-toc');
        if (!nonPreviewable) {
          currentSubHeadings.push(nextSibling);
        }
      }

      currentEl = nextSibling;
    }

    if (currentSubHeadings.length > 0) {
      const subHeadingSections = document.createElement('div');
      subHeadingSections.classList.add('toc-section');
      sectionContainer.append(subHeadingSections);

      currentSubHeadings.forEach((subHeading, i) => {
        // Generating the heading number and injecting it to the content.
        // So, it appears both in the ToC and in the content.
        const headingNumber = `${parentHeadingNumber}${i + 1}.`;

        const skipNumbering =
          subHeading.classList.contains('pdf-preview-no-numbering') ||
          subHeading
            .closest('section')
            ?.classList.contains('pdf-preview-no-numbering');

        if (!skipNumbering) {
          if (subHeading.children[0]) {
            subHeading.children[0].prepend(`${headingNumber} `);
          } else {
            subHeading.prepend(`${headingNumber} `);
          }
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

  // This function generates the main headings from h2 in the content
  // and calls generateSubHeadings to find subheadings between 2 consecutive headings
  function generateHeading() {
    const sectionHeadings = content.querySelectorAll('h2');
    let skippedHeadings = 0;
    let skippedNumberings = 0;
    Array.from(sectionHeadings).forEach((heading, i) => {
      if (
        heading.closest('section')?.classList.contains('pdf-preview-no-toc') ||
        heading.classList.contains('pdf-preview-no-toc')
      ) {
        skippedHeadings += 1;
        return;
      }
      const section = document.createElement('div');
      section.classList.add('toc-section');
      tocElement.append(section);

      const skipNumbering =
        heading.classList.contains('pdf-preview-no-numbering') ||
        heading
          .closest('section')
          ?.classList.contains('pdf-preview-no-numbering');
      const headingNumber = `${i + 1 - skippedHeadings - skippedNumberings}.`;
      if (skipNumbering) {
        skippedNumberings += 1;
      }

      if (heading.children[0] && !skipNumbering) {
        // Inject the heading number to the content itself
        // so that it appears both in the document heading
        // and in the ToC
        heading.children[0].prepend(`${headingNumber} `);
      }

      const sectionTitle = getTitleElement(heading.id, heading.innerText);
      section.append(sectionTitle);
      generateSubHeadings(
        heading,
        2,
        section,
        heading.parentNode,
        headingNumber
      );
    });
  }

  // Starting from h2
  generateHeading(2, tocElement, content, undefined);

  const equationNumbers = content.querySelectorAll(
    '.slate-equation-element .equation-number'
  );
  Array.from(equationNumbers).forEach((equationNumber, i) => {
    equationNumber.innerText = `(${i + 1})`;
  });
}

function PdfPreview() {
  const { id, version } = useParams();
  const { atbd, fetchSingleAtbd } = useSingleAtbd({ id, version });
  const { isAuthReady } = useUser();
  const contentRef = useRef(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [document, setDocument] = useState(null);

  useEffect(() => {
    isAuthReady && fetchSingleAtbd();
  }, [isAuthReady, id, version, fetchSingleAtbd]);

  useEffect(() => {
    async function waitForImages() {
      const images = contentRef.current.querySelectorAll('img');
      const promises = Array.from(images).map((image) => {
        return new Promise((accept) => {
          image.addEventListener('load', () => {
            accept();
          });
        });
      });
      await Promise.all(promises);
      setPreviewReady(true);
    }

    if (atbd.status === 'succeeded') {
      setDocument(
        applyNumberCaptionsToDocument(atbd.data.document, {
          imageCaptionBelow: true
        })
      );
      waitForImages();
    }
  }, [atbd.status]);

  // This useEffect is responsible for generating the ToC and numbering
  // after the document is transformed
  useEffect(() => {
    if (document && contentRef?.current) {
      generateTocAndHeadingNumbering(contentRef.current);
    }
  }, [document]);

  return (
    <ScrollAnchorProvider disabled>
      {atbd.status === 'loading' && <GlobalLoading />}
      {atbd.status === 'succeeded' && (
        /*
          Note these empty divs are required for print mode
          to work properly (No idea why though!)
        */
        <PreviewContainer className='pdf-preview'>
          <div ref={contentRef}>
            <DocumentProse className='preview-page-title'>
              <DocumentTitle data={atbd.data} />
            </DocumentProse>
            <div className='preview-page-toc'>
              <TocHeader>Table of Contents</TocHeader>
              <div
                className='preview-table-of-content'
                id='table-of-contents'
              />
            </div>
            {document && (
              <DocumentProse className='preview-page-content'>
                <DocumentBody
                  atbd={{
                    ...atbd.data,
                    document
                  }}
                  disableScrollManagement={true}
                />
              </DocumentProse>
            )}
          </div>
          {previewReady && <div id='pdf-preview-ready' />}
        </PreviewContainer>
      )}
    </ScrollAnchorProvider>
  );
}

export default PdfPreview;
