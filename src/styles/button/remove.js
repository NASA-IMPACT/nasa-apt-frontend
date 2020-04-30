import styled from 'styled-components/macro';
import collecticon from '../collecticons';
import Button from './button';

const RemoveButton = styled(Button).attrs({
  variation: 'danger-plain',
  size: 'small',
  hideText: true
})`
  ::before {
    ${collecticon('trash-bin')}
  }
`;

export default RemoveButton;
