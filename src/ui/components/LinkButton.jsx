import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { getCustomThemeStyles } from '../styles/theme';

const LinkButton = ({
  to,
  onClick,
  title,
  text,
  icon,
  disabled,
  containerProps,
  containerStyles,
  textProps,
  className,
  state,
}) => {
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
    <Box
      sx={{
        marginInline: '13%',
        marginBottom: '24px',

        '&:last-of-type': {
          marginBottom: '104px',
        },
        ...containerStyles,
      }}
      {...containerProps}
    >
      {title && (
        <Typography
          sx={{
            fontSize: '16px',
            color: 'text.secondary',
            marginBottom: '8px',
          }}
        >
          {title}
        </Typography>
      )}
      <Box
        className={className}
        sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
          background: 'text.primary',
          border: 1,
          borderColor: 'primary.main',
          padding: '15px 24px',
          borderRadius: '10px',
          cursor: `${disabled ? 'not-allowed' : 'pointer'}`,
          transition: '0.3s',
          opacity: `${disabled ? '0.3' : '1'}`,

          '&.follow': {
            color: '#002147',
            background: '#FEFEFE',
          },

          '&:hover, &:active': {
            boxShadow: customTheme.shadows.main,
          },
        }}
        to={to}
        component={to ? Link : 'div'}
        state={state}
        onClick={disabled ? undefined : onClick}
      >
        <Typography
          variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: customTheme.font.roboto,
            fontWeight: '400',
            lineHeight: 1,
            fontSize: {
              xs: '16px',
              sm: '18px',
              md: '20px',
              lg: '24px',
              xl: '24px',
            },
            flexGrow: 1,
          }}
          {...textProps}
        >
          {text}
          <Box
            component="span"
            sx={{
              width: '24px',
              height: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default LinkButton;

