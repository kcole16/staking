import React from 'react';

const NotificationIcon = ({ backgroundColor, bellColor, ringColor }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="20" fill={backgroundColor} />
      <path
        d="M20.0196 10.9102C16.7096 10.9102 14.0196 13.6002 14.0196 16.9102V19.8002C14.0196 20.4102 13.7596 21.3402 13.4496 21.8602L12.2996 23.7702C11.5896 24.9502 12.0796 26.2602 13.3796 26.7002C17.6896 28.1402 22.3396 28.1402 26.6496 26.7002C27.8596 26.3002 28.3896 24.8702 27.7296 23.7702L26.5796 21.8602C26.2796 21.3402 26.0196 20.4102 26.0196 19.8002V16.9102C26.0196 13.6102 23.3196 10.9102 20.0196 10.9102Z"
        stroke={bellColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M23.0195 27.0605C23.0195 28.7105 21.6695 30.0605 20.0195 30.0605C19.1995 30.0605 18.4395 29.7205 17.8995 29.1805C17.3595 28.6405 17.0195 27.8805 17.0195 27.0605"
        stroke={ringColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export default NotificationIcon;
