import { TextField, useTheme } from '@mui/material';
import React from 'react';
import { getCustomThemeStyles } from '../styles/theme';

const MuiTextField = ({ field, form, ...props }) => {
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
    <TextField
      inputProps={{
        sx: { color: 'text.primary', fontFamily: customTheme.font.roboto },
      }}
      InputLabelProps={{
        sx: { color: 'text.primary', fontFamily: customTheme.font.roboto },
      }}
      {...field}
      {...props}
    />
  );
};

export default MuiTextField;

