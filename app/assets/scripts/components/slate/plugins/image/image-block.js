import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { useReadOnly, useSelected } from 'slate-react';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

const ImageBlockElement = styled.figure`
  padding: ${glsp(0.5)};
  transition: box-shadow 0.32s;
  box-shadow: 0 0 0 1px transparent;
  overflow-x: auto;

  ${({ isReadOnly }) =>
    !isReadOnly &&
    css`
      ${({ isSelected }) => isSelected && '&,'}
      &:hover {
        box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaD')};
      }
    `}
`;

export default function ImageBlock(props) {
  const { attributes, htmlAttributes, children } = props;
  const isSelected = useSelected();
  const readOnly = useReadOnly();

  return (
    <ImageBlockElement
      {...attributes}
      {...htmlAttributes}
      isSelected={isSelected}
      isReadOnly={readOnly}
    >
      {children}
    </ImageBlockElement>
  );
}

ImageBlock.propTypes = {
  attributes: T.object,
  htmlAttributes: T.object,
  element: T.object,
  children: T.node
};
