import React, { useCallback, useEffect, useRef, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Editor, Node, Transforms } from 'slate';
import { ReactEditor, useEditor, useReadOnly } from 'slate-react';
import { BlockMath } from 'react-katex';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { visuallyHidden } from '@devseed-ui/theme-provider';
import { headingAlt } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';

import DeletableBlock from '../common/deletable-block';

const EQUATION_PDF_THRESHOLD = 600;

const EquationInput = styled.p`
  font-family: monospace;
`;

const EquationPreview = styled.aside`
  position: relative;
  background: ${themeVal('color.surface')};
  padding: ${glsp(1.5)};
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaD')};
  margin-top: ${glsp()};

  &::before {
    ${collecticon('triangle-up')}
    position: absolute;
    bottom: 100%;
    left: 1rem;
    z-index: 10;
    color: ${themeVal('color.surface')};
    text-shadow: 0 -1.5px 0 ${themeVal('color.baseAlphaD')};
    width: 1rem;
    font-size: 1rem;
    line-height: 1;
    text-align: center;
    transform: translateY(0.45rem);
    pointer-events: none;
  }
`;

const EquationPreviewHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr minmax(min-content, max-content);
  grid-gap: ${glsp()};
  margin: ${glsp(-1, -1, 0, -1)};
`;

const EquationPreviewTitle = styled.h6`
  ${headingAlt()}
  font-size: 0.75rem;
  line-height: 1rem;
  margin: 0;

  span {
    ${visuallyHidden()}
  }
`;

const EquationPreviewSubtitle = styled.p`
  font-size: 0.875rem;
  line-height: 1rem;
  color: ${themeVal('color.danger')};
`;

const EquationPreviewBody = styled.div`
  text-align: center;
  color: ${themeVal('color.danger')};
  overflow-x: auto;
  overflow-y: hidden;
  padding: ${glsp(0.5, 0, 1, 0)};
  margin-bottom: ${glsp(-1)};

  .katex-display {
    margin: 0;
    color: ${themeVal('type.base.color')};
  }
`;

export default function EquationEditor(props) {
  const { attributes, children, element } = props;
  const readOnly = useReadOnly();
  const editor = useEditor();
  const equationBlockRef = useRef();
  const [isTooLong, setTooLong] = useState(false);

  const latexEquation = Node.string(element);
  const equation = (
    <BlockMath math={latexEquation || '\\LaTeX~empty~equation'} />
  );

  useEffect(() => {
    const node = equationBlockRef.current;
    if (node) {
      // Get the katex node which is inline block and has real width.
      const katexNode = node.querySelector('.katex-display > .katex');
      setTooLong(katexNode?.offsetWidth > EQUATION_PDF_THRESHOLD);
    }
  }, [latexEquation]);

  // Focus equation input when user clicks the preview.
  const onEquationPreviewClick = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.select(editor, Editor.end(editor, path));
  }, [editor, element]);

  return readOnly ? (
    <EquationPreviewBody {...attributes}>{equation}</EquationPreviewBody>
  ) : (
    <DeletableBlock deleteAction='delete-equation' {...attributes}>
      <EquationInput spellCheck={false}>
        <code>{children}</code>
      </EquationInput>
      <EquationPreview
        // Both contentEditable style and are needed for the click to work. See
        // more at:
        // https://github.com/ianstormtaylor/slate/issues/3421#issuecomment-591259117
        contentEditable={false}
        style={{ userSelect: 'none' }}
        onClick={onEquationPreviewClick}
      >
        <EquationPreviewHeader>
          <EquationPreviewTitle>
            <span>Equation</span> preview
          </EquationPreviewTitle>
          {isTooLong && (
            <EquationPreviewSubtitle>
              Equation may be too long for PDF. Consider breaking it.
            </EquationPreviewSubtitle>
          )}
        </EquationPreviewHeader>
        <EquationPreviewBody ref={equationBlockRef}>
          {equation}
        </EquationPreviewBody>
      </EquationPreview>
    </DeletableBlock>
  );
}

EquationEditor.propTypes = {
  attributes: T.object,
  children: T.node,
  element: T.object
};
