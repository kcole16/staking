import * as yup from 'yup';

export const resetPassEmailValidator = yup.object({
  email: yup.string().email('Invalid Email').required('Field is Required'),
});
