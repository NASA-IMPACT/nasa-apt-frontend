import React from 'react';

/**
 * Tries to render the given function falling back to the children if it is not
 * set.
 *
 * @param {function} fn The render function to try to run
 * @param {node} children The fallback if the render function is not set
 * @prop {any} rest Remaining props are passed to the function
 */
export default function Try(props) {
  const { fn: F, children, ...rest } = props;
  if (React.isValidElement(F)) {
    return <F {...props} />;
  } else if (typeof F === 'function') {
    return F(rest);
  } else {
    return children || null;
  }
}
