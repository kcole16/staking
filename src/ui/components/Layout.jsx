import { Box, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import { useWindowDimension } from '../../hooks/useWindowDimension';
import { getCustomThemeStyles } from '../styles/theme';

const Layout = ({ isSignedIn, wallet, changeTheme }) => {
  const { height } = useWindowDimension();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  const handleDrawerToggle = () => {
    setMobileOpen((old) => !old);
  };

  return (
    <Box
      sx={{
        '@media (min-width: 2000px)': {
          width: '2000px',
          margin: 'auto',
          position: 'relative',
        },
      }}
    >
      {isSignedIn && (
        <NavBar
          wallet={wallet}
          changeTheme={changeTheme}
          handleDrawerToggle={handleDrawerToggle}
        />
      )}

      <Box
        sx={{
          width: 1,
          minHeight: `calc(${height}px - ${isSignedIn ? '160' : '40'}px)`,
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {isSignedIn && (
          <Sidebar
            wallet={wallet}
            sidebarMobileOpen={mobileOpen}
            changeTheme={changeTheme}
            handleDrawerToggle={handleDrawerToggle}
          />
        )}
        <Box
          component="main"
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            width: 1,
            paddingBlock: '27px 24px',
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '64px',
          fontFamily: customTheme.font.roboto,
          lineHeight: 1,
        }}
      >
        © 2023 kuutamo. All rights reserved
      </Box>
    </Box>
  );
};

export default Layout;

