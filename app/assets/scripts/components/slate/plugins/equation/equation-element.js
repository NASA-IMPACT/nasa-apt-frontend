import React, { useCallback, useContext, useEffect } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { Node, Transforms } from 'slate';
import { ReactEditor, useSelected, useSlate, useReadOnly } from 'slate-react';
import { BlockMath, InlineMath } from 'react-katex';

import { themeVal, rgba } from '@devseed-ui/theme-provider';

import { isInlineEquation } from '.';
import { NumberingContext } from '../../../../context/numbering';

const EquationReadOnly = styled.span`
  display: ${({ isInline }) => (isInline ? 'inline-flex' : 'flex')};
  align-items: center;
`;

const Equation = styled.span`
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
  const equationPath = JSON.stringify(ReactEditor.findPath(editor, element));
  const readOnly = useReadOnly();

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
  const numberingContext = useContext(NumberingContext);

  useEffect(() => {
    if (numberingContext && !isInline) {
      numberingContext.registerEquation(equationPath);
    }
  }, [numberingContext, isInline, equationPath]);

  const returnElement = React.useMemo(() => {
    if (readOnly) {
      if (isInline) {
        return (
          <EquationReadOnly isInline={isInline}>
            <MathElement math={latexEquation || 'latex~empty~equation'} />
          </EquationReadOnly>
        );
      }

      return (
        <EquationReadOnly
          isInline={isInline}
          className='slate-equation-element'
        >
          <span className='katex-equation-wrapper'>
            <MathElement math={latexEquation || 'latex~empty~equation'} />
          </span>
          {!isInline && numberingContext && (
            <span>{numberingContext.getEquationNumbering(equationPath)}</span>
          )}
          {!isInline && <span className='equation-number' />}
        </EquationReadOnly>
      );
    }

    return (
      <Equation
        onClick={handleClick}
        contentEditable={false}
        style={{ userSelect: 'none' }}
        inFocus={isSelected}
        isInline={isInline}
        {...attributes}
      >
        <MathElement math={latexEquation || 'latex~empty~equation'} />
        {children}
      </Equation>
    );
  }, [
    attributes,
    children,
    handleClick,
    isInline,
    isSelected,
    latexEquation,
    equationPath,
    numberingContext,
    readOnly
  ]);

  return returnElement;
}

EquationElement.propTypes = {
  element: T.object.isRequired,
  attributes: T.object.isRequired,
  children: T.object.isRequired
};

export default EquationElement;
