import React from 'react';
import styled from 'styled-components';

import { glsp, themeVal } from '@devseed-ui/theme-provider';

const PageFoot = styled.footer`
  padding: ${glsp()};
  background-color: ${themeVal('color.baseAlphaC')};
  font-size: 0.875rem;
  line-height: 1rem;
`;

const PageFootInner = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  padding: ${glsp(1.5, 2)};
`;

function PageFooter() {
  return (
    <PageFoot role='contentinfo'>
      <PageFootInner>
        <p>{new Date().getFullYear()} © NASA. All rights reserved</p>
      </PageFootInner>
    </PageFoot>
  );
}

export default PageFooter;
