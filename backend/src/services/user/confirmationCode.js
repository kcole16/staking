import { Users } from '../../models/mUsers.js';
import { Tokens } from '../../models/mTokens.js';

export const confirmationCode = async (req, res) => {
  try {
    const token = await Tokens.findOne({ token: req.params.token });
    if (!token) {
      return res.status(400).send({
        status: 'fail',
        message: 'Your verification link may have expired',
      });
    }

    const user = await Users.findOne({
      _id: token._userId,
      email: req.params.email,
    });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'Email Not found',
      });
    } else if (user.isVerified) {
      return res.status(200).json({
        status: 'fail',
        message: 'User has been already verified. Please Login',
      });
    } else {
      user.isVerified = true;
      await user.save();
      return res.status(200).json({
        status: 'success',
        data: 'Activated',
      });
    }
  } catch (err) {
    console.log('error', err);
    res.status(500).send({
      status: 'fail',
      message: err.message,
    });
  }
};
