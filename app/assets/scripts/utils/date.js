/**
 * Get the document updated date which is is the most recent between the version
 * updated at and the atbd updated at.
 *
 * @param {object|string} atbd The document, or the document's updated_at date.
 * @param {object|string} version The version object, or the version's
 * updated_at date.
 * @returns Date
 */
export const documentUpdatedDate = (atbd, version) => {
  const docDate = typeof atbd === 'object' ? atbd.last_updated_at : atbd;
  const versionDate =
    typeof version === 'object' ? version.last_updated_at : version;

  return new Date(
    Math.max(new Date(docDate).getTime(), new Date(versionDate).getTime())
  );
};
