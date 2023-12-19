import { Users } from '../../models/mUsers.js';
import { sendForgotPassword } from '../../helpers/user.js';

export const forgotPassword = async (req, res) => {
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
    const statusSent = await sendForgotPassword(user);
    console.log(statusSent);
    return res
      .status(statusSent.status === 'success' ? 200 : 500)
      .json(statusSent);
  } catch (err) {
    console.log(err);
  }
};
