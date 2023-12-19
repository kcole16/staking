import { Formik } from 'formik';

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authInitialValues } from '../constants';
import ModalWrapper from '../ui/components/AuthModalWrapper';
import { authService } from '../helpers/auth';
import { signInValidator } from '../validators/signInValidator';
import SignUpConfirmDialog from '../ui/components/AuthModals/SignUpConfirmDialog';
import SignInForgotPasModal from '../ui/components/AuthModals/SignInForgotPasModal';
import SigninForm from '../ui/components/SigninForm';
import { Typography, useTheme } from '@mui/material';
import { getCustomThemeStyles } from '../ui/styles/theme';

const SigninPage = () => {
  const location = useLocation();
  const { state } = location;
  const to = state && state.to ? state.to : '/order';
  const onBack = state && state.back ? state.back : -1;
  const navigate = useNavigate();
  const [secs, setSecs] = useState(60);
  const [confirmModalIsShown, setConfirmModalIsShown] = useState(false);
  const [mainModalIsShown, setModalIsShown] = useState(true);
  const [resetModalIsShown, setResetModalIsShown] = useState(false);
  const [email, setEmail] = useState('');
  const [isResent, setIsResent] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  const handleSubmit = (values, { resetForm }) => {
    const networkId = localStorage.getItem('networkId');
    if (networkId) {
      authService
        .login({ ...values, protocol: `near-${networkId}` })
        .then(async (response) => {
          if (response && response.status === 'success') {
            setEmail(values.email);
            const { token, user_id } = response.data;
            localStorage.setItem('USER_ID', user_id);
            localStorage.setItem('TOKEN', token);
            resetForm();
            navigate(to);
          } else if (response && response.status === 'fail') {
            if (response.message === 'Your Email has not been verified') {
              setModalIsShown(false);
              setConfirmModalIsShown(true);
              authService.resendConfirmMail(values.email).then((res) => {
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
            setError(
              'Incorrect email/password, please, check your credentials and try again'
            );
          } else {
            setError('Something went wrong...');
          }
        });
    }
  };

  const handleConfirmClose = () => {
    setConfirmModalIsShown(false);
    setModalIsShown(true);
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

  const handleResetClose = () => {
    setResetModalIsShown(false);
    setModalIsShown(true);
  };
  const handleClose = () => navigate(onBack);

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
      <SignInForgotPasModal
        isOpen={resetModalIsShown}
        handleClose={handleResetClose}
      />
      <ModalWrapper
        handleClose={handleClose}
        isOpen={mainModalIsShown}
        title="Sign in"
        mobileSubtitle={
          <>
            Sign in to your{' '}
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
        buttonText="back"
        dialogProps={{
          sx: {
            zIndex: '1302',
          },
        }}
      >
        <Formik
          initialValues={authInitialValues}
          onSubmit={handleSubmit}
          validationSchema={signInValidator}
          validateOnChange={false}
        >
          <SigninForm
            setResetModalIsShown={setResetModalIsShown}
            setModalIsShown={setModalIsShown}
            error={error}
            to={to}
            onBack={onBack}
          />
        </Formik>
      </ModalWrapper>
    </>
  );
};

export default SigninPage;

