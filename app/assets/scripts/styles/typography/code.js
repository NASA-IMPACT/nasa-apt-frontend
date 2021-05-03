import styled from 'styled-components';

import { glsp, themeVal } from '@devseed-ui/theme-provider';

export const Kbd = styled.kbd`
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: ${themeVal('type.base.weight')};
  color: ${themeVal('color.surface')};
  background: ${themeVal('color.baseAlphaF')};
  border-radius: ${themeVal('shape.rounded')};
  padding: ${glsp(0, 0.25)};

  & & {
    background: none;
    font-size: 100%;
    padding: 0;
  }
`;
