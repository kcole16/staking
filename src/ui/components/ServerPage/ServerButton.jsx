import { styled } from '@mui/material/styles';
import { getCustomThemeStyles } from '../../styles/theme';
import { Button } from '@mui/material';

export const ServerButton = styled(Button)(({ theme }) => ({
  width: '200px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.light,
  borderColor: getCustomThemeStyles(theme.palette.mode === 'dark').colors
    .serverLink,

  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    boxShadow: getCustomThemeStyles(theme.palette.mode === 'dark').shadows.main,
  },
}));
