import * as yup from 'yup';

export const resetPassValidator = yup.object({
  newPassword: yup
    .string()
    .min(8, 'Password must contain at least 8 symbols')
    .required('Field is Required'),
  confirmPassword: yup
    .string()
    .min(8, 'Password must contain at least 8 symbols')
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});
