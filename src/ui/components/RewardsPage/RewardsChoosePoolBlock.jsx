import {
  Checkbox,
  FormControl,
  InputAdornment,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  useTheme,
} from '@mui/material';
import React from 'react';
import SelectArrow from '../../../svg/Arrows/rewardsSelectArrow';
import { getCustomThemeStyles } from '../../styles/theme';

const RewardsChoosePoolBlock = ({
  selectTitle,
  isOpen,
  handleSelectOpen,
  handleSelectClose,
  pools,
  selectedPools,
  handlePoolsChange,
  disabled,
}) => {
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');
  const adornment = selectedPools.length > 99 ? '100+' : selectedPools.length;

  return (
    <FormControl sx={{ width: { xs: 1, sm: 360 } }}>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={selectedPools}
        onChange={handlePoolsChange}
        input={<OutlinedInput />}
        renderValue={() => selectTitle}
        open={isOpen}
        onOpen={handleSelectOpen}
        onClose={handleSelectClose}
        disabled={disabled}
        displayEmpty
        endAdornment={
          <InputAdornment
            sx={{
              position: 'absolute',
              right: '42px',
              fontFamily: customTheme.font.roboto,
              fontSize: '11px',
              bottom: {
                xs: isOpen ? '11px' : '12px',
                sm: isOpen ? '15px' : '16px',
              },
            }}
            position="end"
          >
            {adornment}
          </InputAdornment>
        }
        MenuProps={{
          sx: {
            ul: {
              padding: 0,
            },
            li: {
              padding: '0 8px',

              '& > span': {
                paddingBlock: '8px',
              },
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
              },

              '& .MuiTypography-root': {
                fontSize: { xs: '15px', sm: '16px' },
                fontFamily: customTheme.font.roboto,
                letterSpacing: '0.05em',
              },
            },
          },
          PaperProps: {
            sx: {
              borderRadius: '0 0 5px 5px',
              boxShadow: 'none',
              backgroundColor: 'primary.light',
              border: 1,
              borderColor: 'primary.dark',
            },
          },
        }}
        sx={{
          paddingRight: '0',

          '& .MuiSelect-icon': {
            color: 'text.primary',
            top: 0,
            bottom: 0,
            right: '16px',
            marginBlock: 'auto',
            transform: 'rotate(90deg)',
            transition: '0.15s',
          },
          '& .MuiSelect-iconOpen': {
            transform: 'rotate(0deg)',
          },

          '& .MuiInputBase-input': {
            padding: '4px 16px',
            fontFamily: customTheme.font.roboto,
            fontSize: '16px',
            lineHeight: { xs: 1, sm: 1.5 },
            minHeight: '0 !important',
            color: 'text.secondary',
            backgroundColor: 'primary.light',
            borderRadius: '5px !important',
            borderWidth: isOpen ? '1px 1px 0 1px' : 1,
            borderStyle: 'solid',
            borderColor: 'primary.dark',
          },

          '& fieldset': {
            border: 1,
            borderColor: 'primary.dark',
          },

          '&.Mui-focused fieldset': {
            border: 'inherit !important',
            borderColor: 'inherit !important',
          },

          '& ul': {
            paddingBlock: '0 !important',
          },
        }}
        IconComponent={(props) => <SelectArrow {...props} />}
      >
        {pools.map((pool) => (
          <MenuItem key={pool} value={pool}>
            <Checkbox checked={selectedPools.indexOf(pool) > -1} />
            <ListItemText primary={pool} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default RewardsChoosePoolBlock;
