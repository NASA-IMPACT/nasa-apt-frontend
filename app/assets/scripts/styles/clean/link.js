import { Link as Link$, NavLink as NavLink$ } from 'react-router-dom';

import { filterComponentProps } from '../utils/general';

// See documentation of filterComponentProp as to why this is
const propsToFilter = [
  'variation',
  'size',
  'hideText',
  'useIcon',
  'active',
  'visuallyDisabled'
];

export const Link = filterComponentProps(Link$, propsToFilter);

export const NavLink = filterComponentProps(NavLink$, propsToFilter);
