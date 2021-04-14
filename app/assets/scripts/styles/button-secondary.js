import styled from 'styled-components';
import { Button, buttonVariation } from '@devseed-ui/button';

const ButtonSecondary = styled(Button)`
  ${(props) =>
    buttonVariation(props.theme.color.secondary, 'raised', 'dark', props)}
`;

export default ButtonSecondary;
