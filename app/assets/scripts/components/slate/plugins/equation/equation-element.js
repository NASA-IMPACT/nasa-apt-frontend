import React, { useCallback } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Node } from 'slate';
import { useSlate } from 'slate-react';
import { BlockMath } from 'react-katex';

const PreviewBody = styled.div`
  cursor: pointer;
`;

function EquationElement(props) {
  const editor = useSlate();
  const { element } = props;
  const latexEquation = Node.string(element);

  const handleClick = useCallback(() => {
    editor.equationModal.show({ element });
  }, [editor, element]);

  return (
    <PreviewBody
      onClick={handleClick}
      contentEditable={false}
      style={{ userSelect: 'none', cursor: 'pointer' }}
    >
      <BlockMath math={latexEquation || 'latex~empty~equation'} />
    </PreviewBody>
  );
}

EquationElement.propTypes = {
  element: T.object.isRequired
};

export default EquationElement;
