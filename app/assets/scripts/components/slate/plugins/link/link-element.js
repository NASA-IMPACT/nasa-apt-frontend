import React from 'react';
import T from 'prop-types';

import { isModKey, modKey } from '../common/utils';
import Tip from '../../../common/tooltip';

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
    <Tip
      title={modKey('mod + Click to open url')}
      position='bottom'
      followCursor
    >
      <a
        {...attributes}
        className={className}
        href={element.url}
        onClick={onClick}
        {...htmlAttributes}
      >
        {children}
      </a>
    </Tip>
  );
};

LinkElement.propTypes = {
  attributes: T.object,
  children: T.node,
  element: T.object,
  className: T.string,
  htmlAttributes: T.object
};
