import { css } from 'styled-components';
import { glsp, themeVal, antialiased, rgba } from '@devseed-ui/theme-provider';

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

  .apt-drop-theme {
    ${antialiased()}
    background: ${themeVal('color.surface')} !important;
    border-radius: ${themeVal('shape.rounded')};
    box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaC')},
      0 0 32px 2px ${themeVal('color.baseAlphaC')},
      0 16px 48px -16px ${rgba(themeVal('color.base'), 0.16)};
    max-width: 16rem;
    width: 16rem;
    padding: ${glsp()};
    color: ${themeVal('type.base.color')};
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: left;

    [x-circle] {
      background: none;
    }
  }

  ${['top', 'bottom', 'left', 'right'].map(
    (dir) => css`
        .tippy-popper[x-placement^="${dir}"] [x-arrow] {
          border-${dir}-color: ${themeVal('color.base')} !important;
        }
      `
  )}
`;
