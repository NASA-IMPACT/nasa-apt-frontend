import PropTypes from 'prop-types';

// Basic text child type
const textChildType = PropTypes.shape({
  text: PropTypes.string.isRequired
});

// Type for a paragraph element with children
const pChildType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(textChildType).isRequired
});

// Type for a variable node with children
const variableNodePropType = PropTypes.shape({
  children: PropTypes.arrayOf(pChildType).isRequired
});

// Type for a variable item in the list
export const variableNodeType = PropTypes.shape({
  name: variableNodePropType.isRequired,
  long_name: variableNodePropType.isRequired,
  unit: variableNodePropType.isRequired
});
