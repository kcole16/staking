import { Box, Typography } from '@mui/material';
import React from 'react';
import CheckMarkIcon from '../../../svg/checkmark';
import { getCustomThemeStyles } from '../../styles/theme';
import { useTheme } from '@emotion/react';

const RunOrderFormComponent = ({ data, containerProps }) => {
  const theme = useTheme();

  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  return (
    <Box {...containerProps}>
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
          <Box sx={{ textAlign: 'center', marginTop: '40px' }}>
            <Typography
              sx={{
                fontFamily: customTheme.font.roboto,
                fontWeight: 700,
                fontSize: '48px',
                lineHeight: 1,
              }}
            >{`$${data.price}/mth`}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RunOrderFormComponent;

