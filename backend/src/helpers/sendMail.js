import { SendMailClient } from 'zeptomail';
import { secrets } from './secrets.js';

const requiredVariables = [
  'SITE_URL',
  'ZEPTOMAIL_BOUNCE_ADDRESS',
  'ZEPTOMAIL_WELCOME_TEMPLATE_KEY',
  'ZEPTOMAIL_FORGOT_PASSWORD_TEMPLATE_KEY',
  'ZEPTOMAIL_ORDER2KUUTAMO_TEMPLATE_KEY',
  'ZEPTOMAIL_ORDER2CUSTOMER_TEMPLATE_KEY',
  'ZEPTOMAIL_ORDER2KUUTAMO_EMAIL',
  'ZEPTOMAIL_SENDER_ADDRESS',
  'ZEPTOMAIL_SENDER_NAME',
  'ZEPTOMAIL_BOUNCE_ADDRESS',
];
requiredVariables.forEach((variable) => {
  if (!process.env[variable]) {
    console.error(`Environment variable ${variable} is not set`);
    process.exit(1);
  }
});

export async function sendMailWithTemplate(to, template_key, params) {
  const url = 'api.zeptomail.eu/';

  let client = new SendMailClient({ url, token: secrets.zeptomail_token });
  client
    .sendMailWithTemplate({
      template_key,
      bounce_address: process.env.ZEPTOMAIL_BOUNCE_ADDRESS,
      from: {
        address: process.env.ZEPTOMAIL_SENDER_ADDRESS,
        name: process.env.ZEPTOMAIL_SENDER_NAME,
      },
      to: [
        {
          email_address: {
            address: to,
          },
        },
      ],
      merge_info: params,
    })
    .then((resp) => console.log('success', resp))
    .catch((error) => console.log('error', error));
}

export async function sendMail(to, subject, htmlbody) {
  const url = 'api.zeptomail.eu/';

  let client = new SendMailClient({ url, token: secrets.zeptomail_token });
  client
    .sendMail({
      bounce_address: process.env.ZEPTOMAIL_BOUNCE_ADDRESS,
      from: {
        address: process.env.ZEPTOMAIL_SENDER_ADDRESS,
        name: process.env.ZEPTOMAIL_SENDER_NAME,
      },
      to: [
        {
          email_address: {
            address: to,
          },
        },
      ],
      subject,
      htmlbody,
    })
    .then((resp) => console.log('success', resp))
    .catch((error) => console.log('error', error.error.details));
}
