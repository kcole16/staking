import React from 'react';

const InfoCircleBig = ({ frameColor, exclamationColor }) => {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32.0007 58.6663C46.6673 58.6663 58.6673 46.6663 58.6673 31.9997C58.6673 17.333 46.6673 5.33301 32.0007 5.33301C17.334 5.33301 5.33398 17.333 5.33398 31.9997C5.33398 46.6663 17.334 58.6663 32.0007 58.6663Z"
        stroke="#002147"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 21.333V34.6663"
        stroke="#802FF3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.9844 42.667H32.0083"
        stroke="#802FF3"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default InfoCircleBig;
