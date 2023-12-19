import React from 'react';

const LockIcon = ({ frameColor, lockColor }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 26.6663V21.333C16 12.5063 18.6667 5.33301 32 5.33301C45.3333 5.33301 48 12.5063 48 21.333V26.6663"
        stroke={frameColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.0007 49.3333C35.6825 49.3333 38.6673 46.3486 38.6673 42.6667C38.6673 38.9848 35.6825 36 32.0007 36C28.3188 36 25.334 38.9848 25.334 42.6667C25.334 46.3486 28.3188 49.3333 32.0007 49.3333Z"
        stroke={lockColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M45.334 58.667H18.6673C8.00065 58.667 5.33398 56.0003 5.33398 45.3337V40.0003C5.33398 29.3337 8.00065 26.667 18.6673 26.667H45.334C56.0007 26.667 58.6673 29.3337 58.6673 40.0003V45.3337C58.6673 56.0003 56.0007 58.667 45.334 58.667Z"
        stroke={frameColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LockIcon;
