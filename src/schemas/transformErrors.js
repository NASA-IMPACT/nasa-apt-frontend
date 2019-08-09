export default function transformErrors(errors) {
  const transformedErrors = errors.reduce((accumulator, error) => {
    const { property, argument, message } = error;
    const reviewedMsg = ({
      'does not meet minimum length of 1': 'Field can\'t be empty'
    })[message];

    if (property === 'instance') {
      accumulator[argument] = reviewedMsg;
    } else {
      const propertyName = property.split('.')[1];
      accumulator[propertyName] = reviewedMsg;
    }
    return accumulator;
  }, {});
  return transformedErrors;
}
