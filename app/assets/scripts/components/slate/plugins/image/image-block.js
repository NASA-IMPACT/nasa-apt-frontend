import React from 'react';
import T from 'prop-types';

import DeletableBlock from '../common/deletable-block';

export default function ImageBlock(props) {
  const {
    attributes,
    htmlAttributes,
    children,
    className: classNameFromProps
  } = props;
  const className = [classNameFromProps, 'slate-image-block']
    .filter(Boolean)
    .join(', ');

  return (
    <DeletableBlock
      forwardedAs='figure'
      deleteAction='delete-image'
      className={className}
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
  className: T.string,
  children: T.node
};
