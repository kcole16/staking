import {
  Box,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import SmsNotificationIcon from '../../../svg/smsNotification';
import { getCustomThemeStyles } from '../../styles/theme';
import ModalWrapper from '../AuthModalWrapper';

const SignUpConfirmDialog = ({
  isResent,
  secs,
  email,
  handleConfirmClose,
  confirmModalIsShown,
  handleResendConfirmEmail,
}) => {
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
    <ModalWrapper
      isOpen={confirmModalIsShown}
      handleClose={handleConfirmClose}
      buttonText="back"
      dialogProps={{
        sx: {
          zIndex: '1302',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: { xs: '8px', sm: '0' },
        }}
      >
        <Box
          sx={{
            width: '64px',
            height: '64px',
            color: 'primary.main',
          }}
        >
          <SmsNotificationIcon
            mailColor={customTheme.colors.secondary}
            checkmarkColor="currentColor"
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
          Email Confirmation
        </DialogTitle>
      </Box>
      <DialogContent
        sx={{
          padding: { xs: '0 25px 25px', sm: '0 56px 48px' },
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '16px', sm: '18px' },
            lineHeight: 1.5,
            fontFamily: customTheme.font.roboto,
            fontWeight: 400,
          }}
        >
          We have sent an email to{' '}
          <Typography
            component="span"
            color="primary.main"
            sx={{
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              lineHeight: 'inherit',
              display: { xs: 'block', sm: 'inline' },
            }}
          >
            {email}
          </Typography>{' '}
          Please{' '}
          <Typography
            color="inherit"
            component="span"
            fontWeight="500"
            fontFamily="inherit"
            fontSize="inherit"
          >
            open
          </Typography>{' '}
          and{' '}
          <Typography
            color="inherit"
            component="span"
            fontWeight="500"
            fontFamily="inherit"
            fontSize="inherit"
          >
            click
          </Typography>{' '}
          on the link to prove ownership.
        </Typography>
        <Divider
          sx={{
            marginBlock: { xs: '32px', sm: '56px 16' },
            borderColor: {
              xs: customTheme.colors.secondary,
              sm: 'primary.dark',
            },
          }}
        />
        <Typography sx={{ fontFamily: customTheme.font.roboto }}>
          {isResent ? (
            <>Sent! You can resend confirmation email again in {secs}s </>
          ) : (
            <>
              If you have not received the email -{' '}
              <Typography
                component="span"
                fontFamily="inherit"
                fontWeight={500}
                color={customTheme.colors.link}
                onClick={handleResendConfirmEmail}
                sx={{ cursor: 'pointer' }}
              >
                click
              </Typography>{' '}
              to resend
            </>
          )}
        </Typography>
      </DialogContent>
    </ModalWrapper>
  );
};

export default SignUpConfirmDialog;
