import { Box, Button, Divider, Typography, useTheme } from '@mui/material';
import React from 'react';
import Logo from '../svg/logo';
import NotFoundFour from '../svg/notFoundFour';
import { getCustomThemeStyles } from '../ui/styles/theme';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  const firstLogoColor = customTheme.colors.homeLogo.start;

  const secondLogoColor = customTheme.colors.homeLogo.end;

  return (
    <Box
      sx={{
        width: 1,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ maxWidth: '560px', textAlign: 'center' }}>
        <Typography
          sx={{
            fontSize: '32px',
            lineHeight: 1,
            fontFamily: customTheme.font.roboto,
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          We...have a problem
        </Typography>
        <Divider sx={{ borderColor: 'text.primary' }} />
        <Box sx={{ display: 'flex', columnGap: '48px', marginBlock: '40px' }}>
          <Box width={140} height={180} color="text.primary">
            <NotFoundFour />
          </Box>
          <Box width={180} height={180}>
            <Logo firstColor={firstLogoColor} secondColor={secondLogoColor} />
          </Box>
          <Box width={140} height={180} color="text.primary">
            <NotFoundFour />
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'text.primary' }} />
        <Typography
          sx={{
            fontSize: '32px',
            lineHeight: 1,
            fontFamily: customTheme.font.roboto,
            textTransform: 'uppercase',
            marginBlock: '16px 112px',
          }}
        >
          page not found
        </Typography>
        <Button
          component={Link}
          to="/"
          sx={{
            backgroundColor: 'primary.main',
            color: customTheme.colors.tableBtn,
            padding: '26px 64.5px',
            fontSize: '20px',
            lineHeight: 1,
            borderRadius: '15px',
            fontWeight: '400',
            boxShadow: customTheme.shadows.btn,
            transition: 'filter 0.2s',

            '&:hover': {
              backgroundColor: 'primary.main',
              filter: 'brightness(95%)',
            },
          }}
        >
          GO BACK HOME
        </Button>
      </Box>
      <Box
        sx={{
          fontFamily: customTheme.font.roboto,
          textAlign: 'center',
          lineHeight: 1,
          position: 'absolute',
          bottom: 0,
          paddingBottom: '24px',
        }}
      >
        © 2023 kuutamo. All rights reserved
      </Box>
    </Box>
  );
};

export default NotFoundPage;
