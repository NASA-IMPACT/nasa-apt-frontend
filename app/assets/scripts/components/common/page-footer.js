import React from 'react';
import styled from 'styled-components';

import { glsp, themeVal } from '@devseed-ui/theme-provider';

const PageFoot = styled.footer`
  background-color: ${themeVal('color.baseAlphaC')};
  font-size: 0.875rem;
  line-height: 1rem;
  min-height: 0;
  overflow: hidden;
`;

const PageFootInner = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  padding: ${glsp(2, 2)};
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
