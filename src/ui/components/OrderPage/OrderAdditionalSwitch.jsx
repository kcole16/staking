import { Box, FormControlLabel, Typography } from '@mui/material';
import React from 'react';
import { StyledSwitch } from '../Switch';

const OrderAdditionalSwitch = ({ service, formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, SRE: e.target.checked });
  };
  return (
    <Box
      sx={{
        fontFamily: customTheme.font.roboto,
        marginTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: '24px',
      }}
    >
      <Box>
        <Typography
          sx={{
            fontFamily: 'inherit',
            fontSize: '24px',
            lineHeight: 1,
            fontWeight: 500,
            marginBottom: '8px',
          }}
        >
          {service.title}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'inherit',
            fontSize: '18px',
            lineHeight: 1.25,
          }}
        >
          {service.description}
        </Typography>
      </Box>
      <FormControlLabel
        sx={{
          display: 'flex',
          columnGap: '24px',
          margin: 0,

          '& span:last-child': {
            fontFamily: customTheme.font.roboto,
            fontSize: '28px',
            lineHeight: 1,
          },
        }}
        labelPlacement="start"
        control={
          <StyledSwitch onChange={handleChange} checked={formData.SRE} />
        }
        label={`$${service.price}/mth`}
      />
    </Box>
  );
};

export default OrderAdditionalSwitch;

