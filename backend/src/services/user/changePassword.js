import { Users } from '../../models/mUsers.js';
import { hashPassword } from '../../helpers/user.js';
import { Tokens } from '../../models/mTokens.js';

export const changePassword = async (req, res) => {
  try {
    Tokens.findOne({ token: req.params.token })
      .then((token) => {
        if (!token) {
          return res.status(400).send({
            status: 'fail',
            message: 'Your link may have expired',
          });
        } else {
          Users.findOne({
            _id: token._userId,
            email: req.params.email,
          }).then((user) => {
            const { newPassword } = req.body;
            if (!newPassword) {
              return res.status(400).json({
                status: 'fail',
                message: 'newPassword input is required',
              });
            } else if (!user) {
              return res.status(404).json({
                status: 'fail',
                message: 'Email Not found',
              });
            } else {
              user.password = hashPassword(newPassword);
              user.isVerified = true;
              user
                .save()
                .then(async () => {
                  await Tokens.deleteOne({ _id: token._id });
                  return res.status(201).json({
                    status: 'success',
                    data: 'changed',
                  });
                })
                .catch((err) => {
                  return res.status(500).send({
                    status: 'fail',
                    message: err.message,
                  });
                });
            }
          });
        }
      })
      .catch((err) => {
        return res.status(500).send({ status: 'fail', message: err.message });
      });
  } catch (err) {
    console.log(err);
  }
};
