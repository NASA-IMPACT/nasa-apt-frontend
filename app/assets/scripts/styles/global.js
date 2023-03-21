import { createGlobalStyle } from 'styled-components';

import reactTippyStyles from './vendor/react-tippy';

export default createGlobalStyle`
${reactTippyStyles()}

.tether-element {
  z-index:9000;
}

.slate-equation-element {
  .equation-number {
    display: none;
  }
}

.pagedjs_pages {
  background-color: #f0f0f0;
}

.pagedjs_page {
  margin: 1rem;
  border: solid 1px rgba(0, 0, 0, 0.1);
  background-color: white;

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

  .katex-html {
    .base {
      white-space: initial;
      width: unset;
    }
  }

  .section-title {
    display: block;
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
