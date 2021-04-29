import React from 'react';
import T from 'prop-types';
import { Node } from 'slate';
import { useSelected } from 'slate-react';
import styled, { css } from 'styled-components';

const CaptionElement = styled.figcaption`
  font-size: 0.875rem;
  text-align: center;
  position: relative;

  ${({ emptyCaption }) =>
    emptyCaption &&
    css`
      color: red;
    `}
`;

const Placeholder = styled.span`
  position: absolute;
  pointer-events: none;
  user-select: none;
  left: 0;
  width: 100%;
  opacity: 0.64;
`;

export function Caption(props) {
  const { attributes, htmlAttributes, element, children } = props;
  const isSelected = useSelected();

  const emptyCaption = !Node.string(element);

  // The current version of Slate has no way to render a placeholder on an
  // element. The best way is to create an element which is absolutely
  // positioned and has no interaction.
  return (
    <CaptionElement {...attributes} {...htmlAttributes} isEmpty={emptyCaption}>
      {!isSelected && emptyCaption && (
        <Placeholder contentEditable={false}>
          Write a caption... (optional)
        </Placeholder>
      )}
      {children}
    </CaptionElement>
  );
}

Caption.propTypes = {
  attributes: T.object,
  htmlAttributes: T.object,
  element: T.object,
  children: T.node
};
