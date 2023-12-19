import { Box } from '@mui/material';
import React from 'react';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';
import { useWindowDimension } from '../../hooks/useWindowDimension';

const SimpleLayoutWithNav = ({ isSignedIn, wallet, changeTheme }) => {
  const { height } = useWindowDimension();

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
          minHeight: `calc(${height}px - ${isSignedIn ? '160' : '40'}px)`,
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        <Box
          component="main"
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            width: 1,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default SimpleLayoutWithNav;

