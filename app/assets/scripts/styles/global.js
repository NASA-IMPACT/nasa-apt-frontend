import { createGlobalStyle } from 'styled-components';

import reactTippyStyles from './vendor/react-tippy';

export default createGlobalStyle`
${reactTippyStyles()}

.tether-element {
  z-index:9000;
}

.pagedjs_pages {
  background-color: #f0f0f0;
}

.pagedjs_page {
  margin: 1rem;
  border: solid 1px rgba(0, 0, 0, 0.1);
  background-color: white;

  .section-title {
    display: block;
  }

  .sub-headings-container {
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
