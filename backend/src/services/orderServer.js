import Joi from 'joi';
import { sendMailWithTemplate } from '../helpers/sendMail.js';

export const orderServer = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    server: Joi.string().valid('SOLO', 'PRO', 'RUN').required(),
    backup: Joi.boolean(),
    SRE: Joi.boolean(),
  }).when(Joi.object({ server: Joi.string().valid('RUN') }).unknown(), {
    then: Joi.object({
      backup: Joi.boolean().forbidden(),
      SRE: Joi.boolean().forbidden(),
    }),
  });

  try {
    const { server, backup, SRE } = req.body;
    const data = {
      email: req.user.email,
      server: req.body.server,
      backup: req.body.backup,
      SRE: req.body.SRE,
    };
    const result = schema.validate(data);

    if (result.error) {
      return res
        .status(400)
        .json({ status: 'fail', message: result.error.details[0]?.message });
    } else {
      await sendMailWithTemplate(
        process.env.ZEPTOMAIL_ORDER2KUUTAMO_EMAIL,
        process.env.ZEPTOMAIL_ORDER2KUUTAMO_TEMPLATE_KEY,
        {
          email: req.user.email,
          server,
          backup,
          SRE,
        }
      );
      await sendMailWithTemplate(
        req.user.email,
        process.env.ZEPTOMAIL_ORDER2CUSTOMER_TEMPLATE_KEY,
        {}
      );
      return res.status(200).json({ status: 'success', data: 'Sent' });
    }
  } catch (err) {
    console.log(err);
  }
};
