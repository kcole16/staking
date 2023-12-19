import { Users } from '../../models/mUsers.js';
import { sendWelcomeEmail } from '../../helpers/user.js';

export const resendConfirmationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ status: 'fail', message: 'Email input is required' });
    const user = await Users.findOne({ email });
    if (!user)
      return res
        .status(400)
        .send({ status: 'fail', message: 'Email not found' });
    if (user.isVerified)
      return res.status(400).send({
        status: 'fail',
        message: 'This account has been already verified. Please log in',
      });

    const statusSent = sendWelcomeEmail(user);
    return res
      .status(statusSent.status === 'success' ? 200 : 500)
      .json(statusSent);
  } catch (err) {
    console.log(err);
  }
};
