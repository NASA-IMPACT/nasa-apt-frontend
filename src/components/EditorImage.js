import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components/macro';

import Button from '../styles/button/button';

import { themeVal } from '../styles/utils/general';

const controlsVisibility = ({ isHidden }) => isHidden
  ? css`
    visibility: hidden;
    opacity: 0;
  `
  : css`
    visibility: visible;
    opacity: 1;
  `;

const EditorImageFigure = styled.figure`
  position: relative;
  display: block;
  text-align: center;
  /* padding is necessary to ensure that the box shadow is always visible */ 
  padding: 2px;

  ${({ isFocused }) => isFocused
    && css`
      box-shadow: inset 0 0 0 2px ${themeVal('color.primary')};
    `}

  figcaption {
    font-style: italic;
  }
`;

const EditorImageControls = styled.div`
  position: absolute;
  top: -2rem;
  left: 0;
  width: 100%;
  text-align: center;
  ${controlsVisibility}
  transition: visibility 0.12s ease 0s, opacity 0.24s ease 0s;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 20rem;
`;

function EditorImage(props) {
  const {
    node, isFocused, attributes, editor
  } = props;

  const src = node.data.get('src');
  const caption = node.data.get('caption');

  const editCaption = () => {
    const currentValue = node.data.get('caption');
    const newCaption = window.prompt('Insert caption', currentValue);
    if (newCaption !== null) {
      const data = {
        ...node.data.toObject(),
        caption: newCaption.trim()
      };
      editor.setNodeByKey(node.key, { data });
    }
  };

  return (
    <EditorImageFigure isFocused={isFocused} {...attributes}>
      <EditorImageControls isHidden={!isFocused}>
        <Button
          variation="base-raised-light"
          size="small"
          useIcon="pencil"
          onClick={() => editCaption()}
        >
          Caption
        </Button>
      </EditorImageControls>
      <Image src={src} />
      <figcaption>{caption}</figcaption>
    </EditorImageFigure>
  );
}

EditorImage.propTypes = {
  editor: T.object,
  node: T.object,
  attributes: T.object.isRequired,
  isFocused: T.bool,
};

export default EditorImage;
