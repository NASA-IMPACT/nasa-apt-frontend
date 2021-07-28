/**
 * Returns the document identifier key.
 * The document key is comprised of { id, version } where the id can be the
 * alias (if it exists) or the numeric id.
 *
 * @param {object} atbd The document for which to get the identifier key
 * @returns object { id: string|number, version: string }
 */
export default function getDocumentIdKey(atbd) {
  const { alias, id, version } = atbd || {};
  return { id: alias || id, version };
}
