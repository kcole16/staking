import React from 'react';
import ModalWrapper from '../ui/components/AuthModalWrapper';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import MuiTextField from '../ui/components/MuiTextFieldFormik';
import { alphaInitialValues } from '../constants';
import { alphaTokenValidator } from '../validators/alphaTokenValidator';
import { getCustomThemeStyles } from '../ui/styles/theme';

const AlphaPage = () => {
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');
  const handleSubmit = (values) => {
    console.log(values);
  };

  const helperTextStyle = {
    sx: {
      fontWeight: '400',
      fontFamily: customTheme.font.roboto,
      fontSize: '14px',
    },
  };

  return (
    <ModalWrapper
      isOpen={true}
      withBackButton={false}
      dialogProps={{
        sx: {
          '& .MuiPaper-root': {
            maxWidth: { xs: '100%', md: '776px' },
            padding: '56px 88px',
            boxShadow: customTheme.shadows.modal,
          },

          '& .MuiBackdrop-root': {
            backgroundColor: 'inherit',
          },
        },
      }}
    >
      <Box sx={{ fontFamily: customTheme.font.roboto }}>
        <Typography
          sx={{
            fontSize: '20px',
            lineHeight: 1,
            fontFamily: 'inherit',
            marginBottom: '24px',
          }}
        >
          Please wait...you will receive your alpha access token soon.
        </Typography>
        <Typography
          sx={{
            fontSize: '20px',
            lineHeight: 1,
            fontFamily: 'inherit',
            marginBottom: '48px',
          }}
        >
          Enter your token here after you receive it
        </Typography>
        <Formik
          initialValues={alphaInitialValues}
          onSubmit={handleSubmit}
          validationSchema={alphaTokenValidator}
        >
          {({ errors }) => (
            <Form>
              <Field
                name="token"
                component={MuiTextField}
                type="text"
                fullWidth
                error={!!errors.token}
                helperText={!!errors.token && errors.token}
                FormHelperTextProps={helperTextStyle}
                sx={{
                  marginBottom: '16px',
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    padding: '16px 32px',
                    fontSize: '15px',
                    lineHeight: 1,
                    fontWeight: '400',

                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                >
                  CONTINUE
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </ModalWrapper>
  );
};

export default AlphaPage;

