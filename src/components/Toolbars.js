import styled from 'styled-components/macro';
import { themeVal } from '../styles/utils/general';
import Button from '../styles/button/button';
import collecticon from '../styles/collecticons';

const baseAttrs = {
  variation: 'base-plain',
  size: 'large'
};

export const EquationBtn = styled(Button).attrs(baseAttrs)`
  ::before {
    ${collecticon('pi')}
  }
`;

export const TableBtn = styled(Button).attrs(baseAttrs)`
  ::before {
    ${collecticon('table')}
  }
`;

export const RemoveBtn = styled(Button).attrs({
  variation: 'base-raised-light',
  size: 'small'
})`
  ::before {
    ${collecticon('trash-bin')}
  }
`;

export const ULBtn = styled(Button).attrs(baseAttrs)`
  ::before {
    ${collecticon('list')}
  }
`;

export const OLBtn = styled(Button).attrs(baseAttrs)`
  ::before {
    ${collecticon('list-numbered')}
  }
`;

export const UndoBtn = styled(Button).attrs(baseAttrs)`
  ::before {
    ${collecticon('arrow-semi-spin-ccw')}
  }
`;

export const RedoBtn = styled(Button).attrs(baseAttrs)`
  ::before {
    ${collecticon('arrow-semi-spin-cw')}
  }
`;

export const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;

  :last-child:not(:first-child) {
    margin-left: auto;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background: ${themeVal('color.shadow')};
  border-top-left-radius: ${themeVal('shape.rounded')};
  border-top-right-radius: ${themeVal('shape.rounded')};
  padding: 0 3rem;

  ${ToolbarGroup}:not(:last-child) {
    margin-right: ${themeVal('layout.space')};
  }
`;

export const ToolbarLabel = styled.h5`
  color: ${themeVal('color.darkgray')};
  font-size: 0.875rem;
  font-weight: lighter;
  margin-right: ${themeVal('layout.space')};
  text-transform: uppercase;
`;
