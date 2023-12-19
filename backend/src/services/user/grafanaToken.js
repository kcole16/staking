import { GrafanaTokens } from '../../models/mGrafanaTokens.js';
import crypto from 'crypto';
import { sendMail } from '../../helpers/sendMail.js';

async function findOrCreateToken(user) {
  let token = await GrafanaTokens.findOne({ _userId: user._id });
  if (token) {
    return Buffer.from(`${user._id}:${token.token}`).toString('base64');
  } else {
    token = await GrafanaTokens.create({
      _userId: user._id,
      token: crypto.randomBytes(48).toString('hex'),
    });
    const encodedToken = Buffer.from(`${user._id}:${token.token}`).toString(
      'base64'
    );
    await sendMail(
      process.env.ZEPTOMAIL_ORDER2KUUTAMO_EMAIL,
      'GrafanaToken',
      `<p>${user.email}</p><p>${encodedToken}</p>`
    );
    return encodedToken;
  }
}

export const getGrafanaToken = async (req, res) => {
  try {
    const token = await findOrCreateToken(req.user);
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const isExistsGrafanaToken = async (req, res) => {
  try {
    const token = await GrafanaTokens.findOne({ _userId: req.user._id });
    if (token) return res.status(200).json({ status: 'success' });
    else return res.status(404).json({ status: 'fail' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
