import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { glsp, media, rgba, themeVal } from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';

import Tip from './tooltip';

const PageFooterSelf = styled.footer`
  display: grid;
  grid-template-columns: 1fr auto;
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
  font-size: 0.875rem;
  line-height: 1rem;

  time {
    margin-left: ${glsp(0.75)};
    padding-left: ${glsp(0.75)};
    box-shadow: inset 1px 0 0 0 ${rgba(themeVal('color.surface'), 0.16)};
  }
`;

const CreditsLink = styled.a`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  font-weight: ${themeVal('type.base.regular')};

  strong {
    text-transform: uppercase;
    font-weight: ${themeVal('type.base.extrabold')};
    letter-spacing: -0.0125em;
  }
`;

const VersionInfo = styled.p`
  margin-left: auto;
  font-weight: ${themeVal('type.base.regular')};
  font-size: 0.875rem;
`;

function PageFooter() {
  const nowDate = new Date();
  const updateDate = new Date(process.env.APP_BUILD_TIME || nowDate.getTime());

  return (
    <PageFooterSelf role='contentinfo'>
      <Colophon>
        <CreditsLink
          href='https://earthdata.nasa.gov/'
          title='Visit NASA Earthdata'
        >
          <span>
            NASA <strong>Earthdata</strong>
          </span>
          <time dateTime={nowDate.getFullYear()}>{nowDate.getFullYear()}</time>
        </CreditsLink>
      </Colophon>
      <Tip
        tag={VersionInfo}
        delay={1000}
        position='top-end'
        title={`Last update on ${format(updateDate, 'yyyy-MM-dd HH:mm:ss')}`}
      >
        v{process.env.APP_VERSION}
      </Tip>
    </PageFooterSelf>
  );
}

export default PageFooter;
