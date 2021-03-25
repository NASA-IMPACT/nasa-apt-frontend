/**
 * Creates the url to view a given ATBD document.
 *
 * @param {object} atbd The ATBD document
 * @param {string|number} version The version for which to generate the url.
 *    If "last", the last version in the version array is used
 *    If number, it is considered the version index to check in the versions array
 *    Otherwise is used as provided.
 */
export const atbdView = (atbd, version = 'last') => {
  const atbdId = atbd.alias || atbd.id;

  let v = '';
  if (version === 'last') {
    v = atbd.versions[atbd.versions.length - 1].version;
  } else if (typeof version === 'number') {
    v = atbd.versions[version].version;
  } else {
    v = version;
  }

  return `/documents/${atbdId}/${v}`;
};
