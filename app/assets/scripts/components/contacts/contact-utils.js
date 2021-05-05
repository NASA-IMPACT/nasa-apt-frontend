export const renderMultipleRoles = (roles) => {
  if (roles.length === 1) return roles[0];
  return `${roles.slice(0, -1).join(', ')} and ${roles[roles.length - 1]}`;
};

export const getContactName = (contact, { full } = {}) => {
  const { first_name, middle_name, last_name } = contact;
  if (full && middle_name) {
    return `${first_name} ${middle_name} ${last_name}`;
  }

  return `${first_name} ${last_name}`;
};
