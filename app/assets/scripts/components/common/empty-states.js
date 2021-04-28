import styled from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';

export const EmptyBox = styled.div`
  background-color: ${themeVal('color.baseAlphaB')};
  border-radius: ${themeVal('shape.rounded')};
  border: ${themeVal('layout.border')} solid ${themeVal('color.baseAlphaC')};
  padding: ${glsp()};
  text-align: center;

  & > * {
    margin-bottom: ${glsp(0.5)};
  }
  & > *:last-child {
    margin-bottom: 0;
  }
`;

export const EmptyHub = styled(EmptyBox)`
  grid-column: content-3 / span 8;
  align-self: center;
  padding: ${glsp(2)};

  & > * {
    margin-bottom: ${glsp()};
  }
`;
