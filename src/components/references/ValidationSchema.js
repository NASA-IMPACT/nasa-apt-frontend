import * as Yup from 'yup';

export default Yup.object().shape({
  title: Yup.string().required('Title is required')
});
