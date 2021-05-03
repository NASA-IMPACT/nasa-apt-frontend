import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { useReadOnly, useSelected, useSlate } from 'slate-react';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

const DeletableBlockElement = styled.div`
  position: relative;

  &::before {
    position: absolute;
    top: -${glsp(0.5)};
    right: -${glsp(0.5)};
    bottom: -${glsp(0.5)};
    left: -${glsp(0.5)};
    content: '';
    pointer-events: none;
    background: transparent;
    box-shadow: inset 0 0 0 1px transparent;
    border-radius: ${themeVal('shape.rounded')};
    transition: all 0.24s ease-in-out 0s;
  }

  ${({ isReadOnly }) =>
    !isReadOnly &&
    css`
      &:hover {
        ::before {
          box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaC')};
        }
      }
    `}

  ${({ isSelected, isReadOnly }) =>
    !isReadOnly &&
    isSelected &&
    css`
      &,
      &:hover {
        ::before {
          box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaE')};
        }
      }
    `}

${({ isDeleting }) =>
    isDeleting &&
    css`
      &::before {
        box-shadow: inset 0 0 0 1px ${themeVal('color.danger')};
      }
    `}

  & > * {
    margin-bottom: ${glsp()};
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

const DeletableBlockElementInner = styled.div`
  overflow-x: auto;
`;

const isDeleting = (editor, isSelected, deleteAction) => {
  if (isSelected && editor.toolbarEvent?.eventType === 'enter') {
    const { item } = editor.toolbarEvent;
    return item.id === deleteAction;
  }
  return false;
};

const DeletableBlock = React.forwardRef((props, ref) => {
  const { children, deleteAction, ...rest } = props;
  const editor = useSlate();
  const isSelected = useSelected();
  const readOnly = useReadOnly();

  return (
    <DeletableBlockElement
      ref={ref}
      isSelected={isSelected}
      isReadOnly={readOnly}
      isDeleting={isDeleting(editor, isSelected, deleteAction)}
      {...rest}
    >
      <DeletableBlockElementInner>{children}</DeletableBlockElementInner>
    </DeletableBlockElement>
  );
});

DeletableBlock.displayName = 'DeletableBlock';

DeletableBlock.propTypes = {
  children: T.node,
  deleteAction: T.string
};

export default DeletableBlock;
