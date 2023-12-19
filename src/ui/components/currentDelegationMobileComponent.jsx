import { Box, Button, Divider, Typography, useTheme } from '@mui/material';
import React from 'react';
import { getCustomThemeStyles } from '../styles/theme';

const CurrentDelegationMobile = ({
  name,
  fee,
  canWithdraw,
  total,
  staked,
  unstaked,
  handleWithdrawClick,
  handleUnstakeMaxClick,
  handleUnstakeClick,
}) => {
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
    <Box>
      <Typography
        component="h4"
        fontSize={20}
        sx={{
          fontSize: '20px',
          fontFamily: customTheme.font.roboto,
          marginBottom: '16px',
          color: 'text.secondary',
        }}
      >
        {name}
      </Typography>
      <Box sx={{ display: 'flex', width: 1, marginBottom: '16px' }}>
        <Box sx={{ width: '25%' }}>
          <Typography
            sx={{ color: customTheme.colors.delegationInfo, lineHeight: 1 }}
          >
            {fee}%
          </Typography>
          <Typography
            sx={{
              color: customTheme.colors.switchNoChoosenVal,
              fontSize: '12px',
              lineHeight: 1,
            }}
          >
            fee
          </Typography>
        </Box>
        <Box sx={{ width: '25%' }}>
          <Typography
            sx={{ color: customTheme.colors.delegationInfo, lineHeight: 1 }}
          >
            {total}
          </Typography>
          <Typography
            sx={{
              color: customTheme.colors.switchNoChoosenVal,
              fontSize: '12px',
              lineHeight: 1,
            }}
          >
            total
          </Typography>
        </Box>
        <Box sx={{ width: '25%' }}>
          <Typography
            sx={{ color: customTheme.colors.delegationInfo, lineHeight: 1 }}
          >
            {staked}
          </Typography>
          <Typography
            sx={{
              color: customTheme.colors.switchNoChoosenVal,
              fontSize: '12px',
              lineHeight: 1,
            }}
          >
            staked
          </Typography>
        </Box>
        <Box sx={{ width: '25%' }}>
          <Typography
            sx={{ color: customTheme.colors.delegationInfo, lineHeight: 1 }}
          >
            {unstaked}
          </Typography>
          <Typography
            sx={{
              color: customTheme.colors.switchNoChoosenVal,
              fontSize: '12px',
              lineHeight: 1,
            }}
          >
            unstaked
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          sx={{
            padding: '9px 16px',
            width: 'fit-content',
            fontSize: { xs: '12px', sm: '16px' },
            color: '#FEFEFF',
          }}
          disabled={!canWithdraw || unstaked <= 0}
          onClick={handleWithdrawClick}
        >
          withdraw
        </Button>
        <Button
          variant="contained"
          sx={{
            padding: '9px 16px',
            width: 'fit-content',
            fontSize: { xs: '12px', sm: '16px' },
            color: '#FEFEFF',
          }}
          disabled={staked <= 0}
          onClick={handleUnstakeMaxClick}
        >
          unstake max
        </Button>
        <Button
          variant="contained"
          sx={{
            padding: '9px 16px',
            width: 'fit-content',
            fontSize: { xs: '12px', sm: '16px' },
            color: '#FEFEFF',
          }}
          disabled={staked <= 0}
          onClick={handleUnstakeClick}
        >
          unstake
        </Button>
      </Box>
      <Divider
        sx={{
          marginBlock: '8px 16px',
          borderColor: customTheme.colors.delegationDivider,
        }}
      />
    </Box>
  );
};

export default CurrentDelegationMobile;
