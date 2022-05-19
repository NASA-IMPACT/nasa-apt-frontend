import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Node } from 'slate';
import { ReactEditor, useEditor } from 'slate-react';
import { BlockMath } from 'react-katex';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { visuallyHidden } from '@devseed-ui/theme-provider';
import { headingAlt } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';
import { FormTextarea as BaseFormTextarea } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import { upsertEquation } from '.';

const EQUATION_PDF_THRESHOLD = 600;

const FormTextarea = styled(BaseFormTextarea)`
  font-family: monospace;
  width: 100%;
  height: 33px;
  min-height: 33px;
  transition: none;
`;

const EquationPreview = styled.aside`
  position: relative;
  background: ${themeVal('color.surface')};
  padding: ${glsp(1.5)};
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaD')};
  margin-top: ${glsp()};
  margin-bottom: ${glsp()};

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
    user-select: text;
  }

  .katex {
    display: inline-block;
  }
`;

export default function EquationEditor(props) {
  const { element } = props;
  const equation = element ? Node.string(element) : 'latex~empty~equation';
  const editor = useEditor();
  const equationBlockRef = useRef();
  const [isTooLong, setTooLong] = useState(false);
  const [latexEquation, setLatexEquation] = useState(equation);
  const textareaRef = useRef(null);

  useEffect(() => {
    const node = equationBlockRef.current;
    if (node) {
      // Get the katex node which is inline block and has real width.
      const katexNode = node.querySelector('.katex-display > .katex');
      setTooLong(katexNode?.offsetWidth > EQUATION_PDF_THRESHOLD);
    }
  }, [latexEquation]);

  useLayoutEffect(() => {
    textareaRef.current.style.height = '1px';
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = `${scrollHeight}px`;
  }, [latexEquation]);

  const handleInputChange = (e) => setLatexEquation(e.target.value);
  const handleSave = () => {
    const path = element && ReactEditor.findPath(editor, element);
    upsertEquation(editor, latexEquation, path);
  };

  return (
    <>
      <FormTextarea
        ref={textareaRef}
        id='equation'
        name='equation'
        value={latexEquation}
        onChange={handleInputChange}
        spellCheck={false}
      />
      <EquationPreview
        // Both contentEditable style and are needed for the click to work. See
        // more at:
        // https://github.com/ianstormtaylor/slate/issues/3421#issuecomment-591259117
        contentEditable={false}
        style={{ userSelect: 'none' }}
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
          <BlockMath math={latexEquation} />
        </EquationPreviewBody>
      </EquationPreview>
      <Button
        type='button'
        variation='primary-raised-dark'
        onClick={handleSave}
      >
        Save equation
      </Button>
    </>
  );
}

EquationEditor.propTypes = {
  element: T.object
};
