import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

export const DropHeader = styled.header`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: ${glsp(0, themeVal('layout.gap.xsmall'))};
  box-shadow: 0 1px 0 0 ${themeVal('color.baseAlphaC')};
  margin: ${glsp(-1, -1, 1, -1)};
  padding: ${glsp()};
`;

export const DropHeadline = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  > * {
    margin-bottom: 0;
  }
`;

export const DropActions = styled.div`
  display: flex;
  margin-left: auto;
`;
