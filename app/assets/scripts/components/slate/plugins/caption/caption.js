import React from 'react';
import T from 'prop-types';
import { Node } from 'slate';
import { useReadOnly, useSelected } from 'slate-react';
import styled from 'styled-components';

const CaptionElement = styled.figcaption`
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: left;
  position: relative;
`;

const Placeholder = styled.span`
  position: absolute;
  pointer-events: none;
  user-select: none;
  left: 0;
  width: 100%;
  opacity: 0.48;
`;

export function Caption(props) {
  const { attributes, htmlAttributes, element, children } = props;
  const isSelected = useSelected();
  const readOnly = useReadOnly();

  const emptyCaption = !Node.string(element);

  const showPlaceholder = !readOnly && !isSelected && emptyCaption;

  // The current version of Slate has no way to render a placeholder on an
  // element. The best way is to create an element which is absolutely
  // positioned and has no interaction.
  return (
    <CaptionElement {...attributes} {...htmlAttributes} isEmpty={emptyCaption}>
      {showPlaceholder && (
        <Placeholder contentEditable={false}>Write a caption</Placeholder>
      )}
      {children}
    </CaptionElement>
  );
}

Caption.propTypes = {
  attributes: T.object,
  htmlAttributes: T.object,
  element: T.object,
  children: T.node,
  variant: T.string
};
