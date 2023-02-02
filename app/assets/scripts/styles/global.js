import { createGlobalStyle } from 'styled-components';

import reactTippyStyles from './vendor/react-tippy';

export default createGlobalStyle`
${reactTippyStyles()}

.tether-element {
  z-index:9000;
}

@page {
  size: A4 landscape;
}

.pagedjs_pages {
  background-color: #f0f0f0;
}

.pagedjs_page {
  margin: 1rem;
  border: solid 1px rgba(0, 0, 0, 0.1);
  background-color: white;
}
`;
