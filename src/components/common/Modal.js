import React from 'react';
import styled from 'styled-components/macro';
import { themeVal } from '../../styles/utils/general';

const ModalWrapper = styled.section`
  padding: ${themeVal('layout.space')};
  background-color: ${themeVal('color.shadow')};
  font-size: 0.875rem;
  line-height: 1rem;
`;

class Modal extends React.PureComponent {
  render() {
    return (
      <ModalWrapper>
        <p>This is a modal.</p>
      </ModalWrapper>
    );
  }
}

export default Modal;
