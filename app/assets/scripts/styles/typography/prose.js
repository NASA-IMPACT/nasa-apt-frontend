import styled, { css } from 'styled-components';
import { tint } from 'polished';

import {
  glsp,
  media,
  multiply,
  stylizeFunction,
  themeVal
} from '@devseed-ui/theme-provider';

const _tint = stylizeFunction(tint);

export const proseSpacing = '1.5rem';

export const proseInnerSpacing = () => css`
  > * {
    margin-bottom: ${proseSpacing};
  }

  > *:last-child {
    margin-bottom: 0;
  }
`;

const Prose = styled.div`
  font-size: 1rem;
  line-height: 1.5;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${themeVal('type.heading.family')};
    text-transform: ${themeVal('type.heading.case')};
    font-weight: ${themeVal('type.heading.weight')};
    font-style: ${themeVal('type.heading.style')};
    font-variation-settings: ${themeVal('type.heading.settings')};

    &:not(:first-child) {
      margin-top: ${multiply(proseSpacing, 2)};
    }
  }

  h1 {
    font-size: 2.25rem;
    line-height: 2.75rem;
  }

  h2 {
    font-size: 2rem;
    line-height: 2.5rem;
  }

  h3 {
    font-size: 1.75rem;
    line-height: 2.25rem;
  }

  h4 {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  h5 {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  h6 {
    font-size: 1rem;
    line-height: 1.5rem;
  }

  ol,
  dl {
    padding: 0;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  ul,
  ol {
    list-style-position: outside;
    margin-left: ${themeVal('layout.space')};
  }

  ol ol,
  ol ul,
  ul ol,
  ul ul {
    margin-bottom: 0;
  }

  dt {
    font-weight: ${themeVal('type.base.bold')};
  }

  figure > figcaption {
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: center;
    color: ${_tint(0.32, themeVal('color.base'))};
    padding: ${glsp(1, themeVal('layout.gap.xsmall'))};
    width: 100%;
    max-width: 52rem;
    margin: 0 auto;

    ${media.smallUp`
      padding: ${glsp(1, themeVal('layout.gap.small'))};
    `}

    ${media.mediumUp`
      font-size: 1rem;
      line-height: 1.5rem;
      padding: ${glsp(2, themeVal('layout.gap.medium'))};
    `}

    ${media.largeUp`
      padding: ${glsp(2, themeVal('layout.gap.large'))};
    `}

    ${media.xlargeUp`
      padding: ${glsp(2, themeVal('layout.gap.xlarge'))};
    `}
  }

  > img {
    display: block;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  figure img {
    display: block;
    margin: 0 auto;
  }

  ${proseInnerSpacing()}
`;

export default Prose;
