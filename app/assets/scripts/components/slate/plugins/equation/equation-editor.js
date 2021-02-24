import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Node } from 'slate';
import { BlockMath } from 'react-katex';
import { glsp } from '@devseed-ui/theme-provider';

const EquationInput = styled.p`
  text-align: center;
  font-family: monospace;
`;

export default function EquationEditor(props) {
  const { attributes, children, element } = props;

  const latexEquation = Node.string(element);

  return (
    <div {...attributes}>
      <EquationInput>{children}</EquationInput>
      <div contentEditable={false}>
        <BlockMath math={latexEquation || '\\LaTeX~empty~equation'} />
      </div>
    </div>
  );
}

EquationEditor.propTypes = {
  attributes: T.object,
  children: T.node,
  element: T.object
};
