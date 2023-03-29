import { createGlobalStyle } from 'styled-components';

import reactTippyStyles from './vendor/react-tippy';

export default createGlobalStyle`
@media print {
  @page {
    size: portrait;
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
