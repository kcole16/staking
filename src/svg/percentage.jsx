import React from 'react';

const PercentageIcon = ({ frameColor, percentageColor }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 2H15C20 2 22 4 22 9V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2Z"
        stroke={frameColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.57031 15.2704L15.1103 8.73047"
        stroke={percentageColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.98001 10.3701C9.65932 10.3701 10.21 9.81948 10.21 9.14017C10.21 8.46086 9.65932 7.91016 8.98001 7.91016C8.3007 7.91016 7.75 8.46086 7.75 9.14017C7.75 9.81948 8.3007 10.3701 8.98001 10.3701Z"
        stroke={percentageColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.519 16.0899C16.1984 16.0899 16.7491 15.5392 16.7491 14.8599C16.7491 14.1806 16.1984 13.6299 15.519 13.6299C14.8397 13.6299 14.2891 14.1806 14.2891 14.8599C14.2891 15.5392 14.8397 16.0899 15.519 16.0899Z"
        stroke={percentageColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PercentageIcon;
