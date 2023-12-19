import * as yup from 'yup';

export const pagerDutyKeyValidator = yup.object({
  key: yup.string().required('Required'),
});
