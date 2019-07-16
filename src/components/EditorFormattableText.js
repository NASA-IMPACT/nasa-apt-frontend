import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

const TextContainer = styled.div`
  position: relative;

  > * {
    margin-bottom: 1.5rem;
  }
`;

export function FormattableText(props) {
  const {
    attributes,
    children,
  } = props;

  return (
    <TextContainer>
      <p {...attributes}>{children}</p>
    </TextContainer>
  );
}

FormattableText.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  hasSelection: PropTypes.bool,
  isFocused: PropTypes.bool,
  toggleMark: PropTypes.func.isRequired,
  insertLink: PropTypes.func.isRequired
};

export default FormattableText;
