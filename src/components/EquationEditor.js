import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components/macro';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

import { themeVal } from '../styles/utils/general';
import { glsp } from '../styles/utils/theme-values';

const EquationBlock = styled.div`
  > * {
    margin-bottom: 1.5rem;
  }

  pre {
    background-color: ${themeVal('color.lightgray')};
    text-align: center;
    padding: ${glsp(0.5)};
    white-space: initial;
  }
`;

const EquationEditor = (props) => {
  const { children, node: { text } } = props;
  return (
    <EquationBlock>
      <pre>
        {children}
      </pre>
      <div contentEditable={false}>
        <BlockMath math={text} />
      </div>
    </EquationBlock>
  );
};

EquationEditor.propTypes = {
  children: propTypes.array.isRequired,
  node: propTypes.object.isRequired
};

export default EquationEditor;
