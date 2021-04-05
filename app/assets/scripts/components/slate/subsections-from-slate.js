import { Node } from 'slate';

import { hugeDoc } from './plugins/debug-editor/dummy';
import { SUB_SECTION } from './plugins/subsection';

/**
 * The Slate editor fields allow the user to define a subsection block which
 * must be displayed in the Table Of Contents.
 * This function traverses the Editor AST and returns all section fields.
 *
 * @param {Object} document The field value in Slate editor format.
 */
export function subsectionsFromSlateDocument(document) {
  // Recursively get the subsections from a slate document.
  const extractSection = (items = []) => {
    return items.reduce((acc, i) => {
      if (i.type === SUB_SECTION) {
        return acc.concat(i);
      } else if (i.children) {
        return acc.concat(extractSection(i.children));
      } else {
        return acc;
      }
    }, []);
  };

  const sections = extractSection(hugeDoc);

  return sections.map((section) => ({
    id: 'find-an-id',
    label: Node.string(section)
  }));
}
