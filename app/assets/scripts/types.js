import PropTypes from 'prop-types';

// Basic text child type
const TextChildType = PropTypes.shape({
  text: PropTypes.string.isRequired
});

// Type for a paragraph element with children
const ParagraphType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(TextChildType).isRequired
});

// Type for a variable node with children
export const VariableNodeType = PropTypes.shape({
  children: PropTypes.arrayOf(ParagraphType).isRequired
});

// Type for a variable item in the list
export const VariablePropType = PropTypes.shape({
  name: VariableNodeType.isRequired,
  long_name: VariableNodeType.isRequired,
  unit: VariableNodeType.isRequired
});
