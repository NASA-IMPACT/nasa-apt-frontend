import React from 'react';
import T from 'prop-types';

import { Link } from '../../styles/clean/link';

/**
 * Switches between a `a` and a `Link` depending on the url.
 */
const SmartLink = (props) => {
  const { to, ...rest } = props;

  return /^https?:\/\//.test(to) ? (
    <a href={to} {...rest} />
  ) : (
    <Link to={to} {...rest} />
  );
};

SmartLink.propTypes = {
  to: T.string
};

export default SmartLink;
