import { Users } from '../../models/mUsers.js';
import { hashPassword, sendWelcomeEmail } from '../../helpers/user.js';

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'All input is required' });
    }
    const oldUser = await Users.findOne({ email });
    if (oldUser) {
      return res
        .status(409)
        .json({ status: 'fail', message: 'User Already Exist. Please Login' });
    }

    const user = new Users({
      email: email.toLowerCase(),
      password: hashPassword(password),
    });
    user
      .save()
      .then(async () => {
        const statusSent = await sendWelcomeEmail(user);
        return res
          .status(statusSent.status === 'success' ? 200 : 500)
          .json(statusSent);
      })
      .catch((err) => {
        return res.status(500).send({ status: 'fail', message: err.message });
      });
  } catch (err) {
    console.log(err);
  }
};
