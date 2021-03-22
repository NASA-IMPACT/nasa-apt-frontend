import styled from 'styled-components';

import {
  glsp,
  media,
  rgba,
  themeVal,
  truncated,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';
import { headingAlt } from '@devseed-ui/typography';

export const Inpage = styled.article`
  display: grid;
  height: 100%;
  grid-template-rows: min-content 1fr;
`;

export const InpageHeader = styled.header`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: ${glsp(0, themeVal('layout.gap.xsmall'))};
  align-items: end;
  background-color: ${themeVal('color.primary')};
  color: #fff;
  animation: ${reveal} 0.32s ease 0s 1;
  padding: ${glsp(1, themeVal('layout.gap.xsmall'))};
  box-shadow: inset 0 1px 0 0 ${rgba(themeVal('color.surface'), 0.16)};

  ${media.mediumUp`
    grid-gap: ${glsp(0, themeVal('layout.gap.medium'))};
    padding: ${glsp(1, themeVal('layout.gap.medium'))};
  `}
`;

export const InpageHeadline = styled.div`
  display: inline-grid;
  grid-gap: ${glsp(1.25)};
  align-items: center;

  > * {
    grid-row: 1;
  }
`;

export const InpageHeadNav = styled.nav`
  font-size: 1rem;
  line-height: 2rem;
`;

export const BreadcrumbMenu = styled.ul`
  display: inline-grid;
  grid-gap: ${glsp(0.5)};
  align-items: center;

  > * {
    grid-row: 1;
  }

  li {
    display: flex;
    flex-flow: row nowrap;

    &::before {
      content: '/';
      font-weight: ${themeVal('type.heading.weight')};
      margin-right: ${glsp(0.5)};
      opacity: 0.32;
    }
  }

  strong {
    padding: ${glsp(0, 0.75)};
  }
`;

export const InpageActions = styled.div`
  display: inline-grid;
  grid-gap: ${glsp(0.5)};
  align-items: center;
  margin-left: auto;

  > * {
    grid-row: 1;
  }
`;

export const InpageMeta = styled.dl`
  grid-row: 1;
  grid-column: 1 / -1;
  display: grid;
  grid-gap: ${glsp(0.5)};
  align-items: center;
  grid-auto-columns: minmax(min-content, max-content);
  font-size: 0.75rem;
  line-height: 1.25rem;

  > * {
    grid-row: 1;
  }

  dt {
    ${visuallyHidden};
  }

  a {
    color: inherit;
  }
`;

export const InpageTitle = styled.h1`
  ${truncated()}
  font-size: 1.25rem;
  line-height: 2rem;
  margin: 0;
`;

export const InpageSubtitle = styled.p`
  ${headingAlt()}
  font-size: 0.75rem;
  line-height: 1.25rem;
  margin: 0;
`;

export const InpageBody = styled.div`
  background: transparent;
`;
