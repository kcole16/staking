import jwt from 'jsonwebtoken';
import { secrets } from '../../helpers/secrets.js';

export const refreshToken = async (req, res) => {
  try {
    const oldToken = req.headers.authorization.substring(7);
    const decodedToken = jwt.verify(oldToken, secrets.jwt_token);
    const token = jwt.sign({ sub: decodedToken.sub }, secrets.jwt_token, {
      expiresIn: '1h',
      algorithm: 'RS256',
    });
    return res.status(200).json({ status: 'success', data: { token } });
  } catch (err) {
    return res.status(401).send({ status: 'fail', message: 'Unauthorized' });
    console.log(err);
  }
};
