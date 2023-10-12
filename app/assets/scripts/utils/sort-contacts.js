/**
 * Sorts an array of contacts based on whether they have the "Corresponding Author" role.
 * Corresponding authors appear first followed by other contacts
 * @param {Object} a - The first contact object to compare.
 * @param {Object} b - The second contact object to compare.
 * @returns {number} - Returns -1 if a has the "Corresponding Author" role and b does not, 1 if b has the "Corresponding Author" role and a does not, and 0 if both have or do not have the "Corresponding Author" role.
 */
export function sortContacts(a, b) {
  // Sort so that corresponding author roles are first
  const hasCorrespondingAuthorRole = (roles) => {
    return roles.includes('Corresponding Author');
  };
  const aHasCorrespondingAuthorRole = hasCorrespondingAuthorRole(a.roles);
  const bHasCorrespondingAuthorRole = hasCorrespondingAuthorRole(b.roles);
  return aHasCorrespondingAuthorRole === bHasCorrespondingAuthorRole
    ? 0
    : aHasCorrespondingAuthorRole
    ? -1
    : 1;
}
