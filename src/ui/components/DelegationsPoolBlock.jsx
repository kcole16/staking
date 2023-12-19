import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { getCustomThemeStyles } from '../styles/theme';

const DelegationsPoolBlock = ({ data, value, handleChange }) => {
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');
  const labelContainer = {
    display: 'flex',
    alignItems: 'center',
    columnGap: '12px',
    paddingLeft: '20px',
  };

  const dotLabel = {
    width: '8px',
    height: '9px',
    borderRadius: '50%',
    backgroundColor: '#D2D1DA',
    transition: 'all 0.15s',
  };

  const radioLabel = {
    marginBottom: '16px',
    '&:last-of-type': { marginBottom: 0 },

    '& .Mui-checked + span': {
      '& .dot': {
        backgroundColor: 'primary.main',
      },

      '& .modalLabel': {
        backgroundColor: '#DBDBFF',
      },
    },

    '& .MuiTypography-root': {
      fontFamily: customTheme.font.roboto,
      letterSpacing: '0.5px',
      width: 1,
    },
  };

  return (
    <Box
      sx={{
        maxHeight: '160px',
        border:
          theme.palette.mode === 'dark'
            ? '1px solid #565c6c'
            : '1px solid #D2D1DA',
        borderRadius: '5px',
      }}
    >
      {(data.length === 0 && (
        <Typography
          sx={{
            letterSpacing: '0.05px',
            fontFamily: customTheme.font.roboto,
            padding: '8px 16px',
            color: customTheme.colors.fileLink,
          }}
        >
          not one pool yet
        </Typography>
      )) || (
        <Box
          sx={{
            maxHeight: '160px',
            height: 1,
            width: 'calc(100% + 20px)',
            overflow: 'hidden auto',
            scrollbarColor: `${theme.palette.primary.main} ${customTheme.colors.delegationScrollbar}`,

            '::-webkit-scrollbar': {
              width: '12px',
              backgroundColor: customTheme.colors.delegationScrollbar,
              borderRadius: '5px',
            },

            '::-webkit-scrollbar-thumb': {
              backgroundColor: 'primary.main',
              borderRadius: '5px',
            },
          }}
        >
          <Stack
            sx={{
              width: 1,
              padding: '8px 0 8px 8px',
              height: 1,
            }}
          >
            <RadioGroup
              aria-labelledby="pool-label"
              name="poolName"
              value={value}
              align="left"
              onChange={handleChange}
            >
              {data.map((v) => (
                <FormControlLabel
                  key={v}
                  value={v}
                  control={<Radio size="small" sx={{ display: 'none' }} />}
                  label={
                    <Box sx={labelContainer}>
                      <Box component="span" sx={dotLabel} className="dot" />
                      {v}
                    </Box>
                  }
                  sx={radioLabel}
                />
              ))}
            </RadioGroup>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default DelegationsPoolBlock;
