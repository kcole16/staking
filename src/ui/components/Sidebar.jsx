import TreeView from '@mui/lab/TreeView';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  Radio,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getCustomThemeStyles } from '../styles/theme';
import React, { useState } from 'react';
import { TreeItem, treeItemClasses } from '@mui/lab';
import { nearConfig } from '../../helpers/nearConfig';
import { Link } from 'react-router-dom';
import { drawerWidth } from '../../constants';
import { useTheme } from '@emotion/react';

export const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.primary,
  [`& .${treeItemClasses.content}`]: {
    fontSize: '20px',
    backgroundColor: theme.palette.primary.light,
    border: 1,
    borderStyle: 'solid',
    borderColor: '#D2D1DA',
    width: '264px',
    color: theme.palette.text.primary,
    borderRadius: '10px',
    fontWeight: 400,
    height: '50px',
    transition: '0.15s',

    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      border:
        theme.palette.mode === 'dark'
          ? '1px solid #36DFD3'
          : '1px solid #802FF3',
      color: getCustomThemeStyles(theme.palette.mode === 'dark').colors
        .tertiary,
    },

    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: theme.palette.primary.main,
      border:
        theme.palette.mode === 'dark'
          ? '1px solid #36DFD3'
          : '1px solid #802FF3',
      color: getCustomThemeStyles(theme.palette.mode === 'dark').colors
        .tertiary,
      boxShadow: getCustomThemeStyles(theme.palette.mode === 'dark').shadows
        .main,
    },
    [`& .${treeItemClasses.label}`]: {
      fontSize: '20px',
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },

  '& li': {
    margin: '8px 0 0 8px',
  },

  [`& .${treeItemClasses.group}`]: {
    [`& .${treeItemClasses.content}`]: {
      width: '238px',
      height: '42px',

      '&.Mui-selected': {
        boxShadow: getCustomThemeStyles(theme.palette.mode === 'dark').shadows
          .main,
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.text.primary,
      },

      '&:hover': {
        boxShadow: getCustomThemeStyles(theme.palette.mode === 'dark').shadows
          .main,
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.text.primary,
      },
    },
  },

  '&.withoutSpace': {
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: '24px',

      '& span': {
        color: theme.palette.primary.main,
      },

      '&:hover span': {
        color: theme.palette.text.primary,
      },
    },
    '& .MuiTreeItem-iconContainer': {
      width: 0,
      marginRight: 0,
    },
  },
}));

const StyledTreeHeader = ({ labelText, disabled, ...other }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <StyledTreeItemRoot
        sx={{
          margin: '16px 0 0 8px',
        }}
        disabled={disabled}
        label={
          <Typography
            variant="body2"
            sx={{ fontWeight: 'inherit', fontSize: 'inherit', flexGrow: 1 }}
          >
            {labelText}
          </Typography>
        }
        {...other}
      />
    </Box>
  );
};

const StyledTreeItem = ({
  labelText,
  to,
  disabled,
  state,
  target = '_self',
  ...other
}) => {
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center' }}
      state={state}
      to={to}
      target={target}
      component={Link}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <StyledTreeItemRoot
        sx={{
          margin: '16px 0 0 8px',
        }}
        disabled={disabled}
        label={
          <Typography
            variant="body2"
            sx={{ fontWeight: 'inherit', fontSize: 'inherit', flexGrow: 1 }}
          >
            {labelText}
          </Typography>
        }
        {...other}
      />
    </Box>
  );
};

const Sidebar = ({
  sidebarMobileOpen,
  handleDrawerToggle,
  wallet,
  changeTheme,
}) => {
  const theme = useTheme();

  const [openRpcDialog, setOpenRpcDialog] = useState(false);
  const [ownRpcUrl, setOwnRpcUrl] = useState(
    wallet.network === 'mainnet'
      ? localStorage.getItem('mainnet_rpc_url')
      : localStorage.getItem('testnet_rpc_url')
  );
  const [useOwnRpcUrl, setUseOwnRpcUrl] = useState(
    localStorage.getItem('use_own_rpc_url') || ''
  );
  const [openBackendDialog, setOpenBackendDialog] = useState(false);
  const [ownBackendUrl, setOwnBackendUrl] = useState(
    localStorage.getItem('own_backend_url')
  );
  const [useOwnBackendUrl, setUseOwnBackendUrl] = useState(
    localStorage.getItem('use_own_backend_url') || ''
  );

  const changeRpcUrl = (RpcUrl) => {
    setOwnRpcUrl(RpcUrl);
    if (wallet.network === 'mainnet')
      localStorage.setItem('mainnet_rpc_url', RpcUrl);
    else localStorage.setItem('testnet_rpc_url', RpcUrl);
  };
  const changeBackendUrl = (BackendUrl) => {
    setOwnBackendUrl(BackendUrl);
    localStorage.setItem('own_backend_url', BackendUrl);
  };

  const handleUseOwnRpcUnCheck = () => {
    setUseOwnRpcUrl(false);
    localStorage.setItem('use_own_rpc_url', '');
  };

  const handleUseOwnRpcCheck = () => {
    setUseOwnRpcUrl(true);
    localStorage.setItem('use_own_rpc_url', 'true');
  };

  const handleBackendUrlUnCheck = () => {
    setUseOwnBackendUrl(false);
    localStorage.setItem('use_own_backend_url', '');
  };

  const handleBackendUrlCheck = () => {
    setUseOwnBackendUrl(true);
    localStorage.setItem('use_own_backend_url', 'true');
  };

  const handleRpcUrlChange = (e) => changeRpcUrl(e.target.value);

  const handleBackendChange = (e) => changeBackendUrl(e.target.value);

  const handleCloseClick = () =>
    window.location.replace(window.location.origin + window.location.pathname);

  const drawer = (
    <>
      <TreeView
        sx={{ paddingTop: { xs: '126px', md: '146px' }, paddingLeft: '20px' }}
        aria-label="protocol"
        defaultCollapseIcon={<ArrowDropDownIcon sx={{ marginLeft: '450px' }} />}
        defaultExpandIcon={<ArrowLeftIcon sx={{ marginLeft: '450px' }} />}
        defaultEndIcon={<div style={{ width: 24 }} />}
      >
        <Box display={{ xs: 'flex', md: 'none' }} sx={{ marginBottom: '10px' }}>
          <IconButton sx={{ ml: 1 }} onClick={changeTheme} color="inherit">
            {theme.palette.mode === 'dark' ? (
              <img src="/icons/ic-sun.png" alt="dark mode" />
            ) : (
              <img src="/icons/ic-circular.png" alt="light mode" />
            )}
          </IconButton>
          <IconButton sx={{ ml: 1 }} color="inherit">
            <img
              src={'/icons/ic-notifications-' + theme.palette.mode + '.png'}
              alt="notifications"
            />
          </IconButton>
        </Box>
        <Box pl={1} pr={1}>
          <Chip
            sx={{
              width: 264,
              height: 32,
              fontSize: '16px',
            }}
            label="PROTOCOL"
          />
        </Box>
        <StyledTreeHeader nodeId="1" labelText="Staking">
          <StyledTreeItem nodeId="11" labelText="Delegate" to="/stake" />
          <StyledTreeItem nodeId="12" labelText="Reporting" to="/rewards" />
        </StyledTreeHeader>
        <StyledTreeHeader nodeId="2" labelText="Validators">
          <StyledTreeItem nodeId="21" labelText="List" to="/pools" />
          {/* <StyledTreeItem nodeId="22" labelText="Monitoring" to="/dashboard" /> */}
        </StyledTreeHeader>
        <Box pl={1} pr={1} pt={5}>
          <Chip
            sx={{
              width: 264,
              height: 32,
              fontSize: '16px',
            }}
            label="INFRASTRUCTURE"
          />
        </Box>
        <StyledTreeItem nodeId="3" labelText="Servers" to="/servers" />
        <StyledTreeItem nodeId="4" labelText="Keys" to="/keys" />
      </TreeView>
      <List sx={{ paddingLeft: '12px' }}>
        <ListItem onClick={() => setOpenRpcDialog(true)} component={Link}>
          <Chip
            sx={{ width: 264, height: 32 }}
            label={
              !!useOwnRpcUrl && !!ownRpcUrl ? `rpc: custom` : `rpc: Pagoda`
            }
            icon={<ArrowDropDownIcon />}
          />
        </ListItem>
        <ListItem onClick={() => setOpenBackendDialog(true)} component={Link}>
          <Chip
            sx={{ width: 264, height: 32 }}
            label={
              !!useOwnBackendUrl && !!ownBackendUrl
                ? `backend: custom`
                : `backend: kuutamo`
            }
            icon={<ArrowDropDownIcon />}
          />
        </ListItem>
      </List>
    </>
  );

  return (
    <Box>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={sidebarMobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },

            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },

            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderWidth: 0,
              background: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Dialog open={openRpcDialog} fullWidth>
        <DialogTitle id="alert-dialog-title">RPC</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <Radio
                checked={!useOwnRpcUrl || !ownRpcUrl}
                onChange={handleUseOwnRpcUnCheck}
              />
              <TextField
                type="text"
                margin="normal"
                fullWidth
                id="official_rpc"
                label="Pagoda RPC"
                disabled
                value={wallet.walletSelector.options.network.officialRpc}
              />
            </ListItem>
            <ListItem>
              <Radio
                checked={!!useOwnRpcUrl && !!ownRpcUrl}
                onChange={handleUseOwnRpcCheck}
              />
              <TextField
                type="text"
                margin="normal"
                fullWidth
                id="custom_rpc"
                label="Custom RPC"
                autoComplete="off"
                value={ownRpcUrl || ''}
                onChange={handleRpcUrlChange}
              />
            </ListItem>
          </List>
          <DialogActions>
            <Button onClick={handleCloseClick} variant="outlined">
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog open={openBackendDialog} fullWidth>
        <DialogTitle id="alert-dialog-title">Backend</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <Radio
                checked={!useOwnBackendUrl || !ownBackendUrl}
                onChange={handleBackendUrlUnCheck}
              />
              <TextField
                type="text"
                margin="normal"
                fullWidth
                id="default_backend"
                label="kuutamo"
                disabled
                value={nearConfig.defaultBackendUrl}
              />
            </ListItem>
            <ListItem>
              <Radio
                checked={!!useOwnBackendUrl && !!ownBackendUrl}
                onChange={handleBackendUrlCheck}
              />
              <TextField
                type="text"
                margin="normal"
                fullWidth
                id="custom_backend"
                label="custom"
                autoComplete="off"
                value={ownBackendUrl || ''}
                onChange={handleBackendChange}
              />
            </ListItem>
          </List>
          <DialogActions>
            <Button onClick={handleCloseClick} variant="outlined">
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Sidebar;

