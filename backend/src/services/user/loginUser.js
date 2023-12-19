import { Users } from '../../models/mUsers.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { secrets } from '../../helpers/secrets.js';

export const loginUser = async (req, res) => {
  try {
    const allowedProtocols = [
      'near-testnet',
      'near-mainnet',
      'lightning-testnet',
      'lightning-mainnet',
    ];
    const { email, password, protocol } = req.body;
    if (!(email && password && allowedProtocols.includes(protocol))) {
      return res.status(400).send({ status: 'fail', message: 'Bad Request' });
    }
    const user = await Users.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified)
        return res.status(400).send({
          status: 'fail',
          message: 'Your Email has not been verified',
        });
      const token = jwt.sign(
        { sub: `${protocol}-${user._id}` },
        secrets.jwt_token,
        {
          expiresIn: '1h',
          algorithm: 'RS256',
        }
      );
      return res
        .status(200)
        .json({ status: 'success', data: { user_id: user._id, token } });
    }
    return res.status(400).send({ status: 'fail', message: 'Bad Request' });
  } catch (err) {
    console.log(err);
  }
};
