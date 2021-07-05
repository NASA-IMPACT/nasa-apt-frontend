import { createGlobalStyle } from 'styled-components';

import reactTippyStyles from './vendor/react-tippy';

export default createGlobalStyle`
  ${reactTippyStyles()}

  .tether-element {
    z-index:9000;
    }
`;
