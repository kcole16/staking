import { nearConfig } from './nearConfig';

export const getRewards = async (
  pools,
  account_id,
  groupByDay,
  useLocalTimeZone,
  dateFrom,
  dateTo
) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      network: nearConfig.networkId,
      account_id,
      pools,
      dateFrom,
      dateTo,
      groupByDay,
      timeZone: useLocalTimeZone
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : 'Etc/Universal',
    }),
  };
  const r = await fetch(nearConfig.backendUrl + 'rewards', requestOptions)
    .then(async (response) => {
      const rs = await response.json();
      return rs.dRewards;
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
  return r;
};
