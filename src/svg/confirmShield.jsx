import React from 'react';

const ConfirmShieldIcon = ({ shieldColor, checkmarkColor }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 65 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.4738 5.94617L15.1671 10.9595C12.1004 12.1062 9.59375 15.7328 9.59375 18.9862V38.7995C9.59375 41.9462 11.6737 46.0795 14.2071 47.9728L25.6737 56.5328C29.4337 59.3595 35.6204 59.3595 39.3804 56.5328L50.8471 47.9728C53.3804 46.0795 55.4604 41.9462 55.4604 38.7995V18.9862C55.4604 15.7062 52.9538 12.0795 49.8871 10.9328L36.5804 5.94617C34.3138 5.11951 30.6871 5.11951 28.4738 5.94617Z"
        stroke={shieldColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.6338 31.6538L28.9271 35.9471L40.3938 24.4805"
        stroke={checkmarkColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ConfirmShieldIcon;
