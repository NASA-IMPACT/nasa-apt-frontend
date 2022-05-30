import React, { useCallback } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { Node, Transforms } from 'slate';
import { ReactEditor, useSelected, useSlate } from 'slate-react';
import { BlockMath, InlineMath } from 'react-katex';

import { themeVal, rgba } from '@devseed-ui/theme-provider';

import { isInlineEquation } from '.';

const PreviewBody = styled.span`
  cursor: pointer;
  border: 1px solid;
  border-radius: ${themeVal('shape.rounded')};
  transition: border-color 0.24s ease 0s;

  display: ${({ isInline }) => (isInline ? 'inline' : 'block')};

  ${({ inFocus }) =>
    inFocus
      ? css`
          border-color: ${rgba(themeVal('color.primary'), 0.48)};
        `
      : css`
          border-color: transparent;

          &:hover {
            border-color: ${rgba(themeVal('color.primary'), 0.24)};
          }
        `}
`;

function EquationElement(props) {
  const editor = useSlate();
  const isSelected = useSelected();
  const { element, attributes, children } = props;
  const latexEquation = Node.string(element);

  const handleClick = useCallback(() => {
    const path = element && ReactEditor.findPath(editor, element);
    const offset = element.children[0].text.length;

    Transforms.select(editor, {
      anchor: { path, offset: 0 },
      focus: { path, offset }
    });
  }, [editor, element]);

  const isInline = isInlineEquation(element);
  const MathElement = isInline ? InlineMath : BlockMath;

  return (
    <PreviewBody
      onClick={handleClick}
      contentEditable={false}
      style={{ userSelect: 'none' }}
      inFocus={isSelected}
      isInline={isInline}
      {...attributes}
    >
      <MathElement math={latexEquation || 'latex~empty~equation'} />
      {children}
    </PreviewBody>
  );
}

EquationElement.propTypes = {
  element: T.object.isRequired,
  attributes: T.object.isRequired,
  children: T.object.isRequired
};

export default EquationElement;
