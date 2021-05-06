import set from 'lodash.set';

/**
 * Renders multiple contact roles in the form of (a, b & c)
 *
 * @param {array} roles List of roles
 * @returns string
 */
export const renderMultipleRoles = (roles) => {
  if (roles.length === 1) return roles[0];
  return `${roles.slice(0, -1).join(', ')} & ${roles[roles.length - 1]}`;
};

/**
 * Returns the contact's name
 *
 * @param {object} contact The contact
 * @param {object} opt Options for the formatting
 * @param {string} opt.full Whether or not the full name should be used.
 */
export const getContactName = (contact, { full } = {}) => {
  const { first_name, middle_name, last_name } = contact;
  if (full && middle_name) {
    return `${first_name} ${middle_name} ${last_name}`;
  }

  return `${first_name} ${last_name}`;
};

/**
 * Validates the contacts values and returns an object with errors. Ready to be
 * used with formik.
 *
 * @param {object} values Contact form values
 * @returns object
 */
export const validateContact = (values) => {
  let errors = {};

  if (!values.first_name.trim()) {
    errors.first_name = 'First name is required';
  }

  if (!values.last_name.trim()) {
    errors.last_name = 'Last name is required';
  }

  values.mechanisms.forEach((m, i) => {
    if (!m.mechanism_type.trim()) {
      set(errors, `mechanisms.${i}.mechanism_type`, 'Type is required');
    }
    if (!m.mechanism_value.trim()) {
      set(errors, `mechanisms.${i}.mechanism_value`, 'Value is required');
    }
  });

  return errors;
};
