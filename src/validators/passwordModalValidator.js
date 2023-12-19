import * as yup from 'yup';

export const passModalValidator = yup.object({
  password: yup
    .string()
    .min(8, 'Password must contain at least 8 symbols')
    .required('Field is Required'),
});
