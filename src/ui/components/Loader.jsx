import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledWrapper = styled(Box)(({ theme }) => ({
  width: '52px',
  height: '50px',
  position: 'relative',
  transform: 'translateZ(0) scale(1)',
  backfaceVisibility: 'hidden',
  transformOrigin: '0 0',

  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
    },

    '100%': {
      opacity: 1,
    },
  },

  '& div': {
    boxSizing: 'content-box',
    left: '22px',
    top: '0',
    position: 'absolute',
    animation: `fadeIn 1s infinite`,
    background: theme.palette.primary.main,
    width: '5.76px',
    height: '11.52px',
    borderRadius: '6px / 12px',
    transformOrigin: '3px 25px',
  },

  '& div:nth-of-type(1)': {
    transform: 'rotate(0deg)',
    animationDelay: '-0.9166666666666666s',
    background: theme.palette.primary.main,
  },
  '& div:nth-of-type(2)': {
    transform: 'rotate(30deg)',
    animationDelay: '-0.8333333333333334s',
    background: '#8073e3',
  },
  '& div:nth-of-type(3)': {
    transform: 'rotate(60deg)',
    animationDelay: '-0.75s',
    background: '#a096ea',
  },
  '& div:nth-of-type(4)': {
    transform: 'rotate(90deg)',
    animationDelay: '-0.6666666666666666s',
    background: '#bfb9f1',
  },
  '& div:nth-of-type(5)': {
    transform: 'rotate(120deg)',
    animationDelay: '-0.5833333333333334s',
    background: '#dfdcf8',
  },
  '& div:nth-of-type(6)': {
    transform: 'rotate(150deg)',
    animationDelay: '-0.5s',
    background: theme.palette.primary.main,
  },
  '& div:nth-of-type(7)': {
    transform: 'rotate(180deg)',
    animationDelay: '-0.4166666666666667s',
    background: '#8073e3',
  },
  '& div:nth-of-type(8)': {
    transform: 'rotate(210deg)',
    animationDelay: '-0.3333333333333333s',
    background: '#a096ea',
  },
  '& div:nth-of-type(9)': {
    transform: 'rotate(240deg)',
    animationDelay: '-0.25s',
    background: '#bfb9f1',
  },
  '& div:nth-of-type(10)': {
    transform: 'rotate(270deg)',
    animationDelay: '-0.16666666666666666s',
    background: '#dfdcf8',
  },
  '& div:nth-of-type(11)': {
    transform: 'rotate(300deg)',
    animationDelay: '-0.08333333333333333s',
    background: theme.palette.primary.main,
  },
  '& div:nth-of-type(12)': {
    transform: 'rotate(330deg)',
    animationDelay: '0s',
    background: '#8073e3',
  },
}));

const Loader = () => {
  return (
    <StyledWrapper>
      <Box></Box>
      <Box></Box>
      <Box></Box>
      <Box></Box>
      <Box></Box>
      <Box></Box>
      <Box></Box>
      <Box></Box>
      <Box></Box>
      <Box></Box>
      <Box></Box>
      <Box></Box>
    </StyledWrapper>
  );
};

export default Loader;
