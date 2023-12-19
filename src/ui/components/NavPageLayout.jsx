import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SimpleNavBar from './SimpleNavBar';

const NavPageLayout = ({ isSignedIn, wallet, changeTheme }) => {
  useEffect(() => {
    if (!isSignedIn) {
      wallet.signIn();
    }
  }, [wallet, isSignedIn]);

  return isSignedIn ? (
    <>
      <SimpleNavBar wallet={wallet} changeTheme={changeTheme} />
      <Box
        sx={{
          width: 1,
          minHeight: `calc(100vh - ${isSignedIn ? '160' : '40'}px)`,
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
            paddingBlock: '53px 24px',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  ) : null;
};

export default NavPageLayout;

