import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components/macro';
import { themeVal } from '../../styles/utils/general';

const SearchHighlight = styled.mark`
  font-style: italic;
  background-color: ${themeVal('color.warning')};
`;

const TextHighlight = ({
  children,
  value,
  highlightEl,
  disabled
}) => {
  if (!value || disabled) return children;
  const El = highlightEl || SearchHighlight;

  return children
    .split(value)
    .reduce((acc, v, i) => [
      ...acc,
      // eslint-disable-next-line
      <El key={i}>{value}</El>,
      v
    ]);
};

TextHighlight.propTypes = {
  children: T.string.isRequired,
  disabled: T.bool,
  value: T.string,
  highlightEl: T.element
};

export default TextHighlight;
