import * as yup from 'yup';

export const monitoredValidator = yup.object({
  // mimir: yup
  //   .string()
  //   .matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, 'IP is invalid')
  //   .required('Required'),
  // loki: yup
  //   .string()
  //   .matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, 'IP is invalid')
  //   .required('Required'),
  email: yup.string().email('Invalid Email').required('Field is Required'),
  password: yup
    .string()
    .min(8, 'Password must contain at least 8 symbols')
    .required('Field is Required'),
});
