import React from 'react';

const ChangeThemeIcon = ({ isDarkTheme }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {(isDarkTheme && (
        <>
          <rect
            x="0.5"
            y="0.5"
            width="39"
            height="39"
            rx="19.5"
            fill="#151C2B"
          />
          <path
            d="M20 26.5C23.5899 26.5 26.5 23.5899 26.5 20C26.5 16.4101 23.5899 13.5 20 13.5C16.4101 13.5 13.5 16.4101 13.5 20C13.5 23.5899 16.4101 26.5 20 26.5Z"
            stroke="#36DFD3"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M27.14 27.14L27.01 27.01M27.01 12.99L27.14 12.86L27.01 12.99ZM12.86 27.14L12.99 27.01L12.86 27.14ZM20 10.08V10V10.08ZM20 30V29.92V30ZM10.08 20H10H10.08ZM30 20H29.92H30ZM12.99 12.99L12.86 12.86L12.99 12.99Z"
            stroke="#36DFD3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="0.5"
            y="0.5"
            width="39"
            height="39"
            rx="19.5"
            stroke="#151C2B"
          />
        </>
      )) || (
        <>
          <rect width="40" height="40" rx="20" fill="#4F4B6D" />
          <path
            d="M10.0301 20.42C10.3901 25.57 14.7601 29.76 19.9901 29.99C23.6801 30.15 26.9801 28.43 28.9601 25.72C29.7801 24.61 29.3401 23.87 27.9701 24.12C27.3001 24.24 26.6101 24.29 25.8901 24.26C21.0001 24.06 17.0001 19.97 16.9801 15.14C16.9701 13.84 17.2401 12.61 17.7301 11.49C18.2701 10.25 17.6201 9.65996 16.3701 10.19C12.4101 11.86 9.70009 15.85 10.0301 20.42Z"
            stroke="#FEFEFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
};

export default ChangeThemeIcon;

<svg
  width="40"
  height="40"
  viewBox="0 0 40 40"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
></svg>;
