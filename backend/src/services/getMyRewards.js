import {
  mainnet_DelegationRewards,
  testnet_DelegationRewards,
} from '../models/mDelegationRewards.js';
import Decimal from 'decimal.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

Decimal.set({ precision: 31 });

const getDRewards = async (
  network,
  account_id,
  pool,
  groupByDay,
  dateFrom,
  dateTo,
  timeZone,
  n
) => {
  const lineColors = [
    '#0000FF',
    '#FF0000',
    '#00FF00',
    '#FFA500',
    '#FFFF00',
    '#800080',
    '#008080',
    '#FF00FF',
    '#00FFFF',
    '#808080',
  ];
  const DelegationRewards =
    network === 'mainnet'
      ? mainnet_DelegationRewards
      : testnet_DelegationRewards;

  const dRewards = await DelegationRewards.aggregate([
    {
      $match: {
        account_id: account_id,
        pool: pool,
        date: {
          $gte: dayjs(dateFrom).tz(timeZone).startOf('day').utc().toDate(),
          $lt: dayjs(dateTo)
            .tz(timeZone)
            .startOf('day')
            .add(1, 'day')
            .utc()
            .toDate(),
        },
      },
    },
    { $project: { _id: 0, x: '$date', y: { $toString: '$rewards' } } },
    { $sort: { x: 1 } },
  ]);

  return {
    label: pool,
    data: groupByDay
      ? rewardsByDay(dRewards, timeZone)
      : rewardsByEpoch(dRewards, timeZone),
    borderColor: lineColors[n] || 'blue',
    backgroundColor: lineColors[n] || 'blue',
  };
};

const getLabels = (datasets, groupByDay) => {
  const labels = [];
  for (const dataset of datasets) {
    for (const d of dataset.data) {
      const dx = groupByDay
        ? dayjs(d.x).format('YYYY-MM-DD')
        : dayjs(d.x).format('YYYY-MM-DD HH:mm:ss');
      if (!labels.includes(dx)) labels.push(dx);
    }
  }
  labels.sort();
  return labels;
};

const rewardsByDay = (data, timeZone) => {
  const sumByDay = {};
  data.forEach((entry) => {
    const dx = dayjs(entry.x).tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
    const [date, time] = dx.split(' ');
    const day = date;
    if (sumByDay.hasOwnProperty(day))
      sumByDay[day] = new Decimal(sumByDay[day]).plus(new Decimal(entry.y));
    else sumByDay[day] = new Decimal(entry.y);
  });
  return Object.entries(sumByDay).map(([day, sum]) => ({
    x: day,
    y: sum.toFixed(),
  }));
};

const rewardsByEpoch = (data, timeZone) => {
  const sumByEpoch = {};
  data.forEach((entry) => {
    const ep = dayjs(entry.x).tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
    sumByEpoch[ep] = new Decimal(entry.y);
  });
  return Object.entries(sumByEpoch).map(([ep, sum]) => ({
    x: ep,
    y: sum.toFixed(),
  }));
};

export const getMyRewards = async (req, res) => {
  try {
    const datasets = [];
    const pools = Array.isArray(req.body.pools) ? req.body.pools : [];
    let n = 0;
    for (const pool of pools) {
      const dataset = await getDRewards(
        req.body.network,
        req.body.account_id,
        pool,
        req.body.groupByDay,
        req.body.dateFrom,
        req.body.dateTo,
        req.body.timeZone,
        n
      );
      datasets.push(dataset);
      n++;
    }
    const labels = getLabels(datasets, req.body.groupByDay);
    res.send({ dRewards: { labels, datasets } });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: 'Please try again' });
  }
};
