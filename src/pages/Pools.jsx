import {
  Button,
  LinearProgress,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Typography,
  IconButton,
  FormControl,
  Select,
  DialogTitle,
  Divider,
  InputAdornment,
  Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getMyPools } from '../helpers/staking';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { nearConfig } from '../helpers/nearConfig';
import { useTheme } from '@mui/material/styles';
import ChooseDialog from '../ui/components/ChooseDialog';
import FileLinkIcon from '../svg/link';
import SnackbarAlert from '../ui/components/SnackbarAlert';
import CopyIcon from '../svg/сopy';
import { StyledMenuItem } from '../ui/components/StyledSelect';
import SelectArrow from '../svg/Arrows/selectArrow';
import { getCustomThemeStyles } from '../ui/styles/theme';
import { Field, Form, Formik } from 'formik';
import { selfmonitoredInititalValue } from '../constants';
import MuiTextField from '../ui/components/MuiTextFieldFormik';
import LinkButton from '../ui/components/LinkButton';
import EyeSlashIcon from '../svg/eyeSlash';
import EyeIcon from '../svg/eye';
import SignInForgotPasModal from '../ui/components/AuthModals/SignInForgotPasModal';
import { monitoredValidator } from '../validators/monitoredValidator';
import { authService } from '../helpers/auth';
import SignUpConfirmDialog from '../ui/components/AuthModals/SignUpConfirmDialog';
import ModalWrapper from '../ui/components/AuthModalWrapper';

const Pools = ({ wallet }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isResent, setIsResent] = useState(false);
  const [secs, setSecs] = useState(60);
  const [confirmModalIsShown, setConfirmModalIsShown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [resetModalIsShown, setResetModalIsShown] = useState(false);
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [myPools, setMyPools] = useState({});
  const [myPoolsIsReady, setMyPoolsIsReady] = useState(false);
  const [openMountDialog, setOpenMountDialog] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  const servers = JSON.parse(localStorage.getItem('servers') || '[]');
  const keys = JSON.parse(localStorage.getItem('keys') || '[]');
  const [selectedPool, setSelectedPool] = useState(false);
  const [mountedPools, setMountedPools] = useState(
    JSON.parse(localStorage.getItem('mountedPools') || '{}')
  );

  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  useEffect(() => {
    (async () => {
      setMyPoolsIsReady(false);
      getMyPools(wallet)
        .then((data) => {
          setMyPools(data.myPools);
          setMyPoolsIsReady(true);
        })
        .catch((e) => {
          setWarningMsg('Error retrieving data from backend');
        });
    })();
  }, [wallet]);

  useEffect(() => {
    const token = localStorage.getItem('TOKEN');
    if (token) {
      const timeRemaining = authService.getRemainingTime(token);
      const timeInMinutes = timeRemaining / 60;
      setIsAuthorized(timeInMinutes > 0);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const _ia = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
    }
    const dataView = new DataView(arrayBuffer);
    const blob = new Blob([dataView], { type: mimeString });
    return blob;
  }

  const downloadKeyFile = () => {
    const key = localStorage.getItem('key_' + selectedPool);
    if (!key) {
      setWarningMsg('Key file not found');
      return false;
    }
    const blob = dataURItoBlob(key);
    const a = document.createElement('a');
    a.download = selectedPool + '.zip';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };

  const downloadConfigFile = () => {
    const server = servers.filter(
      (element) => element.id === mountedPools[selectedPool]
    )[0];
    const sshKey = keys.filter((element) => element.name === server.key)[0];
    if (!sshKey) {
      setWarningMsg('SSH Public Key not found');
      return false;
    }
    const devicePaths = [];
    for (let i = 0; i < server.disks; i++) {
      devicePaths.push(`/dev/nvme${i}n1`);
    }
    const disks = devicePaths.map((path) => `'${path}'`).join(', ');

    let txt = `
[host_defaults]
public_ssh_keys = [
 '''${sshKey.key}'''
]
install_ssh_user = "${server.Username}"
nixos_module = "single-node-validator-${nearConfig.networkId}"
[hosts]
[hosts.validator-00]
ipv4_address = "${server.IPv4}"
ipv4_cidr = ${server.CIDR}
ipv4_gateway = "${server.Gateway}"
disks = [${disks}]
encrypted_kuutamo_app_file = "${selectedPool}.zip"
validator_account_id = "${selectedPool}"
`;
    if (server.Provider === 'Latitude') txt += 'interface = "enp1s0f0"\n';

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.download = 'kneard.toml';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };

  const mountServer = (pool) => {
    setSelectedPool(pool);
    setWarningMsg('');
    setOpenMountDialog(true);
  };

  const handleChangeMountPool = (server, pool) => {
    const mp = mountedPools;
    mp[pool] = server;
    localStorage.setItem('mountedPools', JSON.stringify(mp));
    setMountedPools({ ...mountedPools, pool: server });
  };

  const frameColor = theme.palette.text.primary;
  const arrowColor = theme.palette.primary.main;

  const isServersExists = !!localStorage.getItem('servers');
  const isKeysExists = !!localStorage.getItem('keys');
  const poolDialogData = [
    {
      id: 1,
      onClick: downloadKeyFile,
      title: 'Step 1',
      text: 'Key file',
      icon: <FileLinkIcon frameColor={frameColor} arrowColor={arrowColor} />,
    },
    {
      id: 2,
      onClick: downloadConfigFile,
      title: 'Step 2',
      text: 'Config file',
      disabled: !(isServersExists && isKeysExists),
      icon: <FileLinkIcon frameColor={frameColor} arrowColor={arrowColor} />,
    },
    {
      id: 3,
      onClick: () =>
        window.open(
          'https://github.com/kuutamolabs/near-staking-knd#new-solo-node-install',
          '_blank'
        ),
      title: 'Step 3',
      text: 'Follow install guide',
      icon: <FileLinkIcon frameColor={frameColor} arrowColor={arrowColor} />,
    },
  ];

  const modalData = [
    {
      id: 1,
      onClick: downloadKeyFile,
      text: 'Download updated config file',
      icon: <FileLinkIcon frameColor={frameColor} arrowColor={arrowColor} />,
      containerProps: {
        sx: {
          margin: '16px 0 0 0',
          width: '360px',
        },
      },
      textProps: {
        sx: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: customTheme.font.roboto,
          fontWeight: '400',
          lineHeight: 1,
          fontSize: '18px',
          flexGrow: 1,
        },
      },
    },
  ];

  const helperTextStyle = {
    sx: {
      fontWeight: '400',
      fontFamily: customTheme.font.roboto,
      fontSize: '14px',
      position: 'absolute',
      bottom: '-20px',
    },
  };

  const copyToClipBoard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDialogClose = () => setOpenMountDialog(false);

  const customeTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  const handleResetClick = () => {
    setIsOpen(false);
    setResetModalIsShown(true);
  };

  const handleResetClose = () => {
    setResetModalIsShown(false);
    setIsOpen(true);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // const handleMonitoringClick = () => {
  //   setIsOpen(true);
  // };

  const handleMonitoringClose = () => {
    setIsOpen(false);
  };

  const handleConfirmClose = () => {
    setConfirmModalIsShown(false);
    setIsOpen(true);
  };

  const handleResendConfirmEmail = () => {
    if (email) {
      authService.resendConfirmMail(email).then((res) => {
        if (res.status === 'success') {
          setIsResent(true);
          let intervalId = setInterval(() => {
            setSecs((prev) => {
              if (prev === 0) {
                setIsResent(false);
                clearInterval(intervalId);
                return 60;
              } else {
                return prev - 1;
              }
            });
          }, 1000);
        }
      });
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    const networkId = localStorage.getItem('networkId');
    if (networkId) {
      authService
        .login({ ...values, protocol: `near-${networkId}` })
        .then(async (response) => {
          if (response && response.status === 'success') {
            setIsAuthorized(true);
            setEmail(values.email);
            const { token, user_id } = response.data;
            localStorage.setItem('USER_ID', user_id);
            localStorage.setItem('TOKEN', token);
            resetForm();
          } else if (response && response.status === 'fail') {
            if (response.message === 'Your Email has not been verified') {
              setIsOpen(false);
              setConfirmModalIsShown(true);
              authService.resendConfirmMail(values.email).then((res) => {
                if (res.status === 'success') {
                  setIsResent(true);
                  let intervalId = setInterval(() => {
                    setSecs((prev) => {
                      if (prev === 0) {
                        setIsResent(false);
                        clearInterval(intervalId);
                        return 60;
                      } else {
                        return prev - 1;
                      }
                    });
                  }, 1000);
                }
              });
            }
            setError(
              'Incorrect email/password, please, check your credentials and try again'
            );
          } else {
            setError('Something went wrong...');
          }
        });
    }
  };

  return (
    <Box
      sx={{
        width: 1,
        marginInline: { lg: '7.6%', md: '7%', xs: 'auto' },
        marginRight: 0,
        position: 'relative',
      }}
    >
      <SignUpConfirmDialog
        email={email}
        confirmModalIsShown={confirmModalIsShown}
        handleConfirmClose={handleConfirmClose}
        handleResendConfirmEmail={handleResendConfirmEmail}
        isResent={isResent}
        secs={secs}
      />
      <SignInForgotPasModal
        isOpen={resetModalIsShown}
        handleClose={handleResetClose}
      />

      <ModalWrapper
        isOpen={isOpen}
        withBackButton={false}
        closeOnBlur
        handleClose={handleMonitoringClose}
        dialogProps={{
          sx: {
            '& .MuiPaper-root': {
              maxWidth: { xs: '100%', md: '1152px' },
              bottom: '60px',
              left: '120px',
              borderRadius: '20px',
            },

            '& .MuiBackdrop-root': {
              backgroundColor: 'transparent',
              backdropFilter: 'blur(8px)',
            },
          },
        }}
      >
        <Formik
          initialValues={selfmonitoredInititalValue}
          onSubmit={handleSubmit}
          validationSchema={monitoredValidator}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ errors }) => (
            <Box sx={{ display: 'flex' }}>
              <Box
                sx={{ padding: '56px 40px 56px 88px', position: 'relative' }}
              >
                <Box
                  sx={{
                    zIndex: 2,
                    overflow: 'hidden',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 1,
                    height: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 1,
                      height: 1,
                      backgroundColor: customTheme.colors.soonBg,
                      borderRadius: '20px 0px 0px 20px',
                      opacity: 0.75,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '-20%',
                      top: '41%',
                      height: '48px',
                      transform: 'rotate(-45deg)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '24px',
                        lineHeight: 1,
                        textTransform: 'uppercase',
                        color: customTheme.colors.soon,
                        width: '106%',
                        textAlign: 'center',
                        backgroundColor: customTheme.colors.soonLineBg,
                        whiteSpace: 'nowrap',
                        padding: '12px',
                      }}
                    >
                      comming soon comming soon comming soon
                    </Typography>
                  </Box>
                </Box>
                <DialogTitle
                  sx={{
                    marginBlock: '14px 64px',
                    padding: '0',
                    textAlign: 'center',
                    fontWeight: 500,
                    lineHeight: '32px',
                    fontSize: '32px',
                  }}
                >
                  Self monitored
                </DialogTitle>
                <Box component={Form}>
                  <Field
                    name="mimir"
                    component={MuiTextField}
                    type="text"
                    label="IP of Mimir"
                    fullWidth
                    error={!!errors.mimir}
                    helperText={!!errors.mimir && errors.mimir}
                    sx={{
                      marginBottom: '32px',
                      fontSize: '16px',
                      fieldset: {
                        borderColor: `${customTheme.colors.serverLink} !important `,
                      },
                    }}
                    FormHelperTextProps={helperTextStyle}
                  />
                  <Field
                    name="loki"
                    component={MuiTextField}
                    type="text"
                    label="IP of Loki"
                    error={!!errors.loki}
                    helperText={!!errors.loki && errors.loki}
                    FormHelperTextProps={helperTextStyle}
                    fullWidth
                  />
                </Box>
                {modalData.map((dataEl) => (
                  <LinkButton key={dataEl.id} {...dataEl} />
                ))}
              </Box>
              <Divider
                orientation="vertical"
                variant="fullWidth"
                flexItem
                color={customeTheme.colors.primary}
              />
              {isAuthorized ? (
                <Box sx={{ padding: '56px 147px 93px' }}>
                  <Typography
                    variant="h3"
                    fontSize="32px"
                    lineHeight={1.5}
                    fontWeight={500}
                    marginBottom="16px"
                    textAlign="center"
                  >
                    kuutamo.cloud <br />
                    Hosted Monitoring
                  </Typography>
                  <Typography
                    margin={0}
                    color="primary"
                    fontSize="20px"
                    lineHeight={1}
                    fontFamily="Roboto, sans-serif"
                    textAlign="center"
                    marginBottom="133px"
                  >
                    {wallet.accountId.length > 16
                      ? wallet.accountId.substring(0, 8) +
                        '...' +
                        wallet.accountId.substring(wallet.accountId.length - 8)
                      : wallet.accountId}
                  </Typography>
                  <Box
                    component={Link}
                    to="/pools/data"
                    sx={{
                      marginTop: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      columnGap: '16px',
                      textDecoration: 'none',
                    }}
                  >
                    <Button
                      type="submit"
                      sx={{
                        backgroundColor: 'primary.main',
                        textTransform: 'uppercase',
                        color: 'primary.light',
                        padding: '16px 32px',
                        lineHeight: 1,
                        fontSize: '15px',
                        boxShadow: customTheme.shadows.light,
                        transition: 'opacity 0.15s',
                        fontWeight: 400,

                        '&:hover': {
                          opacity: '0.9',
                          backgroundColor: 'primary.main',
                        },
                      }}
                    >
                      SETUP
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ padding: '56px 88px 56px 40px' }}>
                  <DialogTitle
                    sx={{
                      marginBottom: '24px',
                      padding: '0',
                      textAlign: 'center',
                      fontWeight: 500,
                      lineHeight: '32px',
                      fontSize: '32px',
                    }}
                  >
                    kuutamo.cloud
                  </DialogTitle>
                  <Typography
                    sx={{
                      textAlign: 'center',
                      fontWeight: 500,
                      lineHeight: 1,
                      fontSize: '24px',
                      marginBottom: '16px',
                    }}
                  >
                    Sign in
                  </Typography>
                  <Box component={Form}>
                    <Field
                      name="email"
                      component={MuiTextField}
                      type="email"
                      label="E-mail"
                      fullWidth
                      required
                      error={!!errors.email}
                      helperText={!!errors.email && errors.email}
                      sx={{
                        marginBottom: '32px',
                        fontSize: '16px',
                        borderColor: 'primary.main',
                      }}
                      InputProps={{ name: 'email' }}
                      FormHelperTextProps={helperTextStyle}
                    />
                    <Field
                      name="password"
                      component={MuiTextField}
                      type={showPassword ? 'text' : 'password'}
                      label="Password"
                      fullWidth
                      required
                      error={!!errors.password}
                      helperText={!!errors.password && errors.password}
                      FormHelperTextProps={helperTextStyle}
                      sx={{
                        borderColor: 'primary.main',
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              sx={{ color: 'text.secondary' }}
                            >
                              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Typography
                        sx={{
                          marginTop: '16px',
                          color: 'text.secondary',
                          textDecoration: 'none',
                          fontSize: '14px',
                          lineHeight: 1,
                          width: 'fit-content',

                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                        onClick={handleResetClick}
                      >
                        Forgot Password?
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        marginTop: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        columnGap: '16px',
                      }}
                    >
                      <Button
                        type="submit"
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
                    {error && (
                      <Alert
                        sx={{
                          fontFamily: customTheme.font.roboto,
                          fontSize: '16px',
                          fontWeight: '500',
                        }}
                        severity="error"
                      >
                        {error}
                      </Alert>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Formik>
      </ModalWrapper>
      <SnackbarAlert msg={warningMsg} setMsg={setWarningMsg} severity="error" />
      <ChooseDialog
        title="Follow the steps"
        isOpen={openMountDialog}
        handleClose={handleDialogClose}
        data={poolDialogData}
        dialogProps={{
          PaperProps: {
            sx: {
              '@media (max-height:800px)': {
                top: '95px',
              },
            },
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{ fontSize: '48px', marginBottom: '8px' }}
          lineHeight={1}
          component="h1"
          variant="h4"
          align="left"
        >
          List of validators
        </Typography>
        <Button
          to="/pools/create"
          component={Link}
          variant="text"
          sx={{
            padding: '16px 32px',
            boxShadow: '0px 0px 8px rgb(0 33 71 / 10%)',
            color: 'text.primary',
            backgroundColor: 'primary.light',
            border: 'inherit',
            fontSize: '15px',
            margin: '16px 4px 16px 8px',
          }}
        >
          <img
            style={{ marginRight: '18px' }}
            src={'/icons/addsquare-' + theme.palette.mode + '.png'}
            alt="add"
          />
          New validator
        </Button>
      </Box>
      <Table aria-label="Pools">
        <TableHead>
          <TableRow>
            <TableCell>Pool</TableCell>
            <TableCell>Owner_id</TableCell>
            <TableCell>Public_key</TableCell>
            <TableCell>Fee</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(myPools).map((key, index) => (
            <TableRow
              key={index}
              sx={{
                height: '63px',
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              <TableCell scope="row">{key}</TableCell>
              <TableCell
                title={'Click to Copy to Clipboard\n' + myPools[key].owner_id}
                onClick={() => copyToClipBoard(myPools[key].owner_id)}
              >
                {myPools[key].owner_id && myPools[key].owner_id.length > 24
                  ? myPools[key].owner_id.substring(0, 12) +
                    '...' +
                    myPools[key].owner_id.substring(
                      myPools[key].owner_id.length - 12
                    )
                  : myPools[key].owner_id}
              </TableCell>
              <TableCell
                title={'Click to Copy to Clipboard\n' + myPools[key].public_key}
                onClick={() => copyToClipBoard(myPools[key].public_key)}
              >
                {myPools[key].public_key && myPools[key].public_key.length > 24
                  ? myPools[key].public_key.substring(0, 12) + '...'
                  : myPools[key].public_key}{' '}
                <IconButton
                  color="inherit"
                  sx={{
                    paddingLeft: '8px',
                    width: '32px',
                    height: '32px',
                    color: 'primary.main',
                  }}
                >
                  <CopyIcon />
                </IconButton>
              </TableCell>
              <TableCell>{myPools[key].fee}%</TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: '8px',
                  }}
                >
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/run-modal"
                    sx={{
                      backgroundColor: 'primary.main',
                      borderColor: customTheme.colors.btn,
                      color: customTheme.colors.tableBtn,
                      transition: 'filter 0.2s',

                      '&:hover': {
                        backgroundColor: 'primary.main',
                        filter: 'brightness(95%)',
                        borderColor: customTheme.colors.btn,
                      },
                    }}
                  >
                    Debug
                  </Button>
                  {/* <Button
                    variant="outlined"
                    sx={{
                      backgroundColor: 'primary.main',
                      borderColor: customTheme.colors.btn,
                      color: customTheme.colors.tableBtn,
                      transition: 'filter 0.2s',

                      '&:hover': {
                        backgroundColor: 'primary.main',
                        filter: 'brightness(95%)',
                        borderColor: customTheme.colors.btn,
                      },
                    }}
                    onClick={handleMonitoringClick}
                  >
                    Monitoring
                  </Button> */}
                  <FormControl sx={{ minWidth: 173 }} size="small">
                    <Select
                      id={'server-select' + key}
                      value={mountedPools[key] ? mountedPools[key] : ''}
                      placeholder="server"
                      onChange={(event) =>
                        handleChangeMountPool(event.target.value, key)
                      }
                      displayEmpty
                      IconComponent={(props) => <SelectArrow {...props} />}
                      sx={{
                        borderRadius: '5px !important',

                        '& .MuiInputBase-input': {
                          height: '16px',
                          padding: '4px 30px 4px 8px',
                          fontSize: '16px',
                          lineHeight: 1,
                          display: 'flex',
                          alignItems: 'center',
                        },

                        '& .MuiSelect-icon': {
                          top: 0,
                          bottom: 0,
                          right: '10px',
                          marginBlock: 'auto',
                          transform: 'rotate(90deg)',
                          transition: '0.15s',
                        },
                        '& .MuiSelect-iconOpen': {
                          transform: 'rotate(0deg)',
                        },
                      }}
                    >
                      <StyledMenuItem value="">Server</StyledMenuItem>
                      {/* TODO: filter choosen values? */}
                      {servers.map((s) => (
                        <StyledMenuItem value={s.id} key={s.id}>
                          {s.id}
                        </StyledMenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small">
                    <Button
                      variant="contained"
                      onClick={() => mountServer(key)}
                      disabled={!mountedPools[key]}
                    >
                      Manage
                    </Button>
                  </FormControl>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!myPoolsIsReady ? <LinearProgress /> : null}
    </Box>
  );
};

export default Pools;
