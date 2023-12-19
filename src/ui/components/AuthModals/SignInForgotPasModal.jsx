import React, { useState } from 'react';
import ModalWrapper from '../AuthModalWrapper';
import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from '@mui/material';
import InfoCircleBig from '../../../svg/infoCircleBig';
import { Field, Form, Formik } from 'formik';
import MuiTextField from '../MuiTextFieldFormik';
import { resetPasswordInitialValues } from '../../../constants';
import { authService } from '../../../helpers/auth';
import { resetPassEmailValidator } from '../../../validators/resetPassEmailValidator';
import ConfirmShieldIcon from '../../../svg/confirmShield';
import { useWindowDimension } from '../../../hooks/useWindowDimension';
import { getCustomThemeStyles } from '../../styles/theme';

const SignInForgotPasModal = ({ isOpen, handleClose }) => {
  const [isSent, setIsSent] = useState(false);
  const theme = useTheme();
  const { width } = useWindowDimension();

  const isMobile = width && width < 600;

  const handleSubmit = (values) => {
    authService.resetPassword(values.email).then((res) => {
      if (res && res.status === 'success') {
        setIsSent(true);
      }
    });
  };

  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
    <ModalWrapper
      isOpen={isOpen}
      handleClose={handleClose}
      buttonText={'back to login'}
      dialogProps={{
        sx: {
          zIndex: '1302',
        },
      }}
    >
      <Box sx={{ paddingInline: { xs: '25px', sm: '64px' } }}>
        {isSent ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              marginTop: { xs: '8px', sm: 0 },
            }}
          >
            <Box sx={{ width: '64px', height: '64px', color: 'primary.main' }}>
              <ConfirmShieldIcon
                shieldColor={theme.palette.text.primary}
                checkmarkColor="currentColor"
              />
            </Box>
            {isMobile && (
              <DialogTitle
                sx={{
                  fontWeight: 700,
                  color: customTheme.colors.secondary,
                  paddingBlock: '16px',
                }}
              >
                Check your email.
              </DialogTitle>
            )}
            <Typography
              sx={{
                fontFamily: customTheme.font.roboto,
                fontSize: '18px',
                marginTop: { xs: 0, sm: '24px' },
                color: 'primary.main',
              }}
            >
              Instruction to reset your password will be sent to you, Please
              check your email.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              marginTop: { xs: '8px', sm: 0 },
            }}
          >
            <Box sx={{ width: '64px', height: '64px', color: 'primary.main' }}>
              <InfoCircleBig
                frameColor={theme.palette.text.primary}
                exclamationColor="currentColor"
              />
            </Box>
            <DialogTitle
              sx={{
                color: { xs: customTheme.colors.secondary, sm: 'text.primary' },
                paddingTop: '24px',
                fontSize: '32px',
                lineHeight: { xs: '40px', sm: 1 },
                fontWeight: { xs: 700, sm: 500 },
              }}
            >
              Forgot Password
            </DialogTitle>
            <Typography
              sx={{
                fontFamily: customTheme.font.roboto,
                fontSize: '18px',
                color: 'text.secondary',
              }}
            >
              Enter your email and we`ll send you a link to reset your password.
            </Typography>
          </Box>
        )}

        <DialogContent
          sx={{ padding: { xs: '40px 0 48px 0', sm: '32px 0 48px 0' } }}
        >
          <Formik
            initialValues={resetPasswordInitialValues}
            onSubmit={handleSubmit}
            validationSchema={resetPassEmailValidator}
          >
            {({ errors, isSubmitting }) => (
              <Form>
                <Field
                  name="email"
                  component={MuiTextField}
                  type="email"
                  label="E-mail"
                  required
                  fullWidth
                  error={!!errors.email}
                  helperText={!!errors.email && errors.email}
                  sx={{
                    marginBottom: '32px',
                    fontSize: '16px',
                    color: 'text.primary',

                    '& label.Mui-focused': { color: 'text.primary' },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: 'text.primary',
                      fontSize: '16px',

                      '&:focus': { color: 'text.primary' },
                    },
                  }}
                  InputProps={{ name: 'email' }}
                />
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    disabled={isSent || isSubmitting}
                    type="submit"
                    variant="contained"
                    sx={{
                      fontWeight: 400,
                      fontSize: '15px',
                      lineHeight: 1,
                      padding: '16px 32px',
                      width: { xs: 1, sm: 'auto' },

                      '&.Mui-disabled': {
                        cursor: 'not-allowed',
                      },
                    }}
                  >
                    SUBMIT
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Box>
    </ModalWrapper>
  );
};

export default SignInForgotPasModal;

