import styled from 'styled-components';

import { glsp, media, themeVal } from '@devseed-ui/theme-provider';

export const BlockMessage = styled.section`
  background-color: ${themeVal('color.baseAlphaB')};
  border-radius: ${themeVal('shape.rounded')};
  border: ${themeVal('layout.border')} solid ${themeVal('color.baseAlphaC')};
  padding: ${glsp(themeVal('layout.gap.xsmall'))};

  ${media.smallUp`
    padding: ${glsp(themeVal('layout.gap.small'))};
  `}

  ${media.mediumUp`
    padding: ${glsp(themeVal('layout.gap.medium'))};
  `}

  ${media.largeUp`
    padding: ${glsp(themeVal('layout.gap.large'))};
  `}

  ${media.xlargeUp`
    padding: ${glsp(themeVal('layout.gap.xlarge'))};
  `}

  & > * {
    margin-bottom: ${glsp(0.5)};
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;
