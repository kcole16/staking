import { Box, useTheme } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { useWindowDimension } from '../../hooks/useWindowDimension';
import { getCustomThemeStyles } from '../styles/theme';

const LayoutWithoutSidebar = ({ wallet, isSignedIn, changeTheme }) => {
  const { height } = useWindowDimension();
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  if (!isSignedIn) {
    wallet.signIn();
    return false;
  }
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
      {isSignedIn && <NavBar wallet={wallet} changeTheme={changeTheme} />}

      <Box
        sx={{
          width: 1,
          minHeight: `calc(${height}px - ${isSignedIn ? '136' : '40'}px)`,
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {isSignedIn && (
          <>
            <Box
              component="main"
              sx={{
                display: 'flex',
                alignItems: 'stretch',
                width: 1,
                paddingBlock: '53px 24px',
              }}
            >
              <Outlet />
            </Box>
          </>
        )}
      </Box>
      <Box
        sx={{
          textAlign: 'center',
          width: '100%',
          height: '40px',
          fontFamily: customTheme.font.roboto,
          lineHeight: 1,
        }}
      >
        © 2023 kuutamo. All rights reserved
      </Box>
    </Box>
  );
};

export default LayoutWithoutSidebar;

