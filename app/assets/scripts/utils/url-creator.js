/**
 * Creates the url to view a given ATBD document.
 *
 * @param {object|string|number} atbd The ATBD document or an id to use
 * @param {string|number} version The version for which to generate the url.
 *    If "last", the last version in the version array is used
 *    If number, it is considered the version index to check in the versions array
 *    Otherwise is used as provided.
 */
export const atbdView = (atbd, version = 'last') => {
  if (typeof atbd !== 'object') {
    if (typeof version === 'number' || version === 'last') {
      throw new Error(
        `When using an \`atbdId\` directly the version must be specified as a string`
      );
    }
    return `/documents/${atbd}/${version}`;
  }

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

/**
 * Creates the url to view a given ATBD document.
 *
 * @param {object|string|number} atbd The ATBD document or an id to use
 * @param {string|number} version The version for which to generate the url.
 *    If "last", the last version in the version array is used
 *    If number, it is considered the version index to check in the versions array
 *    Otherwise is used as provided.
 */
export const atbdEdit = (atbd, version = 'last', step = null) => {
  const stepVal = step ? `/${step}` : '';

  return `${atbdView(atbd, version)}/edit${stepVal}`;
};

/**
 * Creates the url to view a given a contact.
 *
 * @param {string|number} contactId The contact id
 */
export const contactView = (contactId) => {
  return `contact/${contactId}`;
};

/**
 * Creates the url to view a given a contact in edit mode.
 *
 * @param {string|number} contactId The contact id
 */
export const contactEdit = (contactId) => {
  return `${contactView(contactId)}/edit`;
};
