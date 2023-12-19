import React, { useEffect, useRef, useState } from 'react';
import Decimal from 'decimal.js';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
  Box,
  useTheme,
  Typography,
} from '@mui/material';
import TablePaginationActions from '../Pagination';
import { Line } from 'react-chartjs-2';
import { getRewards } from '../../../helpers/rewards';
import { getCustomThemeStyles } from '../../styles/theme';
import RewardsLineRow from './RewardsLineRow';
Decimal.set({ precision: 31 });

const RewardsLine = ({
  groupByDay,
  useLocalTimeZone,
  isTable,
  isCumulative,
  pools,
  accountId,
  setCsv,
  dateTo,
  dateFrom,
}) => {
  const [rewards, setRewards] = useState({ labels: [], datasets: [] });
  const [cumulativeRewards, setCumulativeRewards] = useState({
    labels: [],
    datasets: [],
  });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const theme = useTheme();
  const chartRef = useRef(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw.x}: ${ctx.raw.y}`,
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          callback: (label) => `${label} NEAR`,
        },
      },
    },
  };

  const ordinaryData = rewards.datasets
    .map((currRewards) => currRewards.data)
    .flat(1);

  useEffect(() => {
    let data = 'Pool,Reward,Cumulative Total,Date\n';
    cumulativeRewards.datasets.map((currRewards) =>
      currRewards.data.map(
        (dataEl, index) =>
          (data += `${dataEl.pool},${ordinaryData[index].y},${dataEl.y},${dataEl.x}\n`)
      )
    );
    setCsv(data);
  }, [cumulativeRewards.datasets, setCsv, ordinaryData]);

  useEffect(() => {
    setPage(0);
  }, [groupByDay, isTable, pools, dateFrom, dateTo]);

  useEffect(() => {
    (async () => {
      const rew = await getRewards(
        pools,
        accountId,
        groupByDay,
        useLocalTimeZone,
        dateFrom,
        dateTo
      );

      if (rew) {
        const cumulative = JSON.parse(JSON.stringify(rew));

        cumulative.datasets.forEach((dataset) => {
          const { data } = dataset;
          if (data) {
            let sum = new Decimal(0);
            const result = data.map((dataEl) => {
              const { x, y } = dataEl;
              const { label: pool } = dataset;
              const diff = new Decimal(y);
              sum = sum.plus(diff);
              return {
                x,
                y: sum.toFixed(),
                pool,
              };
            });
            dataset.data = result;
          }
        });

        setRewards(rew);
        setCumulativeRewards(cumulative);
      }
    })();
  }, [accountId, pools, groupByDay, dateFrom, dateTo, useLocalTimeZone]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const cumulativeData = cumulativeRewards.datasets
    .map((currRewards) => currRewards.data)
    .flat(1);

  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
    <>
      {(rewards && cumulativeData.length > 0 && (
        <>
          {(isTable && (
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pool</TableCell>
                    <TableCell>Reward</TableCell>
                    <TableCell>Cumulative Total</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? cumulativeData.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : cumulativeData
                  ).map((dataEl, index) => (
                    <RewardsLineRow
                      key={`${dataEl.y}-${dataEl.x}`}
                      dataEl={dataEl}
                      index={index}
                      ordinaryData={ordinaryData}
                      page={page}
                      rowsPerPage={rowsPerPage}
                    />
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: 'All', value: -1 },
                      ]}
                      colSpan={4}
                      count={cumulativeData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: {
                          'aria-label': 'rows per page',
                        },
                        native: true,
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </Box>
          )) || (
            <Box
              sx={{
                backgroundColor: customTheme.colors.lineGraph,
                width: 1,
                height: { xs: '420px', sm: '700px' },
              }}
            >
              <Line
                data={isCumulative ? cumulativeRewards : rewards}
                options={options}
                ref={chartRef}
              />
            </Box>
          )}
        </>
      )) || (
        <Typography
          sx={{
            textAlign: 'center',
            fontFamily: customTheme.font.roboto,
            fontSize: '20px',
          }}
        >
          No chosen values
        </Typography>
      )}
    </>
  );
};

export default RewardsLine;
