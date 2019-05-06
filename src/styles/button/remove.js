import styled from 'styled-components';
import collecticon from '../collecticons';
import Button from './button';

const RemoveButton = styled(Button)`
  ::before {
    ${collecticon('trash-bin')}
  }
`;

export default RemoveButton;