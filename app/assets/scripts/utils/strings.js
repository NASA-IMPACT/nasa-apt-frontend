const data = require('../strings.json');
import get from 'lodash.get';

/**
 * Get the string at the given path from the strings file.
 *
 * @param {string} path Path to the path.
 */
export function formString(path) {
  const shouldError = process.env.NODE_ENV !== 'production';
  const v = get(data, path, null);
  return v === null && shouldError
    ? `Error: missing value for \`${path}\`.`
    : v;
}
