import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import ArrowLeftIcon from '../../svg/arrow-left';
import { useWindowDimension } from '../../hooks/useWindowDimension';
import { getCustomThemeStyles } from '../styles/theme';

const ModalWrapper = ({
  isOpen,
  handleClose,
  closeOnBlur = false,
  title,
  mobileSubtitle,
  children,
  withBackButton = true,
  buttonText = 'back',
  buttonProps,
  dialogProps,
  fullScreenFrom = 'sm',
}) => {
  const { width } = useWindowDimension();
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');
  const fullScreen = useMediaQuery(theme.breakpoints.down(fullScreenFrom));
  const closeFn = closeOnBlur ? handleClose : undefined;

  return (
    <Dialog
      open={isOpen}
      fullScreen={fullScreen}
      onClose={closeFn}
      fullWidth
      maxWidth="sm"
      {...dialogProps}
    >
      {withBackButton && (
        <Button
          sx={{
            color: 'text.primary',
            textTransform: 'none',
            width: 'fit-content',
            margin: { xs: '8px 0 0 25px', sm: '18px 0 0 18px' },
            fontSize: '16px',
          }}
          onClick={handleClose}
          {...buttonProps}
        >
          <Box
            sx={{
              width: '28px',
              height: '28px',
              [theme.breakpoints.down('xl')]: {
                width: '24px',
                height: '24px',
              },

              marginRight: '11.5px',
              color: 'primary.main',
            }}
          >
            <ArrowLeftIcon />
          </Box>
          {buttonText}
        </Button>
      )}
      <DialogContent sx={{ padding: 0 }}>
        {title && (
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              margin: { xs: '22px 25px 16px 25px', sm: '1em 0 40px 0' },
              padding: 0,
              textAlign: 'center',
              fontWeight: { xs: 700, sm: 500 },
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
            }}
          >
            {title}
          </DialogTitle>
        )}
        {mobileSubtitle && width && width < 600 && (
          <DialogTitle
            component="h3"
            id="alert-dialog-subtitle"
            sx={{
              margin: { xs: '0 25px 40px 25px', sm: '1em 0 40px 0' },
              padding: 0,
              textAlign: 'center',
              fontWeight: 400,
              color: 'text.secondary',
              fontFamily: customTheme.font.roboto,
            }}
          >
            {mobileSubtitle}
          </DialogTitle>
        )}

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ModalWrapper;

