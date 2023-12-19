import { Field, Form, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import MuiTextField from './MuiTextFieldFormik';
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Typography,
  useTheme,
} from '@mui/material';
import { getCustomThemeStyles } from '../styles/theme';
import EyeSlashIcon from '../../svg/eyeSlash';
import EyeIcon from '../../svg/eye';
import { Link } from 'react-router-dom';
import { useWindowDimension } from '../../hooks/useWindowDimension';

const SigninForm = ({
  error,
  setResetModalIsShown,
  setModalIsShown,
  to,
  onBack,
}) => {
  const theme = useTheme();
  const { width } = useWindowDimension();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const { setFieldValue, errors } = useFormikContext();

  useEffect(() => {
    const networkId = localStorage.getItem('networkId');
    if (networkId) {
      setFieldValue('protocol', `near-${networkId}`);
    }
  }, [setFieldValue]);

  const handleResetClick = () => {
    setModalIsShown(false);
    setResetModalIsShown(true);
  };

  const isMobile = width && width < 600;

  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
    <Box
      sx={{ margin: { xs: '0 25px 25px', sm: '0 9% 64px' } }}
      component={Form}
    >
      <Field
        name="email"
        component={MuiTextField}
        type="email"
        label="E-mail"
        fullWidth
        error={!!errors.email}
        helperText={!!errors.email && errors.email}
        sx={{ marginBottom: { xs: '40px', sm: '32px' }, fontSize: '16px' }}
        InputProps={{ name: 'email' }}
      />
      <Field
        name="password"
        component={MuiTextField}
        type={showPassword ? 'text' : 'password'}
        label="Password"
        error={!!errors.password}
        helperText={!!errors.password && errors.password}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                sx={{ color: 'text.secondary' }}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Typography
          sx={{
            marginTop: '16px',
            color: 'text.secondary',
            textDecoration: 'none',
            lineHeight: 1,
            width: 'fit-content',

            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          onClick={handleResetClick}
        >
          Forgot Password?
        </Typography>
      </Box>
      <Box
        sx={{
          marginBlock: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: '16px',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Button
          type="submit"
          sx={{
            backgroundColor: 'primary.main',
            textTransform: 'uppercase',
            color: 'primary.light',
            padding: '16px 32px',
            lineHeight: 1,
            fontSize: '15px',
            boxShadow: customTheme.shadows.light,
            transition: 'opacity 0.15s',
            width: { xs: 1, sm: 'auto' },

            '&:hover': {
              opacity: '0.9',
              backgroundColor: 'primary.main',
            },
          }}
        >
          login
        </Button>
        {(isMobile && (
          <>
            <Divider
              sx={{
                width: 1,
                marginBlock: '32px',
                borderColor: 'text.primary',
              }}
            />
            <Typography
              sx={{
                fontFamily: customTheme.font.roboto,
                color: 'text.secondary',

                '& a': {
                  color: 'primary.main',
                },
              }}
            >
              Don’t have an account?&nbsp;&nbsp;&nbsp;
              <Link to="/signup" state={{ to, onBack }}>
                Register
              </Link>
            </Typography>
          </>
        )) || (
          <>
            <Typography>OR</Typography>
            <Button
              component={Link}
              to="/signup"
              state={{ to, onBack }}
              sx={{
                padding: '16px 32px',
                lineHeight: 1,
                fontSize: '15px',
                border: 1,
                borderColor: 'primary.main',
                color: customTheme.colors.secondary,
              }}
            >
              create account
            </Button>
          </>
        )}
      </Box>
      {error && (
        <Alert
          sx={{
            fontFamily: customTheme.font.roboto,
            fontSize: '16px',
            fontWeight: '500',
          }}
          severity="error"
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default SigninForm;

