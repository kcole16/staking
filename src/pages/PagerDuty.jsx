import React from 'react';
import ModalWrapper from '../ui/components/AuthModalWrapper';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import MuiTextField from '../ui/components/MuiTextFieldFormik';
import { pagerDutyInitialValues } from '../constants';
import { getCustomThemeStyles } from '../ui/styles/theme';
import { pagerDutyKeyValidator } from '../validators/pagerDutyKeyValidator';

const PagerDutyPage = () => {
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
      title="Follow the step"
      dialogProps={{
        sx: {
          '& .MuiPaper-root': {
            maxWidth: { xs: '100%', md: '576px' },
            boxShadow: customTheme.shadows.modal,
          },

          '& .MuiBackdrop-root': {
            backgroundColor: 'inherit',
          },
        },
      }}
    >
      <Box
        sx={{
          fontFamily: customTheme.font.roboto,
          padding: '0 93px 56px 93px ',
        }}
      >
        <Formik
          initialValues={pagerDutyInitialValues}
          onSubmit={handleSubmit}
          validationSchema={pagerDutyKeyValidator}
          validateOnChange={false}
        >
          {({ errors }) => (
            <Form>
              <Typography
                sx={{
                  fontSize: '24px',
                  lineHeight: 1,
                  fontFamily: 'inherit',
                  color: 'text.primary',
                  marginBottom: '8px',
                }}
              >
                PagerDuty
              </Typography>
              <Field
                name="key"
                component={MuiTextField}
                placeholder="API Key"
                type="text"
                fullWidth
                error={!!errors.key}
                helperText={!!errors.key && errors.key}
                FormHelperTextProps={helperTextStyle}
                sx={{
                  marginBottom: '24px',
                  '& fieldset': { borderColor: 'primary.main' },

                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    boxShadow: customTheme.shadows.field,
                    backgroundColor: '#FEFEFF',
                  },

                  '& input': {
                    color: '#002147',
                    '&::placeholder': {
                      color: 'text.secondary',
                    },
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

export default PagerDutyPage;

