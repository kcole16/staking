import {
  Alert,
  Container,
  FormControl,
  FormControlLabel,
  Stack,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import ModalWrapper from '../ui/components/AuthModalWrapper';
import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import {
  getKuutamoValidators,
  getMyPools,
  stakeToKuutamoPool,
  yoctoNEAR,
} from '../helpers/staking';
import { YourCurrentDelegations } from '../ui/components/YourCurrentDelegations';
import * as nearAPI from 'near-api-js';
import Decimal from 'decimal.js';
import SnackbarAlert from '../ui/components/SnackbarAlert';
import { nearConfig } from '../helpers/nearConfig';
import { authService } from '../helpers/auth';
import { Link } from 'react-router-dom';
import AddSquare from '../svg/addSquare';
import MinusSquare from '../svg/minusSquare';
import { getCustomThemeStyles } from '../ui/styles/theme';
import { useWindowDimension } from '../hooks/useWindowDimension';
import SelectArrow from '../svg/Arrows/rewardsSelectArrow';
import DelegationsPoolBlock from '../ui/components/DelegationsPoolBlock';

const StakeToKuutamoPool = ({ wallet }) => {
  const { width } = useWindowDimension();
  const theme = useTheme();
  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [transactionHashes, setTransactionHashes] = useState(null);
  const [showAllPools, setShowAllPools] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [token, setNewToken] = useState(localStorage.getItem('TOKEN') || '');
  const [kuutamoValidators, setKuutamoValidators] = useState([]);
  const [addedPools, setAddedPools] = useState({});
  const [validators, setValidators] = useState([]);
  const [myPools, setMyPools] = useState({});
  const [poolName, setPoolName] = useState('');
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(null);
  const [warningMsg, setWarningMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('transactionHashes') && wallet.accountId) {
      window.history.replaceState(null, '', 'stake');
      setHelperText('Success!');
      setTransactionHashes(params.get('transactionHashes'));
      onStaked(wallet);
    }
    (async () => {
      wallet
        .getValidatorsByBlockId()
        .then((data) =>
          setValidators(
            data.current_validators.filter(
              (validator) =>
                !/^node\d+$/.test(validator.account_id) ?? validator
            )
          )
        )
        .catch((e) => setWarningMsg('Error retrieving validators'));
      getMyPools(wallet)
        .then((data) => {
          setMyPools(data.myPools);
          setAddedPools(data.addedPools);
        })
        .catch((e) =>
          setWarningMsg('Error retrieving your pools from backend')
        );
      getKuutamoValidators(wallet)
        .then((data) => {
          setKuutamoValidators(data);
        })
        .catch((e) =>
          setWarningMsg('Error retrieving kuutamo pools from backend')
        );
      wallet
        .getAccountBalance(wallet.accountId)
        .then((data) => setBalance(data))
        .catch((e) => setWarningMsg('Error retrieving account balance'));
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

  const onStaked = (wallet) => {
    (async () => {
      getMyPools(wallet)
        .then((data) => {
          setMyPools(data.myPools);
          setAddedPools(data.addedPools);
        })
        .catch((e) =>
          setWarningMsg('Error retrieving your pools from backend')
        );
    })();
  };

  const onConfirmClick = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        network: nearConfig.networkId,
        account_id: wallet.accountId,
        pool_id: poolName,
      }),
    };
    await fetch(nearConfig.backendUrl + 'pools/add', requestOptions)
      .then(async (response) => {
        await response.json();
        setPoolName(null);
        setSearchVal('');
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });

    getMyPools(wallet)
      .then((data) => {
        setMyPools(data.myPools);
        setAddedPools(data.addedPools);
      })
      .catch((e) => setWarningMsg('Error retrieving your pools from backend'));
    setShowAllPools(false);
  };

  const removePool = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        network: nearConfig.networkId,
        account_id: wallet.accountId,
        pool_id: poolName,
      }),
    };
    await fetch(nearConfig.backendUrl + 'pools/remove', requestOptions)
      .then(async (response) => {
        await response.json();
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
    getMyPools(wallet)
      .then((data) => {
        setMyPools(data.myPools);
        setAddedPools(data.addedPools);
      })
      .catch((e) => setWarningMsg('Error retrieving your pools from backend'));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amountStake =
      event.target.name === 'stakeMax'
        ? new Decimal(balance.available).div(yoctoNEAR).minus('0.2').toFixed(5)
        : amount;
    if (!poolName) {
      setHelperText('Please select a pool');
      setError(true);
    } else if (event.target.name === 'stake' && amountStake <= 0) {
      setHelperText('Please enter the amount');
      setError(true);
    } else {
      setHelperText('');
      setError(false);
      setIsSubmit(true);
      if (
        wallet.wallet.id === 'ledger' ||
        wallet.wallet.id === 'wallet-connect'
      ) {
        try {
          setHelperText('Please confirm transaction on ' + wallet.wallet.id);
          setAlertSeverity('info');
          const r = await stakeToKuutamoPool(wallet, poolName, amountStake);
          if (r.status.hasOwnProperty('SuccessValue')) {
            setPoolName(null);
            setAmount(0);
            setHelperText('Success!');
            setTransactionHashes(r.transaction.hash);
            setAlertSeverity('success');
            onStaked(wallet);
          }
          if (r.status.hasOwnProperty('Failure')) {
            setError(true);
            setHelperText(JSON.stringify(r.status.Failure.ActionError));
          }
        } catch (e) {
          setHelperText(e.message);
          setError(true);
        }
      } else {
        await stakeToKuutamoPool(wallet, poolName, amountStake);
      }
      setIsSubmit(false);
    }
  };

  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  const radioLabel = {
    marginBottom: '16px',
    '&:last-of-type': { marginBottom: 0 },

    '& .Mui-checked + span': {
      '& .dot': {
        backgroundColor: 'primary.main',
      },

      '& .modalLabel': {
        backgroundColor: customTheme.colors.delegationSelected,
        color: customTheme.colors.delegationHoverColor,
      },
    },

    '& .MuiTypography-root': {
      fontFamily: customTheme.font.roboto,
      letterSpacing: '0.5px',
      width: 1,
    },
  };

  const dotLabel = {
    width: '8px',
    height: '9px',
    borderRadius: '50%',
    backgroundColor: '#D2D1DA',
    transition: 'all 0.15s',
  };

  const labelContainer = {
    display: 'flex',
    alignItems: 'center',
    columnGap: '12px',
    paddingLeft: '20px',
  };

  const menuStyles = {
    '& .MuiPaper-root': {
      border: 1,
      borderColor: customTheme.colors.delegationDivider,
      boxShadow: 'none',
      borderRadius: '0 0 5px 5px',
    },
    '& .MuiList-root': {
      padding: 0,
      backgroundColor: customTheme.colors.tableBtn,
    },

    '& .Mui-selected': {
      '& .dot': {
        backgroundColor: 'primary.main',
      },
    },

    '& .MuiMenuItem-root': {
      minHeight: 0,
      paddingBlock: '8px',

      '& label': {
        marginLeft: 0,
      },
    },
  };

  const selectStyles = {
    '& .MuiInputBase-input': {
      padding: '4px 16px',
      textAlign: 'left',
      fontWeight: 500,
      letterSpacing: '0.5px',
      border: 1,
      borderColor: customTheme.colors.delegationDivider,
    },

    '& fieldset': {
      border: 1,
      borderColor: customTheme.colors.delegationDivider,
    },

    '&.Mui-focused fieldset': {
      border: 'inherit !important',
      borderColor: `${customTheme.colors.delegationDivider} !important`,
    },

    '& .MuiSelect-icon': {
      color: 'text.primary',
      top: 0,
      bottom: 0,
      right: '16px',
      marginBlock: 'auto',
      transform: 'rotate(90deg)',
      transition: '0.15s',
    },
    '& .MuiSelect-iconOpen': {
      transform: 'rotate(0deg)',
    },
  };

  const handlePoolsOpen = () => {
    setPoolName('');
    setShowAllPools(true);
  };

  const handlePoolsClose = () => {
    setSearchVal('');
    setShowAllPools(false);
  };

  const handleSearchChange = (e) => {
    if (e.target.value.length === 1 && poolName !== '') {
      setPoolName('');
    }
    setSearchVal(e.target.value);
  };

  const filteredPools = validators.filter(
    (validator) =>
      !Object.keys(addedPools).includes(validator.account_id) &&
      validator.account_id.includes(searchVal)
  );

  const isMobile = width && width < 600;

  const handlePoolNameChange = (e) => setPoolName(e.target.value[1]);

  const handleRadioPoolNameChange = (e) => setPoolName(e.target.value);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setIsSubmit(false);
  };

  const frameColor = theme.palette.text.primary;
  const signColor = theme.palette.primary.main;

  const memoizedDelegation = useMemo(
    () => (
      <YourCurrentDelegations
        wallet={wallet}
        transactionHashes={transactionHashes}
        addedPools={Object.keys(addedPools)}
      />
    ),
    [addedPools, wallet, transactionHashes]
  );

  return (
    <>
      <ModalWrapper
        isOpen={showAllPools}
        withBackButton
        handleClose={handlePoolsClose}
        dialogProps={{
          sx: {
            zIndex: 1303,
            '& .MuiPaper-root': {
              maxWidth: { xs: '100%', md: '576px' },
              boxShadow: customTheme.shadows.modal,
            },
          },
        }}
      >
        <Box sx={{ padding: { xs: '22px 25px 25px', sm: '16px 64px 64px' } }}>
          <FormControl sx={{ marginBottom: '16px' }} fullWidth>
            <TextField
              value={searchVal}
              id="search"
              name="search"
              label="Search"
              InputLabelProps={{ shrink: true }}
              onChange={handleSearchChange}
            />
          </FormControl>
          <Box
            sx={{
              width: filteredPools.length <= 8 ? 1 : 'calc(100% - 20px)',
              border:
                theme.palette.mode === 'dark'
                  ? '1px solid #565c6c'
                  : '1px solid #D2D1DA',
              borderRadius: '5px',
              marginBottom: '32px',
            }}
          >
            {(filteredPools.length === 0 && (
              <Typography
                sx={{
                  letterSpacing: '0.05px',
                  fontFamily: customTheme.font.roboto,
                  padding: '8px 16px',
                  color: customTheme.colors.fileLink,
                }}
              >
                not one pool yet
              </Typography>
            )) || (
              <Box
                sx={{
                  height: '320px',
                  width: 'calc(100% + 20px)',
                  overflow: 'hidden auto',
                  scrollbarColor: `${theme.palette.primary.main} ${customTheme.colors.delegationScrollbar}`,

                  '::-webkit-scrollbar': {
                    width: '12px',
                    backgroundColor: customTheme.colors.delegationScrollbar,
                    borderRadius: '5px',
                  },

                  '::-webkit-scrollbar-thumb': {
                    backgroundColor: 'primary.main',
                    borderRadius: '5px',
                  },
                }}
              >
                <Stack
                  sx={{
                    width: 1,
                    height: 1,
                  }}
                >
                  <RadioGroup
                    aria-labelledby="pool-label"
                    name="poolName"
                    value={poolName}
                    align="left"
                    onChange={handleRadioPoolNameChange}
                  >
                    {filteredPools.map((validator) => (
                      <FormControlLabel
                        key={validator.account_id}
                        value={validator.account_id}
                        control={
                          <Radio size="small" sx={{ display: 'none' }} />
                        }
                        label={
                          <Box
                            className="modalLabel"
                            sx={{
                              ...labelContainer,
                              paddingBlock: '8px',
                              transition: '0.15s',

                              '&:hover': {
                                backgroundColor:
                                  customTheme.colors.delegationHover,
                              },
                            }}
                          >
                            <Box
                              component="span"
                              sx={dotLabel}
                              className="dot"
                            />
                            {validator.account_id}
                          </Box>
                        }
                        sx={{
                          ...radioLabel,
                          margin: 0,
                          width:
                            filteredPools.length <= 8
                              ? 'calc(100% - 20px)'
                              : 'calc(100% - 8px)',

                          '@-moz-document url-prefix()': {
                            width: 'calc(100% - 20px)',
                          },
                        }}
                      />
                    ))}
                  </RadioGroup>
                </Stack>
              </Box>
            )}
          </Box>
          <Box sx={{ width: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              disabled={
                poolName === '' ||
                validators.filter((validator) =>
                  validator.account_id.includes(poolName)
                ).length === 0
              }
              onClick={onConfirmClick}
              variant="contained"
              sx={{
                padding: '16px 32px',
                lineHeight: 1,
                fontSize: '15px',
                color: customTheme.colors.tertiary,
              }}
            >
              CONFIRM
            </Button>
          </Box>
        </Box>
      </ModalWrapper>
      <Container
        align="center"
        sx={{
          marginInline: { xs: '0', md: '50px 0', lg: '100px 0' },
          '@media (min-width: 1200px)': {
            maxWidth: 'none',
            paddingInline: '0 48px',
          },
        }}
      >
        <SnackbarAlert
          msg={warningMsg}
          setMsg={setWarningMsg}
          severity="error"
        />
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Typography
              component="h1"
              variant="h4"
              lineHeight={1}
              fontWeight={500}
              fontSize={{ xs: '24px', sm: '32px' }}
            >
              Stake to a kuutamo pool
            </Typography>
            <Typography
              component="h1"
              variant="h6"
              lineHeight={1}
              marginTop={1}
              fontSize={{ xs: '14px', sm: '18px', fontWeight: 400 }}
            >
              Balance:{' '}
              {balance
                ? nearAPI.utils.format.formatNearAmount(balance.available, 5)
                : '-'}{' '}
              NEAR
            </Typography>
            <Box pt={1} pb={{ xs: 3, sm: 2 }}>
              <Box width="fit-content">
                <Box
                  width={1}
                  display="flex"
                  justifyContent="center"
                  rowGap={1}
                  columnGap={2}
                  flexWrap={{ xs: 'nowrap', sm: 'wrap' }}
                >
                  <FormControl error={error} variant="standard">
                    <TextField
                      type="number"
                      required
                      id="amount"
                      label="Amount"
                      autoComplete="off"
                      value={amount}
                      name="amount"
                      sx={{
                        width: { xs: 1, sm: '420px' },

                        '& .MuiInputBase-root': {
                          height: { xs: '40px', sm: '48px' },
                        },

                        '& fieldset': {
                          borderRadius: { xs: '5px', sm: '10px' },
                        },
                      }}
                      onChange={handleAmountChange}
                    />
                  </FormControl>
                  <Box
                    sx={{
                      display: 'flex',
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleSubmit}
                      disabled={isSubmit}
                      name="stake"
                      sx={{
                        width: { xs: '88px', sm: '140px' },
                        height: { xs: '40px', sm: '48px' },
                        color: 'text.primary',
                        fontWeight: 400,
                        borderRadius: { xs: '5px', sm: '10px' },
                        padding: '10px 16px',
                      }}
                    >
                      Stake
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleSubmit}
                      disabled={isSubmit}
                      name="stakeMax"
                      sx={{
                        marginLeft: '8px',
                        minWidth: { xs: '0', sm: '64px' },
                        width: { xs: 'fit-content', sm: '140px' },
                        height: { xs: '40px', sm: '48px' },
                        color: 'text.primary',
                        fontWeight: 400,
                        borderRadius: { xs: '5px', sm: '10px' },
                        padding: '10px 8px',
                      }}
                    >
                      {width < 600 ? 'MAX' : 'Stake max'}
                    </Button>
                  </Box>
                </Box>
                {helperText ? (
                  <Stack sx={{ width: '100%' }} paddingBlock={1}>
                    <Alert severity={error ? 'error' : alertSeverity} mb={2}>
                      {helperText}{' '}
                      {!error && transactionHashes ? (
                        <Link
                          to={
                            wallet.walletSelector.options.network.explorerUrl +
                            '/transactions/' +
                            transactionHashes
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          View on Explorer
                        </Link>
                      ) : null}
                    </Alert>
                  </Stack>
                ) : null}
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flexDirection: { xs: 'column', sm: 'row' },
                rowGap: '16px',

                '@media (max-width: 1780px)': {
                  justifyContent: 'space-evenly',
                },
              }}
            >
              <Box sx={{ width: { xs: 1, sm: '412px' } }}>
                {(isMobile && (
                  <Select
                    multiple
                    fullWidth
                    variant="outlined"
                    value={[
                      kuutamoValidators
                        .map((validator) => validator.account_id)
                        .includes(poolName)
                        ? poolName
                        : '',
                    ]}
                    inputProps={{ id: 'kuutamo-validators' }}
                    onChange={handlePoolNameChange}
                    displayEmpty
                    renderValue={() => 'kuutamo verified pools'}
                    IconComponent={(props) => <SelectArrow {...props} />}
                    sx={selectStyles}
                    MenuProps={{
                      sx: menuStyles,
                    }}
                  >
                    <MenuItem
                      disabled
                      value=""
                      sx={{
                        padding: 0,
                        fontFamily: customTheme.font.roboto,
                        letterSpacing: '0.05px',
                        display: 'none',
                      }}
                    >
                      <Box sx={labelContainer}>
                        <Box component="span" sx={dotLabel} className="dot" />
                        Select
                      </Box>
                    </MenuItem>
                    {kuutamoValidators.map((validator) => (
                      <MenuItem
                        key={validator.account_id}
                        value={validator.account_id}
                        sx={{
                          padding: 0,
                          fontFamily: customTheme.font.roboto,
                          letterSpacing: '0.05px',
                        }}
                      >
                        <Box sx={labelContainer}>
                          <Box component="span" sx={dotLabel} className="dot" />
                          {validator.account_id}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                )) || (
                  <>
                    <Typography
                      component="h3"
                      variant="h6"
                      align="left"
                      mb={2}
                      fontSize={20}
                      fontWeight={500}
                      lineHeight={1.2}
                    >
                      kuutamo verified pools
                    </Typography>
                    <DelegationsPoolBlock
                      data={kuutamoValidators.map((val) => val.account_id)}
                      handleChange={handleRadioPoolNameChange}
                      value={poolName}
                    />
                  </>
                )}
              </Box>
              <Box sx={{ width: { xs: 1, sm: '412px' } }}>
                {(isMobile && (
                  <Select
                    fullWidth
                    variant="outlined"
                    multiple
                    value={[
                      Object.keys(myPools).includes(poolName) ? poolName : '',
                    ]}
                    inputProps={{ id: 'my-validators' }}
                    onChange={handlePoolNameChange}
                    displayEmpty
                    renderValue={() => 'Pools this near account owns'}
                    IconComponent={(props) => <SelectArrow {...props} />}
                    sx={selectStyles}
                    MenuProps={{
                      sx: menuStyles,
                    }}
                  >
                    <MenuItem
                      disabled
                      value=""
                      sx={{
                        padding: 0,
                        fontFamily: customTheme.font.roboto,
                        letterSpacing: '0.05px',
                        display: 'none',
                      }}
                    >
                      <Box sx={labelContainer}>
                        <Box component="span" sx={dotLabel} className="dot" />
                        Select
                      </Box>
                    </MenuItem>
                    {Object.keys(myPools).map((validator) => (
                      <MenuItem
                        key={validator}
                        value={validator}
                        sx={{
                          padding: 0,
                          fontFamily: customTheme.font.roboto,
                          letterSpacing: '0.05px',
                        }}
                      >
                        <Box sx={labelContainer}>
                          <Box component="span" sx={dotLabel} className="dot" />
                          {validator}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                )) || (
                  <>
                    <Typography
                      component="h3"
                      variant="h6"
                      align="left"
                      fontSize={20}
                      fontWeight={500}
                      lineHeight={1.2}
                      mb={2}
                    >
                      Pools this near account owns
                    </Typography>
                    <DelegationsPoolBlock
                      data={Object.keys(myPools)}
                      handleChange={handleRadioPoolNameChange}
                      value={poolName}
                    />
                  </>
                )}
              </Box>
              <Box sx={{ width: { xs: 1, sm: '412px' } }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-end', sm: 'space-between' },
                    alignItems: 'center',
                    marginBottom: { xs: isAuthorized ? '8px' : 0, sm: '16px' },
                  }}
                >
                  {!isMobile && (
                    <Typography
                      component="h3"
                      variant="h6"
                      align="left"
                      fontSize={20}
                      fontWeight={500}
                      lineHeight={1.2}
                    >
                      Other pools
                    </Typography>
                  )}
                  {isAuthorized && (
                    <Box
                      sx={{
                        display: 'flex',
                        columnGap: '8px',
                        height: '24px',
                      }}
                    >
                      <Button sx={{ width: '76px' }} onClick={handlePoolsOpen}>
                        Add
                        <Box
                          component="span"
                          sx={{
                            width: '24px',
                            height: '24px',
                            marginLeft: '8px',
                          }}
                        >
                          <AddSquare
                            frameColor={frameColor}
                            signColor={signColor}
                          />
                        </Box>
                      </Button>
                      <Button sx={{ width: '104px' }} onClick={removePool}>
                        Remove
                        <Box
                          component="span"
                          sx={{
                            width: '24px',
                            height: '24px',
                            marginLeft: '8px',
                          }}
                        >
                          <MinusSquare
                            frameColor={frameColor}
                            signColor={signColor}
                          />
                        </Box>
                      </Button>
                    </Box>
                  )}
                </Box>
                {(isAuthorized && (
                  <>
                    {(isMobile && (
                      <Select
                        fullWidth
                        variant="outlined"
                        multiple
                        value={[
                          Object.keys(addedPools).includes(poolName)
                            ? poolName
                            : '',
                        ]}
                        inputProps={{ id: 'added-validators' }}
                        onChange={handlePoolNameChange}
                        displayEmpty
                        renderValue={() => 'Other pools'}
                        IconComponent={(props) => <SelectArrow {...props} />}
                        sx={selectStyles}
                        MenuProps={{
                          sx: menuStyles,
                        }}
                      >
                        <MenuItem
                          disabled
                          value=""
                          sx={{
                            padding: 0,
                            fontFamily: customTheme.font.roboto,
                            letterSpacing: '0.05px',
                            display: 'none',
                          }}
                        >
                          <Box sx={labelContainer}>
                            <Box
                              component="span"
                              sx={dotLabel}
                              className="dot"
                            />
                            Select
                          </Box>
                        </MenuItem>
                        {Object.keys(addedPools).map((validator) => (
                          <MenuItem
                            key={validator}
                            value={validator}
                            sx={{
                              padding: 0,
                              fontFamily: customTheme.font.roboto,
                              letterSpacing: '0.05px',
                            }}
                          >
                            <Box sx={labelContainer}>
                              <Box
                                component="span"
                                sx={dotLabel}
                                className="dot"
                              />
                              {validator}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    )) || (
                      <DelegationsPoolBlock
                        data={Object.keys(addedPools)}
                        handleChange={handleRadioPoolNameChange}
                        value={poolName}
                      />
                    )}
                  </>
                )) || (
                  <Box>
                    {(isMobile && (
                      <>
                        <Typography
                          align="left"
                          sx={{
                            fontWeight: 500,
                            color: customTheme.colors.secondary,
                          }}
                        >
                          Other pools
                        </Typography>
                        <Typography
                          align="left"
                          sx={{
                            fontSize: '14px',
                            letterSpacing: '0.5px',
                            fontFamily: customTheme.font.roboto,
                          }}
                        >
                          <Typography
                            sx={{
                              color: 'primary.main',
                              fontWeight: 700,

                              textDecoration: 'none',
                              letterSpacing: '0.05px',

                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                            component={Link}
                            to="/signin"
                            state={{ to: '/stake', onBack: '/stake' }}
                          >
                            sign in
                          </Typography>
                          &nbsp;to kuutamo.cloud to curate a custom list of
                          pools
                        </Typography>
                      </>
                    )) || (
                      <>
                        <Typography
                          align="left"
                          sx={{
                            letterSpacing: '0.5px',
                            fontFamily: customTheme.font.roboto,
                          }}
                          mb={3}
                        >
                          sign in to kuutamo.cloud to curate a custom list of
                          pools
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            columnGap: '16px',
                          }}
                        >
                          <Button
                            component={Link}
                            to="/signin"
                            state={{ to: '/stake', onBack: '/stake' }}
                            sx={{
                              backgroundColor: 'primary.main',
                              textTransform: 'uppercase',
                              color: 'primary.light',
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
                            log in
                          </Button>
                          <Typography>OR</Typography>
                          <Button
                            component={Link}
                            to="/signup"
                            state={{ to: '/stake', onBack: '/stake' }}
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
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            {memoizedDelegation}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default StakeToKuutamoPool;

