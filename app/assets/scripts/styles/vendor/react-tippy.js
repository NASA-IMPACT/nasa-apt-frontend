import { css } from 'styled-components';
import { glsp, themeVal, antialiased } from '@devseed-ui/theme-provider';

export default () => css`
  /* Overrides for react-tippy styles. */

  .apt-theme {
    ${antialiased()}
    border-radius: ${themeVal('shape.rounded')};
    background: ${themeVal('color.base')} !important;
    font-size: 0.875rem;
    line-height: 1.25rem;
    max-width: 16rem;
    padding: ${glsp(1 / 2, 1)};
    word-break: break-word;
  }

  ${['top', 'bottom', 'left', 'right'].map(
    (dir) => css`
        .tippy-popper[x-placement^="${dir}"] [x-arrow] {
          border-${dir}-color: ${themeVal('color.base')} !important;
        }
      `
  )}
`;
