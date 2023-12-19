import { useEffect, useState } from 'react';
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Link,
  Button,
  Table,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { getStakedValidators, unstakeWithdraw } from '../../helpers/staking';
import { useTheme } from '@mui/material/styles';
import { getCustomThemeStyles } from '../styles/theme';
import { useWindowDimension } from '../../hooks/useWindowDimension';
import CurrentDelegationMobile from './currentDelegationMobileComponent';

export const YourCurrentDelegations = ({
  wallet,
  transactionHashes,
  addedPools,
}) => {
  const { width } = useWindowDimension();
  const theme = useTheme();
  const [yourCurrentDelegations, setYourCurrentDelegations] = useState([]);
  const [validatorsIsReady, setValidatorsIsReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataUnstakeWithdraw, setDataUnstakeWithdraw] = useState({});
  const [helperText, setHelperText] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [transactionHashesUW, setTransactionHashesUW] = useState(null);

  const confirm = useConfirm();
  const handleClickOpen = () => {
    setHelperText('');
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const submitUnstakeWithdraw = async (all, data = false) => {
    const dataJson = data !== false ? data : dataUnstakeWithdraw;
    if (
      wallet.wallet.id === 'ledger' ||
      wallet.wallet.id === 'wallet-connect'
    ) {
      try {
        setHelperText('Please confirm transaction on ' + wallet.wallet.id);
        setAlertSeverity('info');
        const r = await unstakeWithdraw(wallet, { ...dataJson, all: all });
        if (r.status.hasOwnProperty('SuccessValue')) {
          setHelperText('Success!');
          setTransactionHashesUW(r.transaction.hash);
          setAlertSeverity('success');
        }
        if (r.status.hasOwnProperty('Failure')) {
          setHelperText(JSON.stringify(r.status.Failure.ActionError));
          setAlertSeverity('error');
        }
      } catch (e) {
        setHelperText(e.message);
        setAlertSeverity('error');
      }
    } else {
      setHelperText('Approve Transaction. Redirect...');
      await unstakeWithdraw(wallet, { ...dataJson, all: all });
    }
  };

  const handleUnstakeMaxClick = (row) => {
    setDataUnstakeWithdraw({
      cmd: 'unstake',
      pool: row.account_id,
    });
    if (row.canWithdraw && row.unstakedBalance > 0) {
      confirm({
        confirmationText: 'Continue',
        confirmationButtonProps: { autoFocus: true },
        description:
          'You have funds available to widthdraw now, if you unstake more, these funds will be locked for 4 epochs',
      })
        .then(() => {
          setDataUnstakeWithdraw({
            cmd: 'unstake',
            pool: row.account_id,
          });
          handleClickOpen();
          submitUnstakeWithdraw(true, {
            cmd: 'unstake',
            pool: row.account_id,
          }).then();
        })
        .catch(() => {});
    } else {
      setDataUnstakeWithdraw({
        cmd: 'unstake',
        pool: row.account_id,
      });
      handleClickOpen();
      submitUnstakeWithdraw(true, {
        cmd: 'unstake',
        pool: row.account_id,
      }).then();
    }
  };

  const handleUnstakeClick = (row) => {
    setDataUnstakeWithdraw({
      cmd: 'unstake',
      pool: row.account_id,
    });
    if (row.canWithdraw && row.unstakedBalance > 0)
      confirm({
        confirmationText: 'Continue',
        confirmationButtonProps: { autoFocus: true },
        description:
          'You have funds available to widthdraw now, if you unstake more, these funds will be locked for 4 epochs',
      })
        .then(() => {
          handleClickOpen();
        })
        .catch(() => {});
    else handleClickOpen();
  };

  const handleWithdrawClick = (row) => {
    setDataUnstakeWithdraw({
      cmd: 'withdraw',
      pool: row.account_id,
    });
    handleClickOpen();
  };

  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  useEffect(() => {
    setValidatorsIsReady(false);
    (async () => {
      const stakedValidators = await getStakedValidators(wallet);
      setYourCurrentDelegations(stakedValidators);
      setValidatorsIsReady(true);
    })();
  }, [wallet, transactionHashes, transactionHashesUW, addedPools]);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Typography
          component="h1"
          variant="h5"
          sx={{ textAlign: { xs: 'center', lg: 'left' } }}
          pt={4}
          pb={1}
        >
          Your current delegations
        </Typography>
        <Dialog open={open}>
          <DialogTitle id="alert-dialog-title">
            Please confirm {dataUnstakeWithdraw.cmd}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dataUnstakeWithdraw.pool}
            </DialogContentText>
            {!helperText ? (
              <TextField
                type="number"
                margin="normal"
                required
                fullWidth
                id="amount"
                label="Amount"
                autoComplete="off"
                value={dataUnstakeWithdraw.amount || 0}
                onChange={(e) =>
                  setDataUnstakeWithdraw({
                    ...dataUnstakeWithdraw,
                    amount: e.target.value,
                  })
                }
              />
            ) : (
              <></>
            )}
          </DialogContent>
          {helperText ? (
            <Stack sx={{ width: '100%' }} pb={1}>
              <Alert severity={alertSeverity} mb={2}>
                {helperText}{' '}
                {transactionHashesUW ? (
                  <Link
                    href={
                      wallet.walletSelector.options.network.explorerUrl +
                      '/transactions/' +
                      transactionHashesUW
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
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Close
            </Button>
            {!helperText ? (
              <>
                <Button
                  onClick={() => {
                    submitUnstakeWithdraw(false).then();
                  }}
                  variant="contained"
                >
                  {dataUnstakeWithdraw.cmd}
                </Button>
                <Button
                  onClick={() => {
                    submitUnstakeWithdraw(true).then();
                  }}
                  variant="contained"
                >
                  {dataUnstakeWithdraw.cmd} all
                </Button>
              </>
            ) : (
              <></>
            )}
          </DialogActions>
        </Dialog>
        {(width && width > 1200 && (
          <>
            <Table aria-label="Your Current Validators">
              <TableHead>
                <TableRow>
                  <TableCell>Validator</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Staked</TableCell>
                  <TableCell>Unstaked</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {yourCurrentDelegations.map((row) => (
                  <TableRow key={row.account_id}>
                    <TableCell component="th" scope="row">
                      {row.account_id}
                    </TableCell>
                    <TableCell>{row.fee}%</TableCell>
                    <TableCell>{row.totalBalance}</TableCell>
                    <TableCell>{row.stakedBalance}</TableCell>
                    <TableCell>{row.unstakedBalance}</TableCell>
                    <TableCell align="center" sx={{ maxWidth: '200px' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        sx={{ maxWidth: '200px' }}
                        disabled={row.stakedBalance <= 0}
                        onClick={() => handleUnstakeClick(row)}
                      >
                        unstake
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 1, maxWidth: '200px' }}
                        disabled={row.stakedBalance <= 0}
                        onClick={() => handleUnstakeMaxClick(row)}
                      >
                        unstake max
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1, maxWidth: '200px' }}
                        disabled={!row.canWithdraw || row.unstakedBalance <= 0}
                        onClick={() => handleWithdrawClick(row)}
                      >
                        withdraw
                      </Button>
                      {!row.canWithdraw && row.unstakedBalance > 0 && (
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: customTheme.colors.delegationWithdraw,
                          }}
                        >
                          {row.leftToWithdraw}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!validatorsIsReady ? (
              <Grid item xs={12}>
                <LinearProgress />
              </Grid>
            ) : null}
          </>
        )) || (
          <Box>
            {validatorsIsReady ? (
              yourCurrentDelegations.map((delegation) => (
                <CurrentDelegationMobile
                  key={delegation.account_id}
                  name={delegation.account_id}
                  fee={delegation.fee}
                  canWithdraw={delegation.canWithdraw}
                  total={delegation.totalBalance}
                  staked={delegation.stakedBalance}
                  unstaked={delegation.unstakedBalance}
                  handleWithdrawClick={() => handleWithdrawClick(delegation)}
                  handleUnstakeClick={() => handleUnstakeClick(delegation)}
                  handleUnstakeMaxClick={() =>
                    handleUnstakeMaxClick(delegation)
                  }
                />
              ))
            ) : (
              <CircularProgress color="primary" />
            )}
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

