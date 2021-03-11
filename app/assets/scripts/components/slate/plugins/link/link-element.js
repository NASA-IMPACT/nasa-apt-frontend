import React from 'react';
import T from 'prop-types';

import { isModKey, modKey } from '../common/utils';

export const LinkElement = ({
  attributes,
  children,
  element,
  className,
  htmlAttributes
}) => {
  const onClick = (e) => {
    // Follow the link on control click.
    if (isModKey(e)) {
      window.open(element.url, '_blank');
    }
  };

  return (
    <a
      {...attributes}
      className={className}
      href={element.url}
      onClick={onClick}
      data-tip={modKey('mod + Click to open url')}
      data-place='bottom'
      {...htmlAttributes}
    >
      {children}
    </a>
  );
};

LinkElement.propTypes = {
  attributes: T.object,
  children: T.node,
  element: T.object,
  className: T.string,
  htmlAttributes: T.object
};
