import passport from 'passport';
import { calcWithdraw } from '../services/calcWithdraw.js';
import { getMyPools } from '../services/getMyPools.js';
import { updateMyPools } from '../services/updateMyPools.js';
import { addAccount } from '../services/addAccount.js';
import { getMyRewards } from '../services/getMyRewards.js';
import { registerUser } from '../services/user/registerUser.js';
import { loginUser } from '../services/user/loginUser.js';
import { orderServer } from '../services/orderServer.js';
import { confirmationCode } from '../services/user/confirmationCode.js';
import { resendConfirmationCode } from '../services/user/resendConfirmationCode.js';
import { forgotPassword } from '../services/user/forgotPassword.js';
import { changePassword } from '../services/user/changePassword.js';
import { version } from '../services/version.js';
import {
  getGrafanaToken,
  isExistsGrafanaToken,
} from '../services/user/grafanaToken.js';
import { refreshToken } from '../services/user/refreshToken.js';
import { getMyRewardsPools } from '../services/getMyRewardsPools.js';
import { addPool, removePool } from '../services/customPools.js';

export const routes = (app) => {
  app.get('/version', version);
  app.post('/calc-withdraw', calcWithdraw);
  app.post('/pools/update', updateMyPools);
  app.post(
    '/pools/add',
    passport.authenticate('jwt', { session: false }),
    addPool
  );
  app.post(
    '/pools/remove',
    passport.authenticate('jwt', { session: false }),
    removePool
  );
  app.post('/pools', getMyPools);
  app.post('/rewards', getMyRewards);
  app.post('/rewards/pools', getMyRewardsPools);
  app.post('/add-account', addAccount);
  app.post('/register', registerUser);
  app.post('/login', loginUser);
  app.post(
    '/order-server',
    passport.authenticate('jwt', { session: false }),
    orderServer
  );
  app.get('/auth/confirmation/:email/:token', confirmationCode);
  app.post('/auth/resend-confirmation-code', resendConfirmationCode);
  app.post('/auth/forgot-password', forgotPassword);
  app.post('/auth/change-password/:email/:token', changePassword);
  app.get(
    '/auth/refresh-token',
    passport.authenticate('jwt', { session: false }),
    refreshToken
  );
  app.get(
    '/get-grafana-token',
    passport.authenticate('jwt', { session: false }),
    getGrafanaToken
  );
  app.get(
    '/is-exists-grafana-token',
    passport.authenticate('jwt', { session: false }),
    isExistsGrafanaToken
  );
};
