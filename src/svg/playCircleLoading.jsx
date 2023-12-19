import React from 'react';
import { styled } from '@mui/material/styles';

const StyledGroup = styled('g')(() => ({
  animation: `spin infinite 1.5s linear`,
  transformOrigin: 'center',

  '@keyframes spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
}));

const PlayCircleLoading = ({ frameColor, playColor }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <StyledGroup>
        <path
          d="M19.0703 19.0697C22.9803 15.1597 22.9803 8.82969 19.0703 4.92969"
          stroke={frameColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.93055 4.92969C1.02055 8.83969 1.02055 15.1697 4.93055 19.0697"
          stroke={frameColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.69922 21.4102C9.76922 21.7802 10.8792 21.9602 11.9992 21.9602C13.1192 21.9502 14.2292 21.7802 15.2992 21.4102"
          stroke={frameColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.69922 2.58911C9.76922 2.21911 10.8792 2.03906 11.9992 2.03906C13.1192 2.03906 14.2292 2.21911 15.2992 2.58911"
          stroke={frameColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </StyledGroup>
      <path
        d="M8.74023 12.0001V10.3302C8.74023 8.25016 10.2103 7.40014 12.0103 8.44014L13.4602 9.28017L14.9102 10.1201C16.7102 11.1601 16.7102 12.8602 14.9102 13.9002L13.4602 14.7401L12.0103 15.5802C10.2103 16.6202 8.74023 15.7701 8.74023 13.6901V12.0001Z"
        stroke={playColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PlayCircleLoading;
