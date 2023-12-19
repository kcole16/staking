import { Box, Button, FormControlLabel, Typography } from '@mui/material';
import React from 'react';
import CheckMarkIcon from '../../../svg/checkmark';
import { StyledSwitch } from '../Switch';
import { getCustomThemeStyles } from '../../styles/theme';
import { useTheme } from '@emotion/react';

const OrderFormComponent = ({ data, formData, setFormData }) => {
  const theme = useTheme();
  const handleOrderClick = (name) => {
    setFormData({
      ...formData,
      server: name,
      backup: name === 'PRO' ? false : formData.backup,
    });
  };

  const handleSwitchChange = (e) => {
    setFormData({ ...formData, backup: e.target.checked });
  };

  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
    <Box
      sx={{
        width: '50%',

        borderRight: 1,
        borderColor: customTheme.colors.primary,

        '&:last-of-type': {
          border: 0,
        },
      }}
    >
      <Box
        className="padding__box"
        sx={{
          height: 'calc(100% - 98px)',
          paddingInline: '102px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              component="h3"
              sx={{
                textAlign: 'center',
                fontSize: '40px',
                fontWeight: '700',
                fontFamily: customTheme.font.roboto,
                color: 'text.primary',
                lineHeight: 1,
              }}
            >
              kuutamo&nbsp;
              <Typography
                component="span"
                sx={{
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  fontWeight: 'inherit',
                  color: 'primary.main',
                  lineHeight: 1,
                }}
              >
                {data.title}
              </Typography>
            </Typography>
            <Box sx={{ paddingTop: '40px' }}>
              {data.benefits.map((benefdata, idx) => (
                <Box
                  key={idx}
                  sx={{
                    fontFamily: customTheme.font.roboto,
                    display: 'flex',
                    alignItems: 'center',
                    lineHeight: 1.25,
                    color: customTheme.colors.secondary,
                    fontSize: '18px',
                    columnGap: '10px',
                    marginBottom: '16px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'primary.main',
                      width: '12px',
                      height: '9px',
                    }}
                  >
                    <CheckMarkIcon />
                  </Box>
                  {benefdata}
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                fontFamily: customTheme.font.roboto,
                fontWeight: 700,
                fontSize: '48px',
                lineHeight: 1,
              }}
            >{`$${data.price}/mth`}</Typography>
            <Button
              onClick={() => handleOrderClick(data.title)}
              variant={
                formData.server === data.title ? 'contained' : 'outlined'
              }
              sx={{
                marginTop: '16px',
                fontSize: '15px',
                lineHeight: 1,
                color:
                  formData.server === data.title
                    ? 'primary.light'
                    : 'secondary',
                padding: '16px 53.5px',
              }}
            >
              SELECT
            </Button>
          </Box>
        </Box>
      </Box>
      <Box sx={{ marginBlock: '32px 16px', height: '60px' }}>
        {data.additional &&
          data.additional.map((additionaldata, idx) => (
            <Box
              sx={{
                fontFamily: customTheme.font.roboto,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                columnGap: '20px',
              }}
              key={idx}
            >
              <Box
                sx={{
                  fontSize: '24px',
                  lineHeight: 1.25,
                  color: 'text.primary',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                }}
              >
                {additionaldata.text}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '16px',
                }}
              >
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
                    <StyledSwitch
                      onChange={handleSwitchChange}
                      checked={formData.backup}
                      disabled={formData.server === 'PRO'}
                    />
                  }
                  label={`$${additionaldata.price}/mth`}
                />
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default OrderFormComponent;

