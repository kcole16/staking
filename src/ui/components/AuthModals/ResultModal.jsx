import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  useTheme,
} from '@mui/material';
import ConfirmShieldIcon from '../../../svg/confirmShield';
import { getCustomThemeStyles } from '../../styles/theme';
import InfoCircleBig from '../../../svg/infoCircleBig';
import ModalWrapper from '../AuthModalWrapper';

const ResultModal = ({
  isOpen,
  isFailed = false,
  title,
  backTo,
  buttonText = 'close',
  submitButtonText = 'DONE',
  onSubmit,
  navigateOnSubmit,
}) => {
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
    <ModalWrapper
      isOpen={isOpen}
      buttonText={buttonText}
      buttonProps={{ component: Link, to: backTo }}
      dialogProps={{
        sx: {
          zIndex: '1302',
        },
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Box
          sx={{
            width: '65px',
            height: '64px',
            color: 'primary.main',
            marginTop: { xs: '8px', sm: 0 },
          }}
        >
          {isFailed ? (
            <InfoCircleBig
              frameColor={customTheme.colors.secondary}
              exclamationColor="currentColor"
            />
          ) : (
            <ConfirmShieldIcon
              shieldColor={customTheme.colors.secondary}
              checkmarkColor="currentColor"
            />
          )}
        </Box>
        <DialogTitle
          sx={{
            textAlign: 'center',
            color: 'text.primary',
            paddingTop: '24px',
            lineHeight: {
              xl: '48px',
              lg: '48px',
              md: '44px',
              sm: '38px',
              xs: '40px',
            },
            fontSize: {
              xl: '48px',
              lg: '48px',
              md: '44px',
              sm: '38px',
              xs: '32px',
            },
            fontWeight: { xs: 700, sm: 500 },
          }}
        >
          {title}
        </DialogTitle>
      </Box>
      <DialogContent
        sx={{ padding: { xs: '8px 25px 56px 25px', sm: '24px 0 56px 0' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            component={Link}
            to={navigateOnSubmit}
            onClick={onSubmit}
            sx={{
              width: { xs: 1, sm: 'auto' },
              fontWeight: 400,
              lineHeight: 1,
              padding: '16px 39px',
              transition: 'filter 0.2s',

              '&:hover': {
                filter: 'brightness(95%)',
                backgroundColor: 'primary.main',
              },
            }}
          >
            {submitButtonText}
          </Button>
        </Box>
      </DialogContent>
    </ModalWrapper>
  );
};

export default ResultModal;

