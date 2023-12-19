import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModalWrapper from '../ui/components/AuthModalWrapper';
import {
  Alert,
  Box,
  Button,
  DialogTitle,
  IconButton,
  InputAdornment,
  Typography,
  useTheme,
} from '@mui/material';
import LockIcon from '../svg/lock';
import { Field, Form, Formik } from 'formik';
import MuiTextField from '../ui/components/MuiTextFieldFormik';
import { resetPasswordFormInitialValues } from '../constants';
import EyeIcon from '../svg/eye';
import EyeSlashIcon from '../svg/eyeSlash';
import { resetPassValidator } from '../validators/resetPasswordValidator';
import { authService } from '../helpers/auth';
import ResultModal from '../ui/components/AuthModals/ResultModal';
import { getCustomThemeStyles } from '../ui/styles/theme';

const ResetPasswordPage = () => {
  const [modalIsShown, setModalIsShown] = useState(true);
  const [messageModalIsShown, setMessageModalIsShown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowConfirmedPassword = () =>
    setShowConfirmPassword((showConfirm) => !showConfirm);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { email, token } = useParams();

  const handleClose = () => {
    navigate('/signin');
  };

  const handleSubmit = (values) => {
    const { newPassword } = values;
    authService.setNewPassword(email, token, newPassword).then((res) => {
      if (res && res.status === 'success') {
        setModalIsShown(false);
        setMessageModalIsShown(true);
        setMessage('Password successfully changed');
      } else if (res && res.status === 'fail') {
        setError(res.message);
      } else {
        setError('Something went wrong...');
      }
    });
  };

  const inputLabelProps = {
    sx: {
      color: 'text.primary',
      fontSize: '16px',

      '&:focus': { color: 'text.primary' },
    },
  };

  const fieldStyles = {
    marginBottom: { xs: '32px', sm: '40px' },
    fontSize: '16px',
    color: 'text.primary',

    '& label.Mui-focused': { color: 'text.primary' },
  };

  return (
    <>
      <ResultModal
        isOpen={messageModalIsShown}
        title={message}
        backTo={`forgot-password/${email}/${token}`}
        buttonText="close"
        submitButtonText="DONE"
        navigateOnSubmit="/signin"
      />
      <ModalWrapper
        isOpen={modalIsShown}
        handleClose={handleClose}
        buttonText="back"
        dialogProps={{
          sx: {
            zIndex: '1302',
            '& .MuiPaper-root': {
              width: { xs: '100%', md: '576px' },
            },
          },
        }}
      >
        <Box sx={{ paddingInline: { xs: '25px', sm: '64px' } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: '64px',
                height: '64px',
                color: 'primary.main',
                marginTop: { xs: '8px', sm: 0 },
              }}
            >
              <LockIcon
                frameColor={theme.palette.text.primary}
                lockColor="currentColor"
              />
            </Box>
            <DialogTitle
              sx={{
                color: 'text.primary',
                paddingBlock: '24px 0',
                fontSize: '32px',
                lineHeight: {
                  xl: '48px',
                  lg: '48px',
                  md: '44px',
                  sm: '38px',
                  xs: '40px',
                },
                fontWeight: { xs: 700, sm: 500 },
              }}
            >
              Reset Password
            </DialogTitle>
            <Typography
              sx={{
                fontFamily: customTheme.font.roboto,
                fontSize: '18px',
                marginTop: '16px',
                color: 'text.secondary',
              }}
            >
              Enter your new password below, we`re just being extra safe
            </Typography>
          </Box>
          <Box sx={{ marginTop: { xs: '40px', sm: '32px' } }}>
            <Formik
              initialValues={resetPasswordFormInitialValues}
              onSubmit={handleSubmit}
              validationSchema={resetPassValidator}
            >
              {({ errors, isSubmitting }) => (
                <Form>
                  <Field
                    name="newPassword"
                    component={MuiTextField}
                    type={showPassword ? 'text' : 'password'}
                    label="New Password"
                    required
                    fullWidth
                    error={!!errors.newPassword}
                    helperText={!!errors.newPassword && errors.newPassword}
                    sx={fieldStyles}
                    InputLabelProps={inputLabelProps}
                    InputProps={{
                      name: 'newPassword',
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
                  <Field
                    name="confirmPassword"
                    component={MuiTextField}
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    required
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={
                      !!errors.confirmPassword && errors.confirmPassword
                    }
                    sx={fieldStyles}
                    InputLabelProps={inputLabelProps}
                    InputProps={{
                      name: 'confirmPassword',
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmedPassword}
                            onMouseDown={handleMouseDownPassword}
                            sx={{ color: 'text.secondary' }}
                          >
                            {showConfirmPassword ? (
                              <EyeSlashIcon />
                            ) : (
                              <EyeIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {error && (
                    <Alert
                      sx={{
                        fontFamily: customTheme.font.roboto,
                        fontSize: '16px',
                        fontWeight: '500',
                        marginBottom: '32px',

                        '&.MuiPaper-root': {
                          width: '100%',
                        },
                      }}
                      severity="error"
                    >
                      {error}
                    </Alert>
                  )}
                  <Box sx={{ textAlign: 'center', marginBottom: '48px' }}>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      variant="contained"
                      sx={{
                        width: { xs: 1, sm: 'auto' },
                        fontWeight: 400,
                        fontSize: '15px',
                        lineHeight: 1,
                        padding: '16px 32px',

                        '&.Mui-disabled': {
                          cursor: 'not-allowed',
                        },
                      }}
                    >
                      RESET PASSWORD
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </ModalWrapper>
    </>
  );
};

export default ResetPasswordPage;

