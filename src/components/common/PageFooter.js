import React from 'react';
import styled from 'styled-components/macro';
import { themeVal } from '../../styles/utils/general';
import Constrainer from '../../styles/constrainer';

const PageFoot = styled.footer`
  padding: ${themeVal('layout.space')};
  background-color: ${themeVal('color.shadow')};
  font-size: 0.875rem;
  line-height: 1rem;
`;

const PageFootInner = styled(Constrainer)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;

  * {
    opacity: 0.64;
  }
`;

class PageFooter extends React.PureComponent {
  render() {
    return (
      <PageFoot>
        <PageFootInner>
          <p>2019 © NASA. All rights reserved</p>
        </PageFootInner>
      </PageFoot>
    );
  }
}

export default PageFooter;
