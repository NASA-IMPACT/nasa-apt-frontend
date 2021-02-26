import { rgba } from 'polished';
import { css } from 'styled-components';

import { multiply } from './math';
import { themeVal, stylizeFunction } from './general';

/**
 * Returns the layout.space value form the theme multiplied by the
 * given multiplier.
 *
 * @param {number} m multiplier
 */
export const glsp = (...args_) => {
  const args = args_.length ? args_ : [1];
  const fns = args.map(m => multiply(themeVal('layout.space'), m));
  // If the there's only one argument return in value format to be used by
  // other methods that need this to resolve to a number.
  if (fns.length === 1) return fns[0];

  const spaces = Array(args.length - 1).fill(' ');
  return css(['', ...spaces, ''], ...fns);
};

/**
 * Polished rgba function but stylized.
 */
export const _rgba = stylizeFunction(rgba);
