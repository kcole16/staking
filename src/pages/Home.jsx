import { Box, Button, Container, Stack } from '@mui/material';
import * as React from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getCustomThemeStyles } from '../ui/styles/theme';
import Logo from '../svg/logo';
import ChooseDialog from '../ui/components/ChooseDialog';
import { homePageDialogData } from '../constants';
import GitHubIcon from '../svg/github';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Home = ({ isSignedIn, wallet }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = React.useState(false);
  const navigate = useNavigate();

  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  useEffect(() => {
    if (isSignedIn) {
      navigate('/rewards');
    }
  }, [isSignedIn, navigate]);

  const handleClickNetwork = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleLoginClick = () => {
    wallet.signIn();
  };

  const changeNetwork = (networkId) => {
    localStorage.setItem('networkId', networkId);
    window.location.replace(window.location.origin);
  };

  const firstLogoColor = customTheme.colors.homeLogo.start;

  const secondLogoColor = customTheme.colors.homeLogo.end;

  return (
    <>
      {!isSignedIn && (
        <>
          <ChooseDialog
            title="Select an option"
            isOpen={openDialog}
            handleClose={handleDialogClose}
            data={homePageDialogData}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingInline: '48px',
            }}
          >
            <Box
              component={Link}
              to="https://github.com/kuutamolabs/near-staking-ui"
              target="_blank"
              sx={{
                color: customTheme.colors.github,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                columnGap: '16px',
              }}
            >
              <Box
                sx={{
                  color: customTheme.colors.github,
                  width: '40px',
                  height: '40px',
                }}
              >
                <GitHubIcon />
              </Box>
              <Typography>
                View source on <b>GitHub</b>
              </Typography>
            </Box>
            <Box>
              <Button
                sx={{
                  color: 'text.primary',
                  border: '0px',
                  textTransform: 'none',
                }}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClickNetwork}
              >
                <ArrowDropDownIcon />
                Network: {localStorage.getItem('networkId') || 'testnet'}
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem
                  value="testnet"
                  onClick={() => changeNetwork('testnet')}
                >
                  testnet
                </MenuItem>
                <MenuItem
                  value="mainnet"
                  onClick={() => changeNetwork('mainnet')}
                >
                  mainnet
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          <Container
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: 1,
              alignItems: 'center',
              justifyContent: 'center',
              '@media (min-width:600px)': { paddingBottom: '100px' },
            }}
          >
            <Stack
              spacing={6}
              direction="row"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  [theme.breakpoints.down('sm')]: {
                    flexDirection: 'column',
                  },
                }}
              >
                <Box width={124} height={124}>
                  <Logo
                    firstColor={firstLogoColor}
                    secondColor={secondLogoColor}
                  />
                </Box>
                <Typography
                  sx={{
                    '@media (min-width:600px)': { padding: '30px' },
                    fontWeight: 600,
                    fontSize: '58px',
                  }}
                >
                  kuutamo
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: '32px',
                    '@media (min-width:600px)': {
                      borderLeft: '1px solid #D2D1DA',
                      paddingLeft: '30px',
                    },
                  }}
                >
                  protocol infrastucture
                </Typography>
              </Box>
            </Stack>
            <Stack
              spacing={6}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems="center"
              justifyContent="center"
              pt={5}
            >
              <Button
                variant="contained"
                sx={{
                  background: 'primary.main',
                  width: '280px',
                  height: '77px',
                  borderRadius: '15px',
                  fontSize: '23px',
                  color: customTheme.colors.tableBtn,
                  boxShadow: customTheme.shadows.btn,
                }}
                onClick={handleDialogOpen}
              >
                Get started
              </Button>
              <Button
                variant="outlined"
                sx={{
                  width: '280px',
                  height: '77px',
                  fontSize: '23px',
                  color: theme.palette.text.primary,
                  borderRadius: '15px',
                  border: 1,
                  borderColor: 'primary.main',
                }}
                onClick={handleLoginClick}
              >
                Log in
              </Button>
            </Stack>
          </Container>
        </>
      )}
    </>
  );
};

export default Home;

