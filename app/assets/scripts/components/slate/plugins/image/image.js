import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { useRichContext } from '../common/rich-context';
import { imageApiUrl } from '../../../../utils/url-creator';

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;

  img {
    max-width: 100%;
  }
`;

const ImageUploading = styled.div`
  background: ${themeVal('color.baseAlphaB')};
  width: 100%;
  padding: ${glsp(4, 2)};
  text-align: center;
`;

export default function Image(props) {
  const { attributes, htmlAttributes, children, element } = props;

  const { atbd } = useRichContext();

  return (
    <div {...attributes}>
      <ImageWrapper contentEditable={false}>
        {element.uploading || element.uploading === 0 ? (
          <ImageUploading>Uploading... {element.uploading}%</ImageUploading>
        ) : atbd && element.objectKey ? (
          <img
            alt='Image'
            {...htmlAttributes}
            src={imageApiUrl(atbd, element.objectKey)}
          />
        ) : (
          <p>Atbd context or objectKey is missing.</p>
        )}
      </ImageWrapper>
      {children}
    </div>
  );
}

Image.propTypes = {
  attributes: T.object,
  htmlAttributes: T.object,
  element: T.object,
  children: T.node
};
