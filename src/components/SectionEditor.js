import React from 'react';
import propTypes from 'prop-types';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

const SectionEditor = (props) => {
  const latexClass = {
    backgroundColor: '#eee',
    textAlign: 'center'
  };
  const { children, node: { text } } = props;
  return (
    <div>
      <pre style={latexClass}>
        {children}
      </pre>
      <div contentEditable={false}>
        <BlockMath math={text} />
      </div>
    </div>
  );
};

SectionEditor.propTypes = {
  children: propTypes.array.isRequired,
  node: propTypes.object.isRequired
};
export default SectionEditor;
