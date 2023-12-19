import * as yup from 'yup';

export const alphaTokenValidator = yup.object({
  token: yup
    .string()
    .matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, 'IP is invalid')
    .required('Required'),
});
