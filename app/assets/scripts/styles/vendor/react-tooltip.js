import { css } from 'styled-components';
import { glsp, themeVal, antialiased } from '@devseed-ui/theme-provider';

export default () => css`
  /* Overrides for react-tooltip styles. */

  .__react_component_tooltip {
    ${antialiased()}
    border-radius: ${themeVal('shape.rounded')};
    font-size: 0.875rem;
    line-height: 1.25rem;
    max-width: 16rem;
    padding: ${glsp(1 / 2, 1)};

    &.type-dark {
      background: ${themeVal('color.base')} !important;
      ${['top', 'bottom', 'left', 'right'].map(
        (dir) => css`
        &.place-${dir}::after {
          border-${dir}-color: ${themeVal('color.base')} !important;
        }
      `
      )}
    }

    &.show {
      opacity: 1 !important;
    }
  }
`;
