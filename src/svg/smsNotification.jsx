import React from 'react';

const SmsNotificationIcon = ({ checkmarkColor, mailColor }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M46.7559 16.9842L48.9764 19.2048L53.778 14.7637"
        stroke={checkmarkColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M58.6663 27.9997V41.333C58.6663 50.6663 53.333 54.6663 45.333 54.6663H18.6663C10.6663 54.6663 5.33301 50.6663 5.33301 41.333V22.6663C5.33301 13.333 10.6663 9.33301 18.6663 9.33301H37.333"
        stroke={mailColor}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.667 24L27.0137 30.6667C29.7603 32.8533 34.267 32.8533 37.0137 30.6667L40.1603 28.16"
        stroke={mailColor}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50.1069 25.12C54.8344 25.12 58.6668 21.2875 58.6668 16.56C58.6668 11.8324 54.8344 8 50.1069 8C45.3793 8 41.5469 11.8324 41.5469 16.56C41.5469 21.2875 45.3793 25.12 50.1069 25.12Z"
        stroke={checkmarkColor}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SmsNotificationIcon;
