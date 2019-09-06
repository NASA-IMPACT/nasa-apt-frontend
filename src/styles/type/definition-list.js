import styled, { css } from 'styled-components/macro';
import { rgba, clearFix } from 'polished';

import { divide } from '../utils/math';
import { themeVal } from '../utils/general';

const Dl = styled.dl`
  dt {
    font-feature-settings: "pnum" 0; /* Use proportional numbers */
    font-family: ${themeVal('type.heading.family')};
    font-weight: ${themeVal('type.heading.regular')};
    text-transform: uppercase;
    color: ${({ theme }) => rgba(theme.type.base.color, 0.64)};
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  dd, dt {
    margin: 0 0 ${divide(themeVal('layout.space'), 2)} 0;
  }

  dt:last-of-type,
  dd:last-child {
    margin-bottom: 0;
  }

  ${/* sc-declaration */({ type }) => type === 'horizontal' && css`
    ${clearFix()}

    dd {
      width: 64%;
      padding-left: ${divide(themeVal('layout.space'), 2)};
    }

    dd + dd {
      margin-left: 36%;
    }

    dt, dd {
      float: left;
    }

    dt {
      width: 36%;
      clear: left;
      padding-top: ${divide(themeVal('layout.space'), 8)};
      padding-bottom: ${divide(themeVal('layout.space'), 8)};
      padding-right: ${divide(themeVal('layout.space'), 2)};
    }
  `}
`;

export default Dl;
