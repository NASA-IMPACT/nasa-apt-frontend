module.exports = {
  addMinLength(schema) {
    const newSchema = Object.assign({}, schema);
    const { properties, required } = schema;
    newSchema.properties = Object.keys(properties).reduce(
      (accumulator, key) => {
        const newProperty = Object.assign({}, properties[key]);
        const { type, format } = newProperty;
        if (type === 'string' && required.includes(key)) {
          newProperty.minLength = 1;
        }

        // Make array types compatible with validator
        if (type === 'string' && format === 'ARRAY') {
          newProperty.type = 'array';
        }
        accumulator[key] = newProperty;
        return accumulator;
      },
      {}
    );
    return newSchema;
  },
  transformErrors(errors) {
    const transformedErrors = errors.reduce((accumulator, error) => {
      const { property, argument, message } = error;
      const reviewedMsg = {
        'does not meet minimum length of 1': 'Field can\'t be empty'
      }[message];

      if (property === 'instance') {
        accumulator[argument] = reviewedMsg;
      } else {
        const propertyName = property.split('.')[1];
        accumulator[propertyName] = reviewedMsg;
      }
      return accumulator;
    }, {});
    return transformedErrors;
  },
  transformInputType(type) {
    switch (type) {
      case 'integer':
        return 'number';
      case 'string':
        return 'text';
      default:
        return 'text';
    }
  },
  validateEmail(email) {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }
};
