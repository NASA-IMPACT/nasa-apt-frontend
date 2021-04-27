import castArray from 'lodash.castarray';

/**
 * Traverse the Editor AST and returns all nodes of given type. When working
 * outside the Slate context we need can't use the Editor's methods to search
 * for nodes.
 *
 * @param {Object} document The field value in Slate editor format.
 * @param {string} type Node type
 */
export function nodeFromSlateDocument(document, type) {
  // Recursively get the subsections from a slate document.
  const getNodes = (items = [], type) => {
    return items.reduce((acc, i) => {
      if (!i) {
        return acc;
      } else if (i.type === type) {
        return acc.concat(i);
      } else if (i.children) {
        return acc.concat(getNodes(castArray(i.children), type));
      } else {
        return acc;
      }
    }, []);
  };

  return getNodes(castArray(document), type);
}
