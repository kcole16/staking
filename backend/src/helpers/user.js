import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Tokens } from '../models/mTokens.js';
import { sendMailWithTemplate } from './sendMail.js';

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(5);
  return bcrypt.hashSync(password, salt);
};

export const sendWelcomeEmail = async (user) => {
  const token = new Tokens({
    _userId: user._id,
    token: crypto.randomBytes(16).toString('hex'),
  });
  try {
    await token.save();
    await sendMailWithTemplate(
      user.email,
      process.env.ZEPTOMAIL_WELCOME_TEMPLATE_KEY,
      {
        activation_link:
          process.env.SITE_URL + 'confirm/' + user.email + '/' + token.token,
      }
    );
    return { status: 'success', data: 'sent' };
  } catch (err) {
    return { status: 'fail', message: err.message };
  }
};

export const sendForgotPassword = async (user) => {
  const token = new Tokens({
    _userId: user._id,
    token: crypto.randomBytes(16).toString('hex'),
  });
  try {
    await token.save();
    await sendMailWithTemplate(
      user.email,
      process.env.ZEPTOMAIL_FORGOT_PASSWORD_TEMPLATE_KEY,
      {
        forgot_password_link:
          process.env.SITE_URL +
          'forgot-password/' +
          user.email +
          '/' +
          token.token,
      }
    );
    return { status: 'success', data: 'sent' };
  } catch (err) {
    return { status: 'fail', message: err.message };
  }
};
