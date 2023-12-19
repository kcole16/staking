import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { useConfirm } from 'material-ui-confirm';
import { styled, useTheme } from '@mui/material/styles';
import * as zip from '@zip.js/zip.js';
import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '../../svg/logout';
import Logo from '../../svg/logo';
import GitHubIcon from '../../svg/github';
import { getCustomThemeStyles } from '../styles/theme';
import ChangeThemeIcon from '../../svg/changeThemeIcon';
import NotificationIcon from '../../svg/notificationIcon';
import { useState } from 'react';
import ModalWrapper from './AuthModalWrapper';
import ImportIcon from '../../svg/importIcon';
import ExportIcon from '../../svg/exportIcon';
import PassModalForm from './PassModalForm';
import SnackbarAlert from './SnackbarAlert';
import { getPools } from '../../helpers/staking';

const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const MyButton = styled(Button)(({ theme }) => ({
  minWidth: '20px',
  padding: '5px',
  fontSize: '20px',
  color: theme.palette.text.primary,
  backgroundColor: 'none',
  textTransform: 'none',
}));

const NavBar = ({ wallet, changeTheme, handleDrawerToggle }) => {
  let navigate = useNavigate();
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');
  const [dataModalIsOpen, setDataModalIsOpen] = useState(false);
  const [exportPassModalIsOpen, setExportPassModalIsOpen] = useState(false);
  const [importPassModalIsOpen, setImportPassModalIsOpen] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');
  const [file, setFile] = useState();
  const inputRef = React.useRef(null);
  const confirm = useConfirm();

  const signOut = () => {
    if (wallet.wallet.id === 'wallet-connect') {
      confirm({
        confirmationText: 'Force sign out',
        confirmationButtonProps: { autoFocus: true },
        title: 'Please confirm this action in your wallet',
        content: (
          <Box align="center">
            <CircularProgress />
          </Box>
        ),
      })
        .then(() => {
          localStorage.setItem('wc@2:client:0.3//session', '[]');
          window.location.replace(window.location.origin);
        })
        .catch(() => {});
    }
    localStorage.removeItem('USER_ID');
    localStorage.removeItem('TOKEN');
    wallet.signOut();
    navigate('/');
  };

  const handleDataModalClose = () => {
    setDataModalIsOpen(false);
  };

  const handleExportPassModalClose = () => {
    setExportPassModalIsOpen(false);
    setDataModalIsOpen(true);
  };

  const handleImportPassModalClose = () => {
    setImportPassModalIsOpen(false);
    setDataModalIsOpen(true);
  };

  const handleFileSelected = async (password) => {
    if (file && password) {
      let reader;
      try {
        reader = new zip.ZipReader(new zip.BlobReader(file), {
          password,
        });
        const entries = await reader.getEntries();
        if (entries.length) {
          const text = await entries[0].getData(new zip.TextWriter());
          if (isJsonString(text)) {
            const json = JSON.parse(text);
            Object.entries(json).forEach((objItem) => {
              const value =
                typeof objItem[1] === 'object'
                  ? JSON.stringify(objItem[1])
                  : objItem[1];

              localStorage.setItem(objItem[0], value);
            });
            setSuccessText('Imported successfully');
          } else {
            setSuccessText('');
            setErrorText('Error occurred while importing file');
          }
        }
      } catch (e) {
        setSuccessText('');
        setErrorText('Error occurred while importing file');
      } finally {
        await reader.close();
      }
    }
  };

  const downloadFile = (blob) => {
    if (!blob) return false;
    const a = document.createElement('a');
    a.download = `near.kuutamo.app.zip`;
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };

  const getExportBlob = async (password) => {
    const { myPools: pools } = await getPools(wallet);

    const mountedPools = JSON.parse(
      localStorage.getItem('mountedPools') || '{}'
    );

    const servers = JSON.parse(localStorage.getItem('servers') || '[]');
    const keys = JSON.parse(localStorage.getItem('keys') || '[]');
    const keysObj = {};
    const siteMode = localStorage.getItem('siteMode') || 'dark';
    const iframeAutoRefresh = localStorage.getItem('iframeAutoRefresh') || '5s';
    const use_own_backend_url =
      localStorage.getItem('use_own_backend_url') || '';
    const own_backend_url = localStorage.getItem('own_backend_url') || '';
    const use_own_rpc_url = localStorage.getItem('use_own_rpc_url') || '';
    const testnet_rpc_url = localStorage.getItem('testnet_rpc_url') || '';
    const mainnet_rpc_url = localStorage.getItem('mainnet_rpc_url') || '';

    if (pools.length > 0) {
      pools.forEach((pool) => {
        const currKey = localStorage.getItem(`key_${pool.pool_id}`);
        if (currKey) keysObj[`key_${pool.pool_id}`] = currKey;
      });

      const data = {
        mountedPools,
        servers,
        keys,
        ...keysObj,
        siteMode,
        iframeAutoRefresh,
        use_own_backend_url,
        own_backend_url,
        use_own_rpc_url,
        testnet_rpc_url,
        mainnet_rpc_url,
      };
      const zipWriter = new zip.ZipWriter(
        new zip.BlobWriter('application/zip')
      );

      await zipWriter.add(
        'near.kuutamo.app.json',
        new zip.TextReader(JSON.stringify(data, null, 2)),
        { password }
      );

      return await zipWriter.close();
    }
  };

  const fileSelect = async (e) => {
    const selectedFile = e?.target?.files[0];
    if (selectedFile) setFile(e.target.files[0]);

    setImportPassModalIsOpen(true);
    // if (selectedFile.type.split('/')[0] !== 'image') {
    //   return setFileDropError('Please provide an image file to upload!');
    // }

    // setFileDropError('');
  };

  const handleExportPassSubmit = (password) => {
    getExportBlob(password).then(downloadFile);
  };

  const handleImportPassSubmit = async (password) => {
    setImportPassModalIsOpen(false);
    handleFileSelected(password);
    setFile();
  };
  const handleImportPassOpen = () => {
    inputRef.current.click();
  };

  const handleExportPassOpen = () => {
    setExportPassModalIsOpen(true);
  };

  const firstLogoColor = customTheme.colors.homeLogo.start;

  const secondLogoColor = customTheme.colors.homeLogo.end;

  const data = [
    {
      icon: <ImportIcon />,
      onClick: handleImportPassOpen,
      title: 'Import Data',
      subtitle: 'Optimization of information',
    },
    {
      icon: <ExportIcon />,
      onClick: handleExportPassOpen,
      title: 'Export Data',
      subtitle: 'Maximize data export efficiency',
    },
  ];

  return (
    <>
      <SnackbarAlert
        msg={successText}
        setMsg={setSuccessText}
        severity="success"
      />
      <SnackbarAlert msg={errorText} setMsg={setErrorText} severity="error" />
      <PassModalForm
        isOpen={exportPassModalIsOpen}
        handleClose={handleExportPassModalClose}
        onSubmit={handleExportPassSubmit}
        label="Password for encrypting"
      />
      <PassModalForm
        isOpen={importPassModalIsOpen}
        handleClose={handleImportPassModalClose}
        onSubmit={handleImportPassSubmit}
        label="Password for decrypting"
        message="PLEASE READ THIS TEXT! All existing data will be replaced!"
      />
      <ModalWrapper
        isOpen={dataModalIsOpen}
        withBackButton={false}
        closeOnBlur
        handleClose={handleDataModalClose}
        dialogProps={{
          sx: {
            '& .MuiPaper-root': {
              maxWidth: { xs: '100%', md: '336px' },
              padding: '32px 40px',
              boxShadow: customTheme.shadows.modal,
            },
          },
        }}
      >
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 500,
            color: customTheme.colors.switchNoChoosenVal,
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          Tools for Trusted Data
        </Typography>
        <input ref={inputRef} type="file" onChange={fileSelect} hidden />
        {data.map((dataEl) => (
          <Box
            key={dataEl.title}
            onClick={dataEl.onClick}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              columnGap: '12px',
              '&:not(:last-child)': {
                marginBottom: '36px',
              },
            }}
          >
            <Box sx={{ width: '24px', height: '24px', color: 'primary.main' }}>
              {dataEl.icon}
            </Box>
            <Box>
              <Typography
                sx={{
                  marginLeft: '4px',
                  color: 'text.primary',
                  fontWeight: 700,
                }}
              >
                {dataEl.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: customTheme.font.roboto,
                  fontSize: '14px',
                  color: customTheme.colors.switchNoChoosenVal,
                }}
              >
                {dataEl.subtitle}
              </Typography>
            </Box>
          </Box>
        ))}
      </ModalWrapper>
      <AppBar
        position="relative"
        sx={{
          zIndex: 1301,
          height: '96px',
          justifyContent: 'center',
          color: 'inherit',
          bgcolor: 'background.default',
          borderBottom: '1px solid ',
          borderColor: 'info.main',
          backgroundImage: 'none',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          {handleDrawerToggle && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}
          >
            <Box display="flex" alignItems="center">
              <Box
                component={Link}
                to="https://github.com/kuutamolabs/near-staking-ui"
                target="_blank"
                sx={{
                  color: customTheme.colors.github,
                  textDecoration: 'none',
                }}
              >
                <IconButton
                  sx={{
                    color: customTheme.colors.github,
                    width: '56px',
                    height: '56px',
                  }}
                >
                  <GitHubIcon />
                </IconButton>
              </Box>
              <IconButton onClick={changeTheme} color="inherit">
                <ChangeThemeIcon isDarkTheme={theme.palette.mode === 'dark'} />
              </IconButton>
              <IconButton color="inherit">
                <NotificationIcon
                  backgroundColor={customTheme.colors.notificationBg}
                  bellColor={customTheme.colors.notification}
                  ringColor={customTheme.colors.notificationRing}
                />
              </IconButton>
            </Box>
          </Typography>
          <Typography component="div" sx={{ flexGrow: 1 }}>
            <Box
              display="flex"
              alignItems="center"
              sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
              pl={2}
            >
              <Box width={49} height={49}>
                <Logo
                  firstColor={firstLogoColor}
                  secondColor={secondLogoColor}
                />
              </Box>
              <Typography
                pl={1}
                pr={2}
                sx={{
                  fontWeight: 600,
                  fontSize: '32px',
                }}
              >
                kuutamo
              </Typography>
              <Typography
                pl={2}
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  borderLeft: '1px solid #D2D1DA',
                  display: { xs: 'none', md: 'block' },
                }}
              >
                protocol infrastucture
              </Typography>
            </Box>
          </Typography>
          <Box align="right" display="flex">
            <MyButton onClick={() => signOut()}>
              <LogoutIcon
                arrowColor={theme.palette.primary.main}
                doorColor={theme.palette.text.primary}
              />
            </MyButton>
            <Tooltip
              title="Click to Copy to Clipboard"
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              <MyButton
                onClick={() => {
                  navigator.clipboard.writeText(wallet.accountId);
                }}
              >
                {wallet.accountId.length > 16
                  ? wallet.accountId.substring(0, 8) +
                    '...' +
                    wallet.accountId.substring(wallet.accountId.length - 8)
                  : wallet.accountId}
              </MyButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;

