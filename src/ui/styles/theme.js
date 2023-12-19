const setThemesValues = (lightVal, darkVal, isDarkTheme) => {
  return isDarkTheme ? darkVal : lightVal;
};

export const getCustomThemeStyles = (isDarkTheme) => {
  return {
    shadows: {
      main: setThemesValues(
        '0px 38px 80px rgba(128, 47, 243, 0.0393604), 0px 15.8755px 33.4221px rgba(128, 47, 243, 0.056545), ' +
          '0px 8.4878px 17.869px rgba(128, 47, 243, 0.07), 0px 4.75819px 10.0172px rgba(128, 47, 243, 0.083455), ' +
          '0px 2.52704px 5.32008px rgba(128, 47, 243, 0.10064), 0px 1.05156px 2.21381px rgba(128, 47, 243, 0.14)',
        '0px 38px 80px rgba(54, 223, 211, 0.0393604), 0px 15.8755px 33.4221px rgba(54, 223, 211, 0.056545), ' +
          '0px 8.4878px 17.869px rgba(54, 223, 211, 0.07), 0px 4.75819px 10.0172px rgba(54, 223, 211, 0.083455), ' +
          '0px 2.52704px 5.32008px rgba(54, 223, 211, 0.10064), 0px 1.05156px 2.21381px rgba(54, 223, 211, 0.14)',
        isDarkTheme
      ),
      btn: setThemesValues(
        '0px 26px 30px rgba(128, 47, 243, 0.24), 0px 13px 150px rgba(128, 47, 243, 0.18), 0px 8px 90px rgba(128, 47, 243, 0.15), 0px 5px 58px rgba(128, 47, 243, 0.14), 0px 3px 38px rgba(128, 47, 243, 0.12), 0px 2px 24px rgba(128, 47, 243, 0.1), 0px 1px 13px rgba(128, 47, 243, 0.08), 0px 1px 6px rgba(128, 47, 243, 0.06);',
        `0px 26px 30px rgba(54, 223, 211, 0.24), 0px 13px 150px rgba(54, 223, 211, 0.18), 0px 8px 90px rgba(54, 223, 211, 0.15), 0px 5px 58px rgba(54, 223, 211, 0.14), 0px 3px 38px rgba(54, 223, 211, 0.12), 0px 2px 24px rgba(54, 223, 211, 0.1), 0px 1px 13px rgba(54, 223, 211, 0.08), 0px 1px 6px rgba(54, 223, 211, 0.06);`,
        isDarkTheme
      ),
      modal: setThemesValues(
        '0px 123px 49px rgba(0, 33, 71, 0.01), 0px 69px 41px rgba(0, 33, 71, 0.03), 0px 31px 31px rgba(0, 33, 71, 0.04), 0px 8px 17px rgba(0, 33, 71, 0.05), 0px 0px 0px rgba(0, 33, 71, 0.05)',
        '0px 123px 49px rgba(54, 223, 211, 0.01), 0px 69px 41px rgba(54, 223, 211, 0.03), 0px 31px 31px rgba(54, 223, 211, 0.04), 0px 8px 17px rgba(54, 223, 211, 0.05), 0px 0px 0px rgba(54, 223, 211, 0.05)',
        isDarkTheme
      ),

      field: setThemesValues(
        '0px 38px 80px rgba(128, 47, 243, 0.04), 0px 16px 33px rgba(128, 47, 243, 0.06), 0px 8px 18px rgba(128, 47, 243, 0.07), 0px 5px 10px rgba(128, 47, 243, 0.08), 0px 2px 5px rgba(128, 47, 243, 0.1), 0px 1px 2px rgba(128, 47, 243, 0.14)',
        '0px 38px 80px rgba(54, 223, 211, 0.04), 0px 16px 33px rgba(54, 223, 211, 0.06), 0px 8px 18px rgba(54, 223, 211, 0.07), 0px 5px 10px rgba(54, 223, 211, 0.08), 0px 2px 5px rgba(54, 223, 211, 0.1), 0px 1px 2px rgba(54, 223, 211, 0.14)',
        isDarkTheme
      ),
      light: setThemesValues(
        '0px 0px 8px rgb(0 33 71 / 10%)',
        '0px 0px 8px rgba(7, 9, 14, 0.1);',
        isDarkTheme
      ),
    },
    colors: {
      primary: setThemesValues('#E6D5FD', '#FEFEFE', isDarkTheme),
      secondary: setThemesValues('#011124', '#FEFEFF', isDarkTheme),
      tertiary: setThemesValues('#FEFEFF', '#002147', isDarkTheme),
      link: setThemesValues('#188FE9', '#188FE9', isDarkTheme),
      homeLogo: {
        start: setThemesValues('#4D4DFF', '#FEFEFF', isDarkTheme),
        end: setThemesValues('#9900FF', '#FEFEFF', isDarkTheme),
      },
      delegationWithdraw: setThemesValues('#002147', '#D2D1DA', isDarkTheme),
      serverLink: setThemesValues('#D2D1DA', '#D2D1DA', isDarkTheme),
      ovhLogo: setThemesValues('#000E9C', '#FEFEFE', isDarkTheme),
      btn: setThemesValues('#DFDCF8', '#DFDCF8', isDarkTheme),
      tableBtn: setThemesValues('#FEFEFF', '#011124', isDarkTheme),
      soonBg: setThemesValues('#9492A7', '#001D3E', isDarkTheme),
      soonLineBg: setThemesValues('#F2F2F5', '#696A85', isDarkTheme),
      soon: setThemesValues('#CCACFA', '#97EEE8', isDarkTheme),
      github: setThemesValues('#4F4B6D', '#FEFEFE', isDarkTheme),
      lightgrey: setThemesValues('#7B7891', '#7B7891', isDarkTheme),
      fileLink: setThemesValues('#7B7891', '#FEFEFE', isDarkTheme),
      switchNoChoosenVal: setThemesValues('#9492A7', '#9492A7', isDarkTheme),
      notification: setThemesValues('#002147', '#36DFD3', isDarkTheme),
      notificationRing: setThemesValues('#011124', '#36DFD3', isDarkTheme),
      notificationBg: setThemesValues('#ADB7E0', '#151C2B', isDarkTheme),
      settingsBg: setThemesValues('#4F4B6D', '#151C2B', isDarkTheme),
      settingsGear: setThemesValues('#FEFEFE', '#36DFD3', isDarkTheme),
      lineGraph: setThemesValues('#FEFEFE', '#D6DBF0', isDarkTheme),
      delegationInfo: setThemesValues('#7B7891', '#9492A7', isDarkTheme),
      delegationDivider: setThemesValues('#D2D1DA', '#9492A7', isDarkTheme),
      modalDivider: setThemesValues('#000', '#000', isDarkTheme),
      delegationHover: setThemesValues('#F2F5FF', '#002147', isDarkTheme),
      delegationHoverColor: setThemesValues('#002147', '#011124', isDarkTheme),
      delegationSelected: setThemesValues('#DBDBFF', '#DDF9F7', isDarkTheme),
      delegationScrollbar: setThemesValues('#D2D1DA', '#002147', isDarkTheme),
    },
    font: {
      roboto: "'Roboto', sans-serif",
    },
  };
};

