import { Users } from '../models/mUsers.js';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { secrets } from './secrets.js';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secrets.jwt_token;
opts.algorithms = ['RS256'];

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await Users.findById(jwt_payload.sub.split('-')[2]);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

export const getAuthenticatedUser = (req, res) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) resolve(null);
      else resolve(user);
    })(req, res);
  });
};
