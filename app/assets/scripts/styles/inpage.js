import styled, { css } from 'styled-components';

import {
  glsp,
  media,
  rgba,
  themeVal,
  truncated
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';

export const Inpage = styled.article`
  display: grid;
  height: 100%;
  grid-template-rows: min-content 1fr;
`;

export const InpageHeader = styled.header`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};
  align-items: center;
  background-color: ${themeVal('color.primary')};
  color: #fff;
  animation: ${reveal} 0.32s ease 0s 1;
  padding: ${glsp(1, themeVal('layout.gap.xsmall'))};
  box-shadow: inset 0 1px 0 0 ${rgba(themeVal('color.surface'), 0.16)};

  ${media.mediumUp`
    grid-gap: ${glsp(themeVal('layout.gap.medium'))};
    padding: ${glsp(1, themeVal('layout.gap.medium'))};
  `}
`;

export const InpageHeadline = styled.div`
  display: flex;
  flex-flow: column nowrap;
  min-width: 0px;
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

export const InpageTitleWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  min-width: 0;
  margin-bottom: ${glsp(1.5)};
`;

export const InpageTitle = styled.h1`
  ${truncated()}
  font-size: 1rem;
  line-height: 2rem;
  margin: 0;
`;

export const InpageSubtitle = styled.p`
  position: absolute;
  font-size: 1rem;
  line-height: 1.5rem;
  margin: 0;
  transform: translate(0, calc(-100% + 0.25rem));
`;

export const InpageBody = styled.div`
  background: transparent;
`;
