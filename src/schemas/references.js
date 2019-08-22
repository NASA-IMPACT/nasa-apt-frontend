const Yup = require('yup');

module.exports = {
  validator: Yup.object().shape({
    title: Yup.string().required('Title is required'),
    year: Yup.number()
      .integer('Must be a valid year')
      .typeError('Must be a valid year')
  })
};
