export const editorEmptyValue = {
  // Root level has no type and is the first and only child of the Editor.
  // This is needed for the block breaks to work.
  children: [
    {
      type: 'p',
      children: [{ text: '' }]
    }
  ]
};

export const editorErrorValue = {
  children: [
    {
      type: 'p',
      children: [
        {
          text: `This field's value was not valid and was replaced with this message to prevent the application from crashing.`,
          italic: true
        }
      ]
    }
  ]
};

/**
 * Validate a slate value following the constraints:
 * Each Node, must be of either Text or Element.
 * A Text node is a object with a text key: { text: 'some' }
 * An Element node is an object with 1 or more children: { children: [Text|Element] }
 * @param {any} value Value to validate
 */
export const validateSlateValue = (value) => {
  if (!value) {
    return false;
  }
  // if is an array, length must be greater than 0 and validate each entry.
  if (Array.isArray(value)) {
    return value.length && value.every((child) => validateSlateValue(child));
  }
  // Text node. Valid.
  if (value.text || value.text === '') {
    return true;
  }
  // Has children. Validate them.
  if (value.children) {
    return validateSlateValue(value.children);
  }
  // Anything else is not valid.
  return false;
};
