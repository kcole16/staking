import { testnet_Pools, mainnet_Pools } from '../models/mPools.js';
import { getAuthenticatedUser } from '../helpers/passport.js';

export const getMyPools = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req, res);
    const Pools =
      req.body.network === 'mainnet' ? mainnet_Pools : testnet_Pools;

    const addedPools = user
      ? await Pools.find({
          _userId: user._id,
          account_id: req.body.account_id,
          owner_id: { $ne: req.body.account_id },
        }).select({
          _id: 0,
          __v: 0,
          account_id: 0,
          _userId: 0,
        })
      : [];
    const myPools = await Pools.find({
      account_id: req.body.account_id,
      owner_id: req.body.account_id,
    }).select({
      _id: 0,
      __v: 0,
      account_id: 0,
    });
    res.send({ myPools, addedPools });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: 'Please try again' });
  }
};
