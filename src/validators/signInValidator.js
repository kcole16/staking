import * as yup from 'yup';

export const signInValidator = yup.object({
  email: yup.string().email('Invalid Email').required('Field is Required'),
  password: yup
    .string()
    .min(8, 'Password must contain at least 8 symbols')
    .required('Field is Required'),
});
