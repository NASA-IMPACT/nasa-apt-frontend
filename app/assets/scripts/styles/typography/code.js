import styled from 'styled-components';

import { glsp, themeVal } from '@devseed-ui/theme-provider';

export const Kbd = styled.kbd`
  background: ${themeVal('color.baseAlphaD')};
  border-radius: ${themeVal('shape.rounded')};
  font-size: 1rem;
  line-height: 1.5rem;
  padding: ${glsp(0.125, 0.25)};

  & & {
    background: none;
    font-size: 100%;
    padding: 0;
  }
`;
