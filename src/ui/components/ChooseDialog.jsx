import React from 'react';
import LinkButton from './LinkButton';
import ModalWrapper from './AuthModalWrapper';
import { Box, Button } from '@mui/material';

const ChooseDialog = ({
  buttonComponent,
  buttonLink,
  submitButtonText,
  ...props
}) => {
  return (
    <ModalWrapper {...props}>
      {props.data.map((dataEl) => (
        <LinkButton key={dataEl.id} {...dataEl} />
      ))}
      {submitButtonText && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '16px',
            marginBottom: '72px',
            textDecoration: 'none',
          }}
          component={buttonComponent}
          to={buttonLink}
        >
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
      )}
    </ModalWrapper>
  );
};

export default ChooseDialog;

