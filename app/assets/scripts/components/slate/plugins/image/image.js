import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { useRichContext } from '../common/rich-context';
import { imageApiUrl } from '../../../../utils/url-creator';

const ImageWrapper = styled.div`
  & > * {
    margin-bottom: ${glsp()};
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

const ImageUploading = styled.div`
  background: ${themeVal('color.baseAlphaB')};
  padding: ${glsp(4, 2)};
  text-align: center;
`;

export default function Image(props) {
  const { attributes, htmlAttributes, children, element } = props;

  const { atbd } = useRichContext();

  return (
    <ImageWrapper {...attributes}>
      <div contentEditable={false}>
        {(element.uploading || element.uploading === 0) && (
          <ImageUploading>Uploading... {element.uploading}%</ImageUploading>
        )}
        {atbd && element.objectKey ? (
          <img
            alt='Image'
            {...htmlAttributes}
            src={imageApiUrl(atbd, element.objectKey)}
          />
        ) : (
          <p>Atbd context or objectKey is missing.</p>
        )}
      </div>
      {children}
    </ImageWrapper>
  );
}

Image.propTypes = {
  attributes: T.object,
  htmlAttributes: T.object,
  element: T.object,
  children: T.node
};
