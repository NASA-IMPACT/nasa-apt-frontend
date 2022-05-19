import React, { useCallback } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Node, Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { BlockMath } from 'react-katex';

const PreviewBody = styled.div`
  cursor: pointer;
`;

function EquationElement(props) {
  const editor = useSlate();
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

  return (
    <div {...attributes}>
      <PreviewBody
        onClick={handleClick}
        contentEditable={false}
        style={{ userSelect: 'none', cursor: 'pointer' }}
      >
        <BlockMath math={latexEquation || 'latex~empty~equation'} />
      </PreviewBody>
      <div>{children}</div>
    </div>
  );
}

EquationElement.propTypes = {
  element: T.object.isRequired,
  attributes: T.object.isRequired,
  children: T.object.isRequired
};

export default EquationElement;
