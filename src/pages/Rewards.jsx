import {
  Container,
  Typography,
  Box,
  Divider,
  useTheme,
  Stack,
  ButtonGroup,
  Button,
  CircularProgress,
} from '@mui/material';
import Decimal from 'decimal.js';
import { useEffect, useState } from 'react';
import { nearConfig } from '../helpers/nearConfig';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import SnackbarAlert from '../ui/components/SnackbarAlert';
import { getCustomThemeStyles } from '../ui/styles/theme';
import InfoCircleBig from '../svg/infoCircleBig';
import RewardsLine from '../ui/components/RewardsPage/RewardsLine';
import RewardsChoosePoolBlock from '../ui/components/RewardsPage/RewardsChoosePoolBlock';
import { StyledRewardsSwitch } from '../ui/components/Switch/Switch';
import FileLinkIcon from '../svg/link';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CalendarIcon from '../svg/calendar';
import RewardsSwitchView from '../svg/Arrows/rewardsSwitchView';
import { useWindowDimension } from '../hooks/useWindowDimension';
import { authService } from '../helpers/auth';
import { Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

Decimal.set({ precision: 31 });
dayjs.extend(utc);

const Rewards = ({ wallet }) => {
  const { width } = useWindowDimension();
  const [dateFromIsOpen, setDateFromIsOpen] = useState(false);
  const [dateToIsOpen, setDateToIsOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState(
    dayjs(new Date().setDate(new Date().getDate() - 90))
  );
  const [dateTo, setDateTo] = useState(dayjs(new Date()));
  const [delegationsPools, setDelegationsPools] = useState([]);
  const [selectedDelegationsPools, setSelectedDelegationsPools] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [selectedMyPools, setSelectedMyPools] = useState([]);
  const [myPools, setMyPools] = useState([]);
  const [myPoolsSelectOpen, setMyPoolsSelectOpen] = useState(false);
  const [myDelegationsPoolsSelectOpen, setMyDelegationsPoolsSelectOpen] =
    useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [token, setNewToken] = useState(localStorage.getItem('TOKEN') || '');
  const [csv, setCsv] = useState('');
  const [isCumulative, setIsCumulative] = useState(false);
  const [isTable, setIsTable] = useState(false);
  const [useLocalTimeZone, setUseLocalTimeZone] = useState(false);
  const [groupByDay, setGroupByDay] = useState(true);
  const [warningMsg, setWarningMsg] = useState('');

  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  useEffect(() => {
    (async () => {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          network: nearConfig.networkId,
          account_id: wallet.accountId,
        }),
      };
      const pools = await fetch(
        nearConfig.backendUrl + 'rewards/pools',
        requestOptions
      )
        .then(async (response) => {
          return response.json();
        })
        .then((data) => {
          return data;
        })
        .catch((error) => {
          setWarningMsg('Error retrieving data from backend');
          setIsFetched(true);
        });

      setMyPools(pools.ownPools);
      setSelectedMyPools(pools.ownPools);
      setDelegationsPools(pools.delegationPools);
      setSelectedDelegationsPools(pools.delegationPools);
      setIsFetched(true);
    })();
  }, [wallet, token]);

  useEffect(() => {
    if (token) {
      const timeRemaining = authService.getRemainingTime(token);
      const timeInMinutes = timeRemaining / 60;
      if (timeInMinutes > 0) {
        setIsAuthorized(true);
        const getRefreshToken = () => {
          authService.refreshToken(token).then((res) => {
            if (res && res.status === 'success' && res.data && res.data.token) {
              setIsAuthorized(true);
              localStorage.setItem('TOKEN', res.data.token);
              setNewToken(res.data.token);
            } else {
              setIsAuthorized(false);
            }
          });
        };
        if (timeInMinutes <= 5) {
          getRefreshToken();
        } else {
          setTimeout(getRefreshToken, (timeRemaining - 300) * 1000);
        }
      } else {
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(false);
    }
  }, [token]);

  const handleDelegationPoolsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedDelegationsPools(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handlePoolsChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedMyPools(typeof value === 'string' ? value.split(',') : value);

    setMyPoolsSelectOpen(false);
  };

  const handleDelegateSelectOpen = () => {
    setMyDelegationsPoolsSelectOpen(true);
  };

  const handlePoolsSelectOpen = () => {
    setMyPoolsSelectOpen(true);
  };

  const handleDelegateSelectClose = () => {
    setMyDelegationsPoolsSelectOpen(false);
  };

  const handlePoolsSelectClose = () => {
    setMyPoolsSelectOpen(false);
  };

  const handleCumulativeChange = (e) => {
    if (e && e.target) setIsCumulative(e.target.checked);
  };

  const handleTableChange = (e) => {
    if (e && e.target) {
      setIsTable(e.target.checked);
    }
  };

  const handleUseLocalTimeZone = (e) => {
    if (e && e.target) setUseLocalTimeZone(e.target.checked);
  };

  const handleGroupByDay = (e) => {
    if (e && e.target) setGroupByDay(e.target.checked);
  };

  const handleDateFromOpen = () => {
    setDateFromIsOpen(true);
  };

  const handleDateFromClose = () => {
    setDateFromIsOpen(false);
  };

  const handleDateToOpen = () => {
    setDateToIsOpen(true);
  };

  const handleDateToClose = () => {
    setDateToIsOpen(false);
  };

  const handleDateToChange = (newDateTo) => {
    setDateTo(newDateTo);
  };

  const handleDateFromChange = (newDateFrom) => {
    setDateFrom(newDateFrom);
  };

  const handleTodayClick = () => {
    setDateFrom(dayjs());
    setDateTo(dayjs());
  };

  const handle7DClick = () => {
    setDateFrom(dayjs().subtract(7, 'day'));
    setDateTo(dayjs());
  };

  const handle30DClick = () => {
    setDateFrom(dayjs().subtract(30, 'day'));
    setDateTo(dayjs());
  };

  const handle3MClick = () => {
    setDateFrom(dayjs().subtract(3, 'month'));
    setDateTo(dayjs());
  };

  const handle6MClick = () => {
    setDateFrom(dayjs().subtract(6, 'month'));
    setDateTo(dayjs());
  };

  const handle12MClick = () => {
    setDateFrom(dayjs().subtract(12, 'month'));
    setDateTo(dayjs());
  };

  const handleYTDClick = () => {
    setDateFrom(dayjs(new Date(dayjs().year(), 0, 1)));
    setDateTo(dayjs());
  };

  const handleAllTimeClick = () => {
    if (nearConfig.networkId === 'mainnet') {
      setDateFrom(dayjs(new Date(2020, 6, 21)));
    } else if (nearConfig.networkId === 'testnet') {
      setDateFrom(dayjs(new Date(2020, 6, 31)));
    }

    setDateTo(dayjs());
  };

  const labelStyles = {
    fontFamily: customTheme.font.roboto,
    fontWeight: 400,
    fontSize: { xs: '14px', sm: '16px' },
    lineHeight: 1.5,
    color: 'text.secondary',
    height: '100%',
  };

  const arrowColor = theme.palette.primary.main;

  const buttonStyles = {
    borderColor: 'primary.dark',
    backgroundColor: 'primary.light',
    color: customTheme.colors.lightgrey,
    borderRadius: 0,
    fontSize: { xs: '14px', sm: '18px' },
    textTransform: 'none',
    fontFamily: customTheme.font.roboto,
    fontWeight: 400,
    padding: '11px 16px',
    lineHeight: 1,

    '&::before': {
      display: 'block',
      content: 'attr(title)',
      fontWeight: 500,
      height: 0,
      overflow: 'hidden',
      visibility: 'hidden',
    },

    '&:hover': {
      '& .MuiTypography-root': {
        fontWeight: '500',
      },
      fontWeight: '500',
      backgroundColor: 'primary.light',
      color: 'primary.main',
    },

    '@media (max-width: 1300px)': {
      padding: '8px 13px',
      width: 'fit-content',
    },
  };

  const mobileDatePickerSlotProps = {
    mobilePaper: {
      sx: {
        borderRadius: '28px',

        '& .MuiPickersToolbar-root': {
          borderBottom: 1,
          borderBottomColor: 'primary.dark',
          '& > span': {
            fontFamily: customTheme.font.roboto,
            textTransform: 'none',
            letterSpacing: '0.01px',
            fontSize: '14px',
            lineHeight: 1,
            color: customTheme.colors.lightgrey,
          },

          '& > div': {
            marginTop: '36px',
          },
          '& > div h4': {
            fontFamily: customTheme.font.roboto,
            fontSize: '32px',
            lineHeight: 1.25,
            fontWeight: '400',
          },
        },

        '& .MuiPickersCalendarHeader-root': {
          '& .MuiPickersCalendarHeader-labelContainer': {
            fontFamily: customTheme.font.roboto,
            fontSize: '14px',
            letterSpacing: '0.01px',

            '& button': {
              color: customTheme.colors.secondary,
              paddingLeft: '7px',
            },
          },
        },
        '& .MuiDayCalendar-header': {
          '& > span': {
            fontFamily: customTheme.font.roboto,
            color: customTheme.colors.lightgrey,
            letterSpacing: '0.05px',
          },
        },

        '& .MuiPickersSlideTransition-root': {
          minHeight: '195px',
        },
        '& .MuiDayCalendar-monthContainer': {
          '& > div  button': {
            fontFamily: customTheme.font.roboto,
            color: customTheme.colors.lightgrey,
            letterSpacing: '0.05px',

            '&:not(.Mui-selected)': {
              borderColor: 'primary.main',
            },

            '&.Mui-selected': {
              fontSize: '14px',
              color: 'primary.light',
              fontWeight: 500,
              backgroundColor: 'primary.main',

              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'primary.light',
              },
            },
          },
        },

        '& .MuiYearCalendar-root': {
          borderBottom: 1,
          borderBottomColor: 'primary.dark',

          '& button': {
            fontFamily: customTheme.font.roboto,
            color: customTheme.colors.lightgrey,
            letterSpacing: '0.05px',
            fontSize: '16px',

            '&:not(.Mui-selected)': {
              borderColor: 'primary.main',
            },

            '&.Mui-selected': {
              color: 'primary.light',
              fontWeight: 500,
              backgroundColor: 'primary.main',

              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'primary.light',
              },
            },
          },
        },

        '& .MuiDialogActions-root': {
          '& button:first-of-type': {
            border: 0,
            textTransform: 'none',
            fontFamily: customTheme.font.roboto,
            fontSize: '14px',
            letterSpacing: '0.01px',
            fontWeight: 500,
            padding: '10px 12px',
            minWidth: '0',
          },

          '& button:last-of-type': {
            border: 0,
            textTransform: 'none',
            fontFamily: customTheme.font.roboto,
            fontSize: '14px',
            letterSpacing: '0.01px',
            fontWeight: 500,
            padding: '10px 12px',
            minWidth: '0',
          },
        },
      },
    },
  };

  const titleStyles = {
    marginBottom: { xs: '26px', sm: '32px' },
    fontWeight: 500,
    fontSize: { xs: '24px', sm: '32px' },
    lineHeight: 1,
  };

  const buttons =
    width <= 1300
      ? [
          {
            label: 'D',
            onClick: handleTodayClick,
            sx: {
              ...buttonStyles,
              padding: { xs: '4px 12.4px !important', sm: 0 },
              borderRadius: '5px 0px 0px 5px !important',
            },
          },
          {
            label: 'W',
            onClick: handle7DClick,
            sx: {
              ...buttonStyles,
              padding: { xs: '4px 10.8px !important', sm: 0 },
            },
          },
          {
            label: 'M',
            onClick: handle30DClick,
            sx: {
              ...buttonStyles,
              padding: { xs: '4px 10.8px !important', sm: 0 },
            },
          },
          {
            label: '3M',
            onClick: handle3MClick,
            sx: {
              ...buttonStyles,
              padding: { xs: '4px 11px !important', sm: 0 },
            },
          },
          {
            label: '6M',
            onClick: handle6MClick,
            sx: {
              ...buttonStyles,
              padding: { xs: '4px 11px !important', sm: 0 },
            },
          },
          {
            label: 'Y',
            onClick: handle12MClick,
            sx: {
              ...buttonStyles,
              padding: { xs: '4px 11px !important', sm: 0 },
            },
          },
          {
            label: 'YTD',
            onClick: handleYTDClick,
            sx: {
              ...buttonStyles,
              padding: { xs: '4px 10px !important', sm: 0 },
            },
          },
          {
            label: 'All time',
            onClick: handleAllTimeClick,
            sx: {
              ...buttonStyles,
              borderRadius: '0px 5px 5px 0px',
              padding: { xs: '4px 11.5px !important', sm: 0 },
            },
          },
        ]
      : [
          { label: 'Today', onClick: handleTodayClick, sx: buttonStyles },
          { label: '7D', onClick: handle7DClick, sx: buttonStyles },
          { label: '30D', onClick: handle30DClick, sx: buttonStyles },
          { label: '3M', onClick: handle3MClick, sx: buttonStyles },
          { label: '6M', onClick: handle6MClick, sx: buttonStyles },
          { label: '12M', onClick: handle12MClick, sx: buttonStyles },
          { label: 'YTD', onClick: handleYTDClick, sx: buttonStyles },
          {
            label: 'All time',
            onClick: handleAllTimeClick,
            sx: { ...buttonStyles, borderRadius: '0px 5px 5px 0px' },
          },
        ];

  const switchLabelStyles = {
    fontSize: { xs: '10.5px', sm: '12px' },
    lineHeight: 1,
    marginBottom: '5px',
    fontFamily: customTheme.font.roboto,
  };

  const isMobile = width && width < 600;

  return isFetched ? (
    <>
      {delegationsPools.length === 0 && myPools.length === 0 ? (
        <Box
          sx={{
            width: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            marginBlock: '32px',
          }}
        >
          <InfoCircleBig
            frameColor={customTheme.colors.secondary}
            exclamationColor="currentColor"
          />
          <Typography
            sx={{
              fontSize: '24px',
              fontFamily: customTheme.font.roboto,
              marginTop: '16px',
            }}
          >
            There is nothing to show at this moment
          </Typography>
        </Box>
      ) : (
        <>
          <Container
            sx={{
              marginInline: '20px 0',
              '@media (min-width: 0px)': {
                marginLeft: 0,
                maxWidth: { xs: 1, sm: 'calc(100% - 32px)' },
              },
              '@media (min-width: 600px)': {
                paddingInline: '0',
                marginLeft: '20px',
              },
            }}
          >
            <SnackbarAlert
              msg={warningMsg}
              setMsg={setWarningMsg}
              severity="error"
            />
            {myPools && myPools.length > 0 && (
              <Typography
                component="h1"
                variant="h5"
                align="center"
                sx={titleStyles}
                mb={{ xs: 3, sm: 4 }}
              >
                Pool rewards
              </Typography>
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: { xs: '16px', lg: '8px' },
              }}
            >
              <Box
                sx={{
                  width: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '@media (max-width: 1790px)': {
                    alignItems: 'start',
                    flexDirection: 'column-reverse',
                    rowGap: { sm: 0, lg: '26px' },
                  },
                }}
              >
                {width && width < 1160 && (
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                    sx={{
                      flexWrap: { xs: 'wrap', sm: 'nowrap' },

                      '.MuiButtonGroup-grouped': {
                        minWidth: { xs: '0', sm: '40px' },

                        '&:hover': {
                          borderColor: 'primary.main',

                          '& + button': {
                            borderLeftColor: 'primary.main',
                          },
                        },
                      },
                    }}
                  >
                    <Button
                      sx={{
                        ...buttonStyles,

                        borderRadius: '5px 0 0 5px',
                        padding: { xs: '4px 8px !important', sm: 'inherit' },
                      }}
                      onClick={handleDateFromOpen}
                    >
                      <Box sx={{ width: '24px', height: '24px' }}>
                        <CalendarIcon />
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: 'inherit',
                          fontSize: { xs: '13px', sm: '18px' },
                          marginLeft: '12px',
                          lineHeight: 1,
                        }}
                      >
                        {dateFrom.format('MMM DD, YYYY')}
                      </Typography>
                    </Button>
                    <Button
                      sx={{
                        ...buttonStyles,
                        lineHeight: 1,
                        padding: { xs: '4px 8px !important' },
                        borderRadius: '0 5px 5px 0',
                      }}
                      onClick={handleDateToOpen}
                    >
                      <Box sx={{ width: '24px', height: '24px' }}>
                        <CalendarIcon />
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: 'inherit',
                          fontSize: { xs: '13px', sm: '18px' },
                          marginLeft: '12px',
                          lineHeight: 1,
                        }}
                      >
                        {dateTo.format('MMM DD, YYYY')}
                      </Typography>
                    </Button>
                  </ButtonGroup>
                )}
                <ButtonGroup
                  variant="outlined"
                  aria-label="outlined button group"
                  sx={{
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },

                    '.MuiButtonGroup-grouped': {
                      minWidth: { xs: '0', sm: '40px' },

                      '&:hover': {
                        borderColor: 'primary.main',

                        '& + button': {
                          borderLeftColor: 'primary.main',
                        },
                      },
                    },
                    '@media (max-width: 1160px)': {
                      marginBottom: { xs: '16px', lg: 0 },
                    },
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      orientation="portrait"
                      sx={{
                        display: 'none',
                      }}
                      value={dateFrom}
                      slots={{ switchViewIcon: RewardsSwitchView }}
                      slotProps={mobileDatePickerSlotProps}
                      open={dateFromIsOpen}
                      onClose={handleDateFromClose}
                      onChange={handleDateFromChange}
                    />
                    <MobileDatePicker
                      orientation="portrait"
                      sx={{ display: 'none' }}
                      value={dateTo}
                      slots={{ switchViewIcon: RewardsSwitchView }}
                      slotProps={mobileDatePickerSlotProps}
                      open={dateToIsOpen}
                      onClose={handleDateToClose}
                      onChange={handleDateToChange}
                    />
                  </LocalizationProvider>
                  {width && width >= 1160 && (
                    <>
                      <Button
                        sx={{
                          ...buttonStyles,
                          borderRadius: '5px 0 0 5px',
                        }}
                        onClick={handleDateFromOpen}
                      >
                        <Box sx={{ width: '24px', height: '24px' }}>
                          <CalendarIcon />
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: 'inherit',
                            fontSize: { xs: '13px', sm: '18px' },
                            marginLeft: '12px',
                            lineHeight: 1,
                          }}
                        >
                          {dateFrom.format('MMM DD, YYYY')}
                        </Typography>
                      </Button>
                      <Button
                        sx={{
                          ...buttonStyles,
                          lineHeight: 1,
                        }}
                        onClick={handleDateToOpen}
                      >
                        <Box sx={{ width: '24px', height: '24px' }}>
                          <CalendarIcon />
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: 'inherit',
                            fontSize: { xs: '13px', sm: '18px' },
                            marginLeft: '12px',
                            lineHeight: 1,
                          }}
                        >
                          {dateTo.format('MMM DD, YYYY')}
                        </Typography>
                      </Button>
                    </>
                  )}
                  {buttons.map((btn) => {
                    const { label, ...other } = btn;
                    return (
                      <Button key={label} {...other}>
                        {label}
                      </Button>
                    );
                  })}
                </ButtonGroup>
                <Box
                  sx={{
                    display: 'flex',
                    columnGap: { xs: '19px', sm: '32px' },
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    rowGap: { xs: '16px', md: 0 },
                    width: { xs: 1, sm: 'auto' },
                    marginBottom: { xs: '16px', lg: 0 },
                  }}
                >
                  <Box>
                    <Typography sx={switchLabelStyles}>
                      Group rewards by:
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        sx={{
                          ...labelStyles,
                          color: groupByDay
                            ? `${customTheme.colors.switchNoChoosenVal}`
                            : `${customTheme.colors.github}`,
                        }}
                      >
                        Epoch
                      </Typography>
                      <StyledRewardsSwitch
                        checked={groupByDay}
                        onChange={handleGroupByDay}
                      />
                      <Typography
                        sx={{
                          ...labelStyles,
                          color: groupByDay
                            ? `${customTheme.colors.github}`
                            : `${customTheme.colors.switchNoChoosenVal}`,
                        }}
                      >
                        Day
                      </Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography sx={switchLabelStyles}>Time zone:</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        sx={{
                          ...labelStyles,
                          color: useLocalTimeZone
                            ? `${customTheme.colors.switchNoChoosenVal}`
                            : `${customTheme.colors.github}`,
                        }}
                      >
                        UTC+0
                      </Typography>
                      <StyledRewardsSwitch
                        checked={useLocalTimeZone}
                        onChange={handleUseLocalTimeZone}
                      />
                      <Typography
                        sx={{
                          ...labelStyles,
                          color: useLocalTimeZone
                            ? `${customTheme.colors.github}`
                            : `${customTheme.colors.switchNoChoosenVal}`,
                        }}
                      >
                        {Intl.DateTimeFormat().resolvedOptions().timeZone}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography sx={switchLabelStyles}>View mode:</Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        '& .MuiTypography-root': {
                          fontFamily: customTheme.font.roboto,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          ...labelStyles,
                          color: isTable
                            ? `${customTheme.colors.switchNoChoosenVal}`
                            : `${customTheme.colors.github}`,
                        }}
                      >
                        Graph
                      </Typography>
                      <StyledRewardsSwitch
                        checked={isTable}
                        onChange={handleTableChange}
                      />
                      <Typography
                        sx={{
                          color: isTable
                            ? `${customTheme.colors.github}`
                            : `${customTheme.colors.switchNoChoosenVal}`,
                        }}
                      >
                        Table
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                columnGap: { xs: '15px', sm: '24px' },
                '@media (max-width: 1160px)': {
                  flexDirection: 'column',
                  rowGap: '15px',
                },
                '& canvas': {
                  height: '400px !important',
                },
              }}
            >
              {delegationsPools && delegationsPools.length > 0 && (
                <RewardsChoosePoolBlock
                  isOpen={myDelegationsPoolsSelectOpen}
                  selectTitle="DELEGATION"
                  handleSelectOpen={handleDelegateSelectOpen}
                  handleSelectClose={handleDelegateSelectClose}
                  pools={delegationsPools}
                  selectedPools={selectedDelegationsPools}
                  handlePoolsChange={handleDelegationPoolsChange}
                />
              )}
              {myPools && myPools.length > 0 && (
                <RewardsChoosePoolBlock
                  isOpen={myPoolsSelectOpen}
                  selectTitle="POOLS"
                  handleSelectOpen={handlePoolsSelectOpen}
                  handleSelectClose={handlePoolsSelectClose}
                  pools={myPools}
                  selectedPools={selectedMyPools}
                  handlePoolsChange={handlePoolsChange}
                />
              )}
            </Box>
            {!isAuthorized && (
              <Box>
                {isMobile ? (
                  <Typography
                    align="left"
                    sx={{
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                      fontFamily: customTheme.font.roboto,
                      marginTop: '12px',
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        fontFamily: 'inherit',
                        textDecoration: 'none',
                        letterSpacing: '0.05px',

                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                      component={Link}
                      to="/signin"
                      state={{ to: '/rewards', onBack: '/rewards' }}
                    >
                      sign in
                    </Typography>
                    &nbsp;to kuutamo.cloud to see your list of pools
                  </Typography>
                ) : (
                  <>
                    <Typography
                      sx={{
                        letterSpacing: '0.5px',
                        fontFamily: customTheme.font.roboto,
                        color: customTheme.colors.secondary,
                        marginTop: '16px',
                      }}
                    >
                      log in to see the pools you added manually
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: '18px',

                        width: 'fit-content',
                        marginTop: { xs: '8px', sm: '16px' },

                        '@media (max-width: 450px)': {
                          columnGap: 0,
                          justifyContent: 'space-between',
                          width: 1,
                          flexWrap: 'wrap',
                          rowGap: '16px',
                        },

                        '@media (max-width: 360px)': {
                          justifyContent: 'flex-start',
                          columnGap: 2,
                        },
                      }}
                    >
                      <Button
                        component={Link}
                        to="/signin"
                        state={{ to: '/rewards', onBack: '/rewards' }}
                        sx={{
                          backgroundColor: 'primary.main',
                          textTransform: 'uppercase',
                          color: '#FEFEFF',
                          padding: '16px 32px',
                          lineHeight: 1,
                          fontSize: '15px',
                          boxShadow: customTheme.shadows.light,
                          transition: 'opacity 0.15s',

                          '&:hover': {
                            opacity: '0.9',
                            backgroundColor: 'primary.main',
                          },
                        }}
                      >
                        login
                      </Button>
                      <Typography
                        sx={{
                          color: customTheme.colors.switchNoChoosenVal,
                          fontSize: '14px',
                        }}
                      >
                        OR
                      </Typography>
                      <Button
                        component={Link}
                        to="/signup"
                        state={{ to: '/rewards', onBack: '/rewards' }}
                        sx={{
                          padding: '16px 32px',
                          lineHeight: 1,
                          fontSize: '15px',
                          border: 1,
                          borderColor: 'primary.main',
                          color: customTheme.colors.secondary,
                        }}
                      >
                        create account
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBlock: { xs: '25px', sm: '16px' },
              }}
            >
              {(!isTable && (
                <Box>
                  <Typography
                    sx={{
                      ...switchLabelStyles,
                      display: { xs: 'block', sm: 'none' },
                    }}
                  >
                    Cumulative:
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: '400',
                        fontFamily: customTheme.font.roboto,
                        fontSize: { xs: '14px', sm: '18px' },

                        '&:last-of-type': {
                          marginLeft: '8px',
                        },
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        color: isCumulative
                          ? `${customTheme.colors.switchNoChoosenVal}`
                          : `${customTheme.colors.github}`,
                      }}
                    >
                      {width && width <= 600 ? 'No' : 'Non Cumulative'}
                    </Typography>
                    <StyledRewardsSwitch
                      checked={isCumulative}
                      onChange={handleCumulativeChange}
                    />
                    <Typography
                      sx={{
                        color: isCumulative
                          ? `${customTheme.colors.github}`
                          : `${customTheme.colors.switchNoChoosenVal}`,
                      }}
                    >
                      {width && width <= 600 ? 'Yes' : 'Cumulative'}
                    </Typography>
                  </Stack>
                </Box>
              )) || <Box></Box>}
              <Button
                variant="outlined"
                sx={{
                  padding: { xs: '4px 16px', sm: '8px 16px' },
                  border: { xs: 0, sm: 1 },
                  textTransform: 'none',
                  fontFamily: customTheme.font.roboto,
                  borderRadius: '5px',
                  '&:hover': {
                    border: { xs: 0, sm: 1 },
                  },
                }}
              >
                <Typography
                  component="a"
                  href={`data:text/csv;charset=utf-8,${csv}`}
                  download="rewards.csv"
                  sx={{
                    fontFamily: 'inherit',
                    textDecoration: 'none',
                    color: customTheme.colors.lightgrey,
                    fontSize: { xs: '10.5px', sm: '16px' },
                  }}
                >
                  Download CSV
                </Typography>
                <Box
                  sx={{
                    marginLeft: { xs: '4px', sm: '18px' },
                    width: { xs: '17px', sm: '24px' },
                    height: { xs: '17px', sm: '24px' },
                  }}
                >
                  <FileLinkIcon
                    frameColor={customTheme.colors.fileLink}
                    arrowColor={arrowColor}
                  />
                </Box>
              </Button>
            </Box>
            {myPools && myPools.length > 0 && (
              <>
                <RewardsLine
                  isTable={isTable}
                  isCumulative={isCumulative}
                  setCsv={setCsv}
                  pools={selectedMyPools}
                  accountId={wallet.accountId}
                  dateTo={dateTo}
                  dateFrom={dateFrom}
                  groupByDay={groupByDay}
                  useLocalTimeZone={useLocalTimeZone}
                />
                <Divider />
              </>
            )}

            {delegationsPools && delegationsPools.length > 0 && (
              <>
                <Typography
                  component="h1"
                  variant="h5"
                  align="center"
                  sx={{ ...titleStyles, marginTop: { xs: '20px', sm: '72px' } }}
                >
                  Delegations rewards
                </Typography>
                <RewardsLine
                  isTable={isTable}
                  isCumulative={isCumulative}
                  setCsv={setCsv}
                  pools={selectedDelegationsPools}
                  accountId={wallet.accountId}
                  dateTo={dateTo}
                  dateFrom={dateFrom}
                  groupByDay={groupByDay}
                  useLocalTimeZone={useLocalTimeZone}
                />
              </>
            )}
          </Container>
        </>
      )}
    </>
  ) : (
    <Box
      sx={{
        width: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Rewards;

