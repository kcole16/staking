import { mainnet_Pools, testnet_Pools } from '../models/mPools.js';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  mainnet_DelegationRewards,
  testnet_DelegationRewards,
} from '../models/mDelegationRewards.js';
import { getAuthenticatedUser } from '../helpers/passport.js';

const getKuutamoPools = async (network) => {
  if (network !== 'testnet' && network !== 'mainnet') return [];
  try {
    return JSON.parse(
      fs.readFileSync(
        path.dirname(fileURLToPath(import.meta.url)) +
          '/../../public/validators.' +
          network +
          '.json',
        'utf8'
      )
    );
  } catch (err) {
    console.error(err);
  }
};

const removeUnusedPools = async (network, account_id, delegationPools) => {
  const DelegationRewards =
    network === 'mainnet'
      ? mainnet_DelegationRewards
      : testnet_DelegationRewards;
  for (const pool of delegationPools) {
    const isExists = await DelegationRewards.findOne({
      account_id,
      pool,
    });
    if (!isExists)
      delegationPools = delegationPools.filter((item) => item !== pool);
  }

  return delegationPools;
};

export const getMyRewardsPools = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req, res);
    const network =
      req.body.network === 'mainnet' ? req.body.network : 'testnet';
    const Pools = network === 'mainnet' ? mainnet_Pools : testnet_Pools;
    const account_id = req.body.account_id;

    let ownPools = await Pools.find({
      account_id,
      owner_id: account_id,
    }).distinct('pool_id');

    let delegationPools = user
      ? await Pools.find({
          _userId: user._id,
          account_id,
          owner_id: { $ne: account_id },
        }).distinct('pool_id')
      : [];

    const kuutamoPools = await getKuutamoPools(network);
    for (const k of kuutamoPools) {
      if (
        !delegationPools.includes(k.account_id) &&
        !ownPools.includes(k.account_id) &&
        k.is_enabled
      )
        delegationPools.push(k.account_id);
    }

    ownPools = await removeUnusedPools(network, account_id, ownPools);
    delegationPools = await removeUnusedPools(
      network,
      account_id,
      delegationPools
    );

    res.send({ ownPools, delegationPools });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: 'Please try again' });
  }
};
