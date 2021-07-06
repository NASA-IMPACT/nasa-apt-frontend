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

/**
 * Traverse the Editor AST and remove all nodes for which the filter function
 * returns true. When working outside the Slate context we need can't use the
 * Editor's methods to search for nodes.
 *
 * @param {Object} document The field value in Slate editor format.
 * @param {function} filterFn Filtering function.
 */
export function removeNodeFromSlateDocument(document, filterFn) {
  // Recursively get the subsections from a slate document.
  const filterNodes = (items = [], filterFn) => {
    return items.reduce((acc, i) => {
      const newItem = { ...i };

      if (i?.children) {
        newItem.children = filterNodes(castArray(i.children), filterFn);
      }

      return filterFn(newItem) ? acc : acc.concat(newItem);
    }, []);
  };

  const result = filterNodes(castArray(document), filterFn);
  // Return the same as input.
  return Array.isArray(document) ? result : result[0];
}
