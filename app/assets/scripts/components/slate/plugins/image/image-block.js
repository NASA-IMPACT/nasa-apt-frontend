import React from 'react';
import T from 'prop-types';

import DeletableBlock from '../common/deletable-block';

export default function ImageBlock(props) {
  const { attributes, htmlAttributes, children } = props;

  return (
    <DeletableBlock
      forwardedAs='figure'
      deleteAction='delete-image'
      {...attributes}
      {...htmlAttributes}
    >
      {children}
    </DeletableBlock>
  );
}

ImageBlock.propTypes = {
  attributes: T.object,
  htmlAttributes: T.object,
  element: T.object,
  children: T.node
};
