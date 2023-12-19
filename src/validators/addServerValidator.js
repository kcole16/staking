import * as yup from 'yup';

export const addServerValidator = yup.object({
  server: yup.object({
    id: yup.string().required('Required'),
    Provider: yup
      .string()
      .oneOf(['OVH', 'Latitude', 'Other'])
      .required('Required'),
    Type: yup.string().required('Required'),
    IPv4: yup
      .string()
      .matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, 'IP is invalid')
      .required('Required'),
    CIDR: yup.number().required('Required'),
    Gateway: yup
      .string()
      .matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, 'Gateway is invalid')
      .required('Required'),
    Username: yup.string().required('Required'),
    disks: yup.string().oneOf(['1', '2', '3']).required('Required'),
  }),
  key: yup.object({
    value: yup
      .string()
      .matches(
        /^(?:ssh-rsa AAAAB3NzaC1yc2|ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNT|ecdsa-sha2-nistp384 AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzOD|ecdsa-sha2-nistp521 AAAAE2VjZHNhLXNoYTItbmlzdHA1MjEAAAAIbmlzdHA1Mj|ssh-ed25519 AAAAC3NzaC1lZDI1NTE5|ssh-dss AAAAB3NzaC1kc3)[0-9A-Za-z+/].*\n?$/,
        'Public Key is invalid'
      )
      .required('Required'),
    name: yup.string().required('Required'),
  }),
});
