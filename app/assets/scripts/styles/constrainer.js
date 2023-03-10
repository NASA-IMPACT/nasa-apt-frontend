import styled from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';

const Constrainer = styled.div`
  padding-left: ${glsp(themeVal('layout.gap.large'))};
  padding-right: ${glsp(themeVal('layout.gap.large'))};
  margin: 0 auto;
  width: 100%;
  max-width: ${themeVal('layout.max')};
`;

export default Constrainer;
