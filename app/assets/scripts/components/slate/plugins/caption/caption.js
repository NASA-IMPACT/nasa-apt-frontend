import React from 'react';
import T from 'prop-types';
import { Node } from 'slate';
import { useReadOnly, useSelected } from 'slate-react';
import styled from 'styled-components';

import { NumberingContext } from '../../../../context/numbering';
import { IMAGE_BLOCK, TABLE_BLOCK } from '../constants';

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
  const id = JSON.stringify(element);
  const { parent } = element;

  const emptyCaption = !Node.string(element);
  const numberingContext = React.useContext(NumberingContext);

  const showPlaceholder = !readOnly && !isSelected && emptyCaption;

  React.useEffect(() => {
    if (numberingContext && !showPlaceholder && id) {
      if (parent === TABLE_BLOCK) {
        numberingContext.registerTable(id);
      } else if (parent === IMAGE_BLOCK) {
        numberingContext.registerImage(id);
      }
    }
  }, [numberingContext, showPlaceholder, id, parent]);

  const numbering = React.useMemo(() => {
    if (!numberingContext) {
      return null;
    }

    if (parent === TABLE_BLOCK) {
      return numberingContext.getTableNumbering(id);
    }

    if (parent === IMAGE_BLOCK) {
      return numberingContext.getImageNumbering(id);
    }

    return null;
  }, [numberingContext, parent, id]);

  // if (readOnly && emptyCaption) return null;

  // The current version of Slate has no way to render a placeholder on an
  // element. The best way is to create an element which is absolutely
  // positioned and has no interaction.
  return (
    <CaptionElement {...attributes} {...htmlAttributes} isEmpty={emptyCaption}>
      {showPlaceholder && (
        <Placeholder contentEditable={false}>Write a caption</Placeholder>
      )}
      {numbering}
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
