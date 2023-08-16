import { createGlobalStyle } from 'styled-components';

import reactTippyStyles from './vendor/react-tippy';

export default createGlobalStyle`
@media print {
  :is(dd, td, li) .slate-p {
    text-indent: initial!important;
  }

  .print-page-header {
    position: fixed;
    top: 10mm;
    right: 10mm;
    border: 1px solid red;
  }
}

${reactTippyStyles()}

.tether-element {
  z-index:9000;
}

.katex-html {
  .base {
    white-space: initial;
    width: unset;
  }
}

.slate-equation-element {
  .equation-number {
    display: none;
  }
}

.pdf-preview {
  img {
    break-inside: avoid;
  }

  .reference-list {
    line-height: 1.5!important;
    text-indent: -1rem;
    padding: 1rem;

    li {
      &:not(:first-child) {
        margin-top: 1rem;
      }
    }
  }

  .pdf-preview-break-before-page {
    break-before: page;
  }

  .preview-page-toc {
    break-before: page;
  }

  .preview-page-content {
    break-before: page;
  }

  .slate-p {
    text-indent: 24pt;
  }

  .slate-p span {
    text-indent: initial;
  }

  :is(dd, td, li) .slate-p {
    text-indent: initial!important;
  }

  .slate-equation-element {
    display: flex;
    gap: 1rem;

    .katex-equation-wrapper {
      flex-grow: 1;
    }

    .equation-number {
      flex-shrink: 0;
      display: initial;
      align-self: center;
    }
  }

  .section-title {
    display: block;
  }

  .toc-section .toc-section {
    padding-left: 1rem;
  }

  .preview-table-of-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .toc-title {
      color: #000;
      display: flex;
      gap: 1rem;
      align-items: baseline;

      .toc-title-text {
        flex-shrink: 0;
      }

      .toc-title-spacer {
        flex-grow: 1;
        border-bottom: 1px dotted #000;
      }
    }
  }
}
`;
