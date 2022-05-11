import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Node } from 'slate';
import { BlockMath } from 'react-katex';

const PreviewBody = styled.div`
  cursor: pointer;
`;

function EquationElement(props) {
  const { element } = props;
  const latexEquation = Node.string(element);

  return (
    <PreviewBody>
      <BlockMath math={latexEquation || 'latex~empty~equation'} />
    </PreviewBody>
  );
}

EquationElement.propTypes = {
  element: T.object.isRequired
};

export default EquationElement;
