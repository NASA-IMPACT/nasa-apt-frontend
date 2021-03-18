import React from 'react';
import styled from 'styled-components';

import { glsp, media, rgba, themeVal } from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';

const PageFooterSelf = styled.footer`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${glsp(themeVal('layout.gap.xsmall'))};
  align-items: center;
  background-color: ${themeVal('color.primary')};
  color: #fff;
  animation: ${reveal} 0.32s ease 0s 1;
  padding: ${glsp(1, themeVal('layout.gap.xsmall'))};

  ${media.mediumUp`
    grid-gap: ${glsp(themeVal('layout.gap.medium'))};
    padding: ${glsp(1, themeVal('layout.gap.medium'))};
  `}

  a,
  a:visited {
    color: inherit;
  }
`;

const Colophon = styled.p`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;

  time {
    font-size: 0.875rem;
    line-height: 1.5rem;
    margin-left: ${glsp(0.5)};
    padding-left: ${glsp(0.5)};
    box-shadow: inset 1px 0 0 0 ${rgba(themeVal('color.surface'), 0.16)};
  }
`;

const CreditsLink = styled.a`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;

  strong {
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: ${themeVal('type.base.regular')};
    letter-spacing: -0.0125em;
    display: block;
  }
`;

function PageFooter() {
  return (
    <PageFooterSelf role='contentinfo'>
      <Colophon>
        <CreditsLink
          href='https://earthdata.nasa.gov/'
          title='Visit NASA Earthdata'
        >
          <strong>NASA Earthdata</strong>
          <time dateTime={new Date().getFullYear()}>
            {new Date().getFullYear()}
          </time>
        </CreditsLink>
      </Colophon>
    </PageFooterSelf>
  );
}

export default PageFooter;
