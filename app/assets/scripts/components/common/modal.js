import styled, { createGlobalStyle } from 'styled-components';
import { glsp, themeVal, rgba } from '@devseed-ui/theme-provider';

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${themeVal('color.baseAlphaD')};
  z-index: 1111;
`;

export const BodyUnscrollable = createGlobalStyle`
  ${({ revealed }) =>
    revealed &&
    `
    body {
      overflow-y: hidden;
    }
  `}
`;

export const Modal = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${glsp(2)};
  width: 100%;
  max-width: 96vw;
  background-color: #fff;
  padding: ${glsp(1.5, themeVal('layout.gap.medium'))};
  border-radius: ${themeVal('shape.rounded')};
  overflow: auto;
  box-shadow: 0 0 32px 2px ${rgba(themeVal('type.base.color'), 0.04)},
    0 16px 48px -16px ${rgba(themeVal('type.base.color'), 0.12)};
`;

export const ModalContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${glsp(1.5)};
  overflow: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${glsp(1)};
`;
