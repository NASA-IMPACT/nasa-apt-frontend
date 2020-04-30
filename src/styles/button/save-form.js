import styled from 'styled-components/macro';
import Button from './button';

const SaveFormButton = styled(Button).attrs({
  variation: 'primary-raised-light',
  size: 'large',
  type: 'submit'
})`
  justify-self: center;
  min-width: 15rem;
`;

export default SaveFormButton;
