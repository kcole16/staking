import { testnet_Pools, mainnet_Pools } from '../models/mPools.js';
import { getKuutamoPools, getOwnerId } from '../helpers/near.js';

export const addPool = async (req, res) => {
  try {
    const kutamoPools = await getKuutamoPools(req.body.network);
    const Pools =
      req.body.network === 'mainnet' ? mainnet_Pools : testnet_Pools;
    const isExistsPool = await Pools.findOne({
      account_id: req.body.account_id,
      pool_id: req.body.pool_id,
      _userId: req.user._id,
    });
    const owner_id = await getOwnerId(req.body.network, req.body.pool_id, null);
    if (owner_id && !isExistsPool && !kutamoPools.includes(req.body.pool_id)) {
      Pools.create({
        account_id: req.body.account_id,
        pool_id: req.body.pool_id,
        owner_id,
        _userId: req.user._id,
      })
        .then(res.send({ status: 'ok' }))
        .catch((e) => {
          console.log(e);
          res.status(500).send({ error: 'Please try again' });
        });
    } else {
      res.send({ status: 'ok' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: 'Please try again' });
  }
};

export const removePool = async (req, res) => {
  try {
    const Pools =
      req.body.network === 'mainnet' ? mainnet_Pools : testnet_Pools;
    await Pools.deleteOne({
      account_id: req.body.account_id,
      pool_id: req.body.pool_id,
      _userId: req.user._id,
    });
    res.send({ status: 'ok' });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: 'Please try again' });
  }
};
