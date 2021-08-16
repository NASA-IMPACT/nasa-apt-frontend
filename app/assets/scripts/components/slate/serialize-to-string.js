import { Text } from 'slate';

import { IMAGE } from './plugins/image';
import { TABLE } from './plugins/table';

/**
 * Converts a slate document to string taking into account images and empty
 * tables. An image has no text content so it was being discarded when using the
 * regular "Node.string(n)", so instead of checking for the "text" we look at
 * the objectKey.
 *
 * @param {object} node The node to serialize
 * @returns string
 */
const serializeToString = (node) => {
  if (!node) return '';

  if (Text.isText(node)) {
    return node.text.trim();
  }

  const children = node.children.map((n) => serializeToString(n)).join('');

  switch (node.type) {
    case IMAGE:
      return node.objectKey;
    case TABLE:
      return '<table>';
    default:
      return children;
  }
};

export default serializeToString;
