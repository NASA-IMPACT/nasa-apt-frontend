import React from 'react';
import { Route } from 'react-router';
import T from 'prop-types';

import { Can } from '.';
import Forbidden from './forbidden';
/**
 * Renders the given component if the user has the permission needed.
 *
 * @param {Component} component The component to render if allowed
 * @param {array<Sting, String>} permission The permission to check for. Tuple of action, target
 */
export default function AccessRoute({ component: C, permission, ...rest }) {
  const [action, target] = permission;

  return (
    <Route
      {...rest}
      render={(props) => (
        <Can do={action} on={target} passThrough>
          {(allow) => (allow ? <C {...props} /> : <Forbidden />)}
        </Can>
      )}
    />
  );
}

AccessRoute.propTypes = {
  component: T.any,
  permission: T.array
};
