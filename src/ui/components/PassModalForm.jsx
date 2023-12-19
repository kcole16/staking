import { Field, Form, Formik } from 'formik';
import React from 'react';
import MuiTextField from './MuiTextFieldFormik';
import ModalWrapper from './AuthModalWrapper';

import { passwordModalFormInitialValues } from '../../constants';
import { passModalValidator } from '../../validators/passwordModalValidator';
import {
  Box,
  Button,
  DialogContent,
  Typography,
  useTheme,
} from '@mui/material';
import { getCustomThemeStyles } from '../styles/theme';

const PassModalForm = ({
  isOpen,
  handleClose,
  onSubmit,
  message,
  label = 'Password for encrypting',
}) => {
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');
  const handleSubmit = (values, { resetForm }) => {
    onSubmit(values.password);
    resetForm();
    handleClose();
  };

  const helperTextStyle = {
    sx: {
      fontWeight: '400',
      fontFamily: customTheme.font.roboto,
      fontSize: '14px',
    },
  };

  return (
    <ModalWrapper isOpen={isOpen} handleClose={handleClose}>
      <DialogContent>
        <Formik
          initialValues={passwordModalFormInitialValues}
          onSubmit={handleSubmit}
          validationSchema={passModalValidator}
        >
          {({ errors }) => (
            <Form>
              <Field
                name="password"
                component={MuiTextField}
                type="password"
                fullWidth
                label={label}
                error={!!errors.password}
                helperText={!!errors.password && errors.password}
                FormHelperTextProps={helperTextStyle}
                sx={{
                  marginBottom: '16px',
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                }}
              />
              {message && (
                <Typography
                  component="h2"
                  sx={{
                    textAlign: 'center',
                    fontWeight: 700,
                    color: 'text.primary',
                    marginBottom: '10px',
                  }}
                >
                  {message}
                </Typography>
              )}
              <Box sx={{ textAlign: 'center' }}>
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
                  SUBMIT
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </ModalWrapper>
  );
};

export default PassModalForm;
