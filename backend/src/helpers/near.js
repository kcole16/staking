import nearApi from 'near-api-js';
import bs58 from 'bs58';
import { utils } from 'near-api-js';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Decimal from 'decimal.js';

export const TESTNET_FIRST_EPOCH_HEIGHT = 42376888;
export const MAINNET_FIRST_EPOCH_HEIGHT = 9820210;
export const yoctoNEAR = new Decimal(1000000000000000000000000);

const verifyPublicKey = async (accountId, publicKey, network) => {
  const NEAR_RPC_URL =
    network === 'mainnet'
      ? process.env.MAINNET_NEAR_RPC_URL
      : process.env.TESTNET_NEAR_RPC_URL;
  const connectionInfo = { url: NEAR_RPC_URL };
  const provider = new nearApi.providers.JsonRpcProvider(connectionInfo);
  const response = await provider.query({
    request_type: 'view_access_key_list',
    finality: 'optimistic',
    account_id: accountId,
  });
  return response.keys.find((key) => key.public_key === publicKey);
};

export const verifySignature = async (
  accountId,
  publicKey,
  signature,
  message,
  network
) => {
  try {
    if (await verifyPublicKey(accountId, publicKey, network)) {
      const sign = bs58.decode(signature);
      const msg = Buffer.from(message);
      const pk = utils.PublicKey.fromString(publicKey);
      return pk.verify(msg, sign);
    } else {
      return false;
    }
  } catch (e) {
    //console.log(e);
    return false;
  }
};

export const getKuutamoPools = async (network) => {
  if (network !== 'testnet' && network !== 'mainnet') return [];
  try {
    const data = JSON.parse(
      fs.readFileSync(
        path.dirname(fileURLToPath(import.meta.url)) +
          '/../../public/validators.' +
          network +
          '.json',
        'utf8'
      )
    );
    const pools = [];
    for (let i in data) {
      if (data[i].is_enabled) pools.push(data[i].account_id);
    }
    return pools;
  } catch (err) {
    console.error(err);
  }
};

export async function getOwnerId(network, pool, blockId) {
  try {
    const account = await providerQuery(
      network,
      'call_function',
      pool,
      'get_owner_id',
      Buffer.from(`{"AccountId": "${pool}"}`).toString('base64'),
      blockId,
      false
    );
    return account;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function providerQuery(
  network,
  requestType,
  accountId,
  methodName,
  args,
  blockId,
  defaultValue
) {
  try {
    const NEAR_RPC_URL =
      network === 'mainnet'
        ? process.env.MAINNET_NEAR_ARCHIVAL_RPC_URL
        : process.env.TESTNET_NEAR_ARCHIVAL_RPC_URL;
    const connectionInfo = { url: NEAR_RPC_URL };
    const provider = new nearApi.providers.JsonRpcProvider(connectionInfo);

    const rawResult = blockId
      ? await provider.query({
          request_type: requestType,
          account_id: accountId,
          method_name: methodName,
          args_base64: args,
          block_id: blockId,
        })
      : await provider.query({
          request_type: requestType,
          account_id: accountId,
          method_name: methodName,
          args_base64: args,
          finality: 'final',
        });
    return JSON.parse(Buffer.from(rawResult.result).toString());
  } catch (e) {
    // TODO: Not fatal exceptions
    if (
      e.type === 'AccountDoesNotExist' ||
      (e.type === 'UntypedError' &&
        e.message.includes('FunctionCallError(HostError(ProhibitedInView')) ||
      (e.type === 'HANDLER_ERROR' &&
        e.message.includes('does not exist while viewing'))
    ) {
      return JSON.parse(defaultValue);
    }
    console.log(e.type);
    throw new Error(e.message);
  }
}
