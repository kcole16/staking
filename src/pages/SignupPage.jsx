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
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authInitialValues } from '../constants';
import EyeIcon from '../svg/eye';
import ModalWrapper from '../ui/components/AuthModalWrapper';
import MuiTextField from '../ui/components/MuiTextFieldFormik';
import { getCustomThemeStyles } from '../ui/styles/theme';
import { authService } from '../helpers/auth';
import { signUpValidator } from '../validators/signUpValidator';
import EyeSlashIcon from '../svg/eyeSlash';
import SignUpConfirmDialog from '../ui/components/AuthModals/SignUpConfirmDialog';
import { useWindowDimension } from '../hooks/useWindowDimension';

const SignupPage = () => {
  const location = useLocation();
  const { state } = location;
  const to = state && state.to ? state.to : '/order';
  const onBack = state && state.back ? state.back : -1;
  const theme = useTheme();
  const { width } = useWindowDimension();
  const [secs, setSecs] = useState(60);
  const [confirmModalIsShown, setConfirmModalIsShown] = useState(false);
  const [signupModalIsShown, setSignupModalIsShown] = useState(true);
  const [isResent, setIsResent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (values, { resetForm }) => {
    authService.signup(values.email, values.password).then(async (response) => {
      if (response.status === 'success') {
        setEmail(values.email);
        setSignupModalIsShown(false);
        setConfirmModalIsShown(true);
        resetForm();
        setError('');
      } else if (response.status === 'fail') {
        setError('This Email is already registered');
      } else {
        setError('Something went wrong...');
      }
    });
  };

  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  const handleConfirmClose = () => {
    setConfirmModalIsShown(false);
    setSignupModalIsShown(true);
  };

  const handleResendConfirmEmail = () => {
    if (email) {
      authService.resendConfirmMail(email).then((res) => {
        if (res.status === 'success') {
          setIsResent(true);
          let intervalId = setInterval(() => {
            setSecs((prev) => {
              if (prev === 0) {
                setIsResent(false);
                clearInterval(intervalId);
                return 60;
              } else {
                return prev - 1;
              }
            });
          }, 1000);
        }
      });
    }
  };

  const isMobile = width && width < 600;

  return (
    <>
      <SignUpConfirmDialog
        email={email}
        confirmModalIsShown={confirmModalIsShown}
        handleConfirmClose={handleConfirmClose}
        handleResendConfirmEmail={handleResendConfirmEmail}
        isResent={isResent}
        secs={secs}
      />
      <ModalWrapper
        isOpen={signupModalIsShown}
        title="Welcome"
        buttonText="back"
        mobileSubtitle={
          <>
            Create an{' '}
            <Typography
              component="span"
              fontWeight={700}
              sx={{
                color: 'primary.main',
                fontFamily: customTheme.font.roboto,
              }}
            >
              account
            </Typography>{' '}
            to access all the features of{' '}
            <Typography
              component="span"
              fontWeight={700}
              sx={{ fontFamily: customTheme.font.roboto }}
            >
              kuutamo!
            </Typography>
          </>
        }
        dialogProps={{
          sx: {
            zIndex: '1302',
          },
        }}
      >
        <Formik
          initialValues={authInitialValues}
          onSubmit={handleSubmit}
          validationSchema={signUpValidator}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ errors }) => (
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
                sx={{
                  marginBottom: { xs: '40px', sm: '32px' },
                  fontSize: '16px',
                }}
                InputProps={{ name: 'email' }}
                FormHelperTextProps={{
                  sx: {
                    fontWeight: '400',
                    fontFamily: customTheme.font.roboto,
                    fontSize: '14px',
                    position: 'absolute',
                    bottom: '-25px',
                  },
                }}
              />
              <Field
                name="password"
                component={MuiTextField}
                type={showPassword ? 'text' : 'password'}
                label="Password"
                fullWidth
                error={!!errors.password}
                helperText={!!errors.password && errors.password}
                FormHelperTextProps={{
                  sx: {
                    fontWeight: '400',
                    fontFamily: customTheme.font.roboto,
                    fontSize: '14px',
                    position: 'absolute',
                    bottom: '-25px',
                  },
                }}
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

                    '&:hover': {
                      opacity: '0.9',
                      backgroundColor: 'primary.main',
                    },
                  }}
                >
                  create account
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
                      Already have an account?&nbsp;&nbsp;&nbsp;
                      <Link to="/signin" state={{ to, onBack }}>
                        Login
                      </Link>
                    </Typography>
                  </>
                )) || (
                  <>
                    <Typography>OR</Typography>
                    <Button
                      component={Link}
                      to="/signin"
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
                      login
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
          )}
        </Formik>
      </ModalWrapper>
    </>
  );
};

export default SignupPage;

