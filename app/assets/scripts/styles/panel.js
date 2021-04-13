import styled from 'styled-components';

import { glsp, media, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { headingAlt } from '@devseed-ui/typography';

export const Panel = styled.section`
  position: relative;
  z-index: 30;
  display: flex;
  flex-flow: column nowrap;
  width: 18rem;
  box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaC')};

  ${media.mediumUp`
    width: 20rem;
  `}

  ${media.xlargeUp`
    width: 22rem;
  `}
`;

export const PanelHeader = styled.header`
  position: relative;
  z-index: 9999;
  padding: ${glsp(0.5, themeVal('layout.gap.xsmall'))};
  box-shadow: 0 1px 0 0 ${themeVal('color.baseAlphaC')};

  ${media.mediumUp`
    padding: ${glsp(1, themeVal('layout.gap.medium'))};
  `}
`;

export const PanelHeadline = styled.div``;

export const PanelTitle = styled(Heading)`
  font-size: 1.25rem;
  line-height: 1rem;
  margin: 0;
`;

export const PanelBody = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
`;

export const PanelSection = styled.section`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
`;

export const PanelSectionHeader = styled.header`
  padding: ${glsp(0.5, themeVal('layout.gap.xsmall'))};

  ${media.mediumUp`
    padding: ${glsp(1, themeVal('layout.gap.medium'))};
  `}
`;

export const PanelSectionHeadline = styled.div``;

export const PanelSectionTitle = styled(Heading)`
  font-size: 1rem;
  line-height: 1.25rem;
  margin: 0;
`;

export const PanelSectionBody = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
`;

export const PanelGroup = styled.section`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  padding: ${glsp(0.5, 0, 0, 0)};

  &::before {
    position: absolute;
    top: 0;
    left: ${glsp(themeVal('layout.gap.xsmall'))};
    right: 0;
    content: '';
    pointer-events: none;
    height: 1px;
    background: ${themeVal('color.baseAlphaC')};

    ${media.mediumUp`
      left: ${glsp(themeVal('layout.gap.medium'))};
    `}
  }
`;

export const PanelGroupHeader = styled.header`
  padding: ${glsp(0.25, themeVal('layout.gap.xsmall'))};

  ${media.mediumUp`
    padding: ${glsp(0.5, themeVal('layout.gap.medium'))};
  `}
`;

export const PanelGroupTitle = styled.p`
  ${headingAlt()}
  font-size: 0.875rem;
  line-height: 1rem;
  margin: 0;
`;

export const PanelGroupBody = styled.div`
  flex: 1;
`;
