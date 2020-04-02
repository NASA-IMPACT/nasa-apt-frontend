import { rgba } from 'polished';

import { multiply } from './math';
import { themeVal, stylizeFunction } from './general';

/**
 * Returns the layout.space value form the theme multiplied by the
 * given multiplier.
 *
 * @param {number} m multiplier
 */
export const glsp = (m = 1) => multiply(themeVal('layout.space'), m);

/**
 * Polished rgba function but stylized.
 */
export const _rgba = stylizeFunction(rgba);
