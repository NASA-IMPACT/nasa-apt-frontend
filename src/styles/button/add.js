import styled, { css } from 'styled-components/macro';

import Button from './button';
import collecticon from '../collecticons';
import { glsp } from '../utils/theme-values';

const AddBtn = styled(Button).attrs({
  variation: 'primary-plain'
})`
  ${({ glspLeft }) => glspLeft && css`
    margin-left: ${glsp(glspLeft)};
  `}
  
  ::before {
    ${collecticon('plus')}
  }
`;

export default AddBtn;
