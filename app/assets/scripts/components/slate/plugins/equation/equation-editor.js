import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Node } from 'slate';
import { useReadOnly } from 'slate-react';
import { BlockMath } from 'react-katex';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { visuallyHidden } from '@devseed-ui/theme-provider';
import { headingAlt } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';

const EquationInput = styled.p`
  font-family: monospace;
`;

const EquationPreview = styled.aside`
  position: relative;
  background: ${themeVal('color.surface')};
  padding: ${glsp(1.5)};
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaD')};
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
    transform: translateY(0.35rem);
    pointer-events: none;
  }
`;

const EquationPreviewTitle = styled.h6`
  ${headingAlt()}
  font-size: 0.75rem;
  line-height: 1rem;
  margin: ${glsp(-1, 0, 0, -1)};

  span {
    ${visuallyHidden()}
  }
`;

const EquationPreviewBody = styled.div`
  .katex-display {
    margin: 0;
  }
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
      <EquationInput spellCheck={false}>
        <code>{children}</code>
      </EquationInput>
      <EquationPreview contentEditable={false}>
        <EquationPreviewTitle>
          <span>Equation</span> preview
        </EquationPreviewTitle>
        <EquationPreviewBody>{equation}</EquationPreviewBody>
      </EquationPreview>
    </div>
  );
}

EquationEditor.propTypes = {
  attributes: T.object,
  children: T.node,
  element: T.object
};
