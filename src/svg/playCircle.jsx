import React from 'react';

const PlayCircleIcon = ({ frameColor, playColor }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9707 22C17.4936 22 21.9707 17.5228 21.9707 12C21.9707 6.47715 17.4936 2 11.9707 2C6.44786 2 1.9707 6.47715 1.9707 12C1.9707 17.5228 6.44786 22 11.9707 22Z"
        stroke={frameColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.74023 12.2306V10.5606C8.74023 8.48061 10.2102 7.63061 12.0102 8.67061L13.4602 9.51061L14.9102 10.3506C16.7102 11.3906 16.7102 13.0906 14.9102 14.1306L13.4602 14.9706L12.0102 15.8106C10.2102 16.8506 8.74023 16.0006 8.74023 13.9206V12.2306Z"
        stroke={playColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PlayCircleIcon;
