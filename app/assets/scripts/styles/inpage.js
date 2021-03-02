import styled from 'styled-components';
import { themeVal, glsp, antialiased } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

import Constrainer from './constrainer';

export const Inpage = styled.section`
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr;
`;

export const InpageHeader = styled.header`
  ${antialiased()}
  background-color: ${themeVal('color.primary')};
  color: #fff;
  box-shadow: 0 0 0 0 ${themeVal('color.baseAlphaD')};
  z-index: 10;
  transition: box-shadow 0.32s ease 0s;
  clip-path: inset(0 0 -100vh 0);
`;

export const InpageHeaderInner = styled(Constrainer)`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  min-height: 5rem;
  padding-top: ${glsp()};
  padding-bottom: ${glsp()};
`;

export const InpageHeadline = styled.div`
  display: flex;
  flex-flow: column;
  min-width: 0;
`;

export const InpageActions = styled.div`
  margin-left: auto;
`;

export const InpageTitle = styled(Heading)`
  font-size: 1.25rem;
  line-height: 2.5rem;
  margin: 0;
`;

export const InpageBody = styled.div`
  display: grid;
  grid-gap: ${glsp(3)};
  padding: ${glsp(3, 0)};
`;
