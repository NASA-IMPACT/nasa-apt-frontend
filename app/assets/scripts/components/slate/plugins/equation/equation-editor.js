import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Node } from 'slate';
import { useReadOnly } from 'slate-react';
import { BlockMath } from 'react-katex';

const EquationInput = styled.p`
  text-align: center;
  font-family: monospace;
`;

export default function EquationEditor(props) {
  const { attributes, children, element } = props;
  const readOnly = useReadOnly();

  const latexEquation = Node.string(element);
  const equation = (
    <BlockMath math={latexEquation || '\\LaTeX~empty~equation'} />
  );

  return readOnly ? (
    <div {...attributes}>{equation}</div>
  ) : (
    <div {...attributes}>
      <EquationInput spellCheck={false}>{children}</EquationInput>
      <div contentEditable={false}>{equation}</div>
    </div>
  );
}

EquationEditor.propTypes = {
  attributes: T.object,
  children: T.node,
  element: T.object
};
