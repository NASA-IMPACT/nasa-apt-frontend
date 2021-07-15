import React from 'react';
import styled, { css } from 'styled-components';
import useDimensions from 'react-cool-dimensions';
import {
  glsp,
  media,
  rgba,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';
import { headingAlt } from '@devseed-ui/typography';

import StickyElement from '../components/common/sticky-element';

export const Inpage = styled.article`
  display: grid;
  height: 100%;
  grid-template-rows: min-content 1fr;
`;

export const InpageHeader = styled.header.attrs({
  'data-element': 'inpage-header'
})`
  position: relative;
  z-index: 20;
  display: grid;
  /* grid-template-columns: max-content 1fr; */
  grid-template-columns: 1fr minmax(min-content, max-content);
  grid-gap: ${glsp(0, themeVal('layout.gap.xsmall'))};
  align-items: end;
  background-color: ${themeVal('color.primary')};
  color: #fff;
  animation: ${reveal} 0.32s ease 0s 1;
  padding: ${glsp(1, themeVal('layout.gap.xsmall'))};
  box-shadow: inset 0 1px 0 0 ${rgba(themeVal('color.surface'), 0.16)},
    ${themeVal('boxShadow.elevationD')};
  clip-path: polygon(0 0, 100% 0, 100% 200%, 0% 200%);

  ${media.mediumUp`
    grid-gap: ${glsp(0, themeVal('layout.gap.medium'))};
    padding: ${glsp(1, themeVal('layout.gap.medium'))};
  `}
`;

export const InpageHeaderSticky = styled(InpageHeader)`
  position: sticky;
  top: 0;
  z-index: 9000;
`;

export const InpageHeadline = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp(0.25)};
`;

export const InpageHeadHgroup = styled.div`
  display: inline-grid;
  grid-auto-columns: minmax(min-content, max-content);
  grid-gap: ${glsp(1.25)};
  align-items: center;
  min-width: 0px;

  > * {
    grid-row: 1;
  }
`;

export const InpageMeta = styled.ul`
  display: grid;
  grid-gap: ${glsp(0.5)};
  align-items: center;
  grid-auto-columns: minmax(min-content, max-content);
  font-size: 0.875rem;
  line-height: 1.25rem;

  > * {
    grid-row: 1;
    display: flex;
    align-content: center;
  }

  a {
    color: inherit;
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

export const InpageTitle = styled.h1`
  font-size: 1.25rem;
  line-height: 2rem;
  margin: 0;
  max-width: 24rem;
  overflow: hidden;
  white-space: nowrap;

  ${({ shouldMask }) =>
    shouldMask &&
    css`
      /* Apply mask conditionally: container max-width (24rem) - mask size (3rem) */
      /* stylelint-disable function-calc-no-invalid */
      mask-image: linear-gradient(
        to right,
        black calc(100% - ${glsp(3)}),
        transparent 100%
      );
      /* stylelint-enable function-calc-no-invalid */
    `}

  a {
    display: block;
    color: inherit;
  }
`;

export const InpageSubtitle = styled.p`
  ${headingAlt()}
  font-size: 0.75rem;
  line-height: 1.25rem;
  grid-row: 1;
  margin: 0 0 ${glsp(-0.5)} 0;
  display: flex;
  align-content: center;

  a {
    display: block;
    color: inherit;
  }

  span {
    ${visuallyHidden()}
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

export const InpageBody = styled.div`
  background: transparent;
`;

// Wrapper component for Inpage header and sticky element.
// All props are forwarded to InpageHeader
const StickyElementZIndex = styled(StickyElement)`
  z-index: 1000;
`;
export function StickyInpageHeader(props) {
  return (
    <StickyElementZIndex>
      <InpageHeader {...props} />
    </StickyElementZIndex>
  );
}

// Wrapper component for Inpage Title applying the truncate mask after a certain
// width. All props are forwarded to InpageTitle.
export function TruncatedInpageTitle(props) {
  const { ref, width } = useDimensions();

  return <InpageTitle {...props} ref={ref} shouldMask={width > 352} />;
}
