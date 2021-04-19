import { Node } from 'slate';

import { SUB_SECTION } from './plugins/subsection';
import { nodeFromSlateDocument } from './nodes-from-slate';

/**
 * The Slate editor fields allow the user to define a subsection block which
 * must be displayed in the Table Of Contents.
 * This function traverses the Editor AST and returns all section fields.
 *
 * @param {Object} document The field value in Slate editor format.
 */
export function subsectionsFromSlateDocument(document, baseId = '') {
  return nodeFromSlateDocument(document, SUB_SECTION).map((section) => ({
    id: (baseId ? `${baseId}--` : '') + section.id,
    label: Node.string(section)
  }));
}
