import { Node } from 'slate';
import castArray from 'lodash.castarray';

import { SUB_SECTION } from './plugins/subsection';

/**
 * The Slate editor fields allow the user to define a subsection block which
 * must be displayed in the Table Of Contents.
 * This function traverses the Editor AST and returns all section fields.
 *
 * @param {Object} document The field value in Slate editor format.
 */
export function subsectionsFromSlateDocument(document, baseId = '') {
  // Recursively get the subsections from a slate document.
  const extractSection = (items = []) => {
    return items.reduce((acc, i) => {
      if (!i) {
        return acc;
      } else if (i.type === SUB_SECTION) {
        return acc.concat(i);
      } else if (i.children) {
        return acc.concat(extractSection(castArray(i.children)));
      } else {
        return acc;
      }
    }, []);
  };

  const sections = extractSection(castArray(document));

  return sections.map((section) => ({
    id: (baseId ? `${baseId}--` : '') + section.id,
    label: Node.string(section)
  }));
}
