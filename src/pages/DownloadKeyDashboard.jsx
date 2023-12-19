import React, { useEffect, useState } from 'react';
import ChooseDialog from '../ui/components/ChooseDialog';
import { useTheme } from '@mui/material';
import { getCustomThemeStyles } from '../ui/styles/theme';
import FileLinkIcon from '../svg/link';

import LoginIcon from '../svg/login';
import { useNavigate } from 'react-router-dom';
import { monitoringService } from '../helpers/monitoring';
import { authService } from '../helpers/auth';

const DownloadKeyDashboard = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const token = localStorage.getItem('TOKEN');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const timeRemaining = authService.getRemainingTime(token);
      const timeInMinutes = timeRemaining / 60;
      if (timeInMinutes > 0) {
        setIsAuthorized(true);
      } else {
        navigate('/signin', {
          state: { to: '/pools/data', back: '/pools' },
        });
      }
    } else {
      navigate('/signin', { state: { to: '/pools/data' } });
    }
  }, [navigate, token]);

  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');
  const className = 'follow';
  const frameColor =
    className === 'follow' ? '#002147' : theme.palette.text.primary;
  const arrowColor = theme.palette.primary.main;

  const downloadMonitoringToken = async () => {
    const token = localStorage.getItem('TOKEN');
    if (token) {
      const data = await monitoringService.getGrafanaToken(token);
      if (data && data.token) {
        const { token: grafana } = data;
        const blob = new Blob([grafana], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'kuutamo-monitoring.token';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const data = [
    {
      id: 1,
      className,
      containerStyles: {
        marginInline: '16%',
      },
      onClick: downloadMonitoringToken,
      title: 'Step 1',
      text: 'Download monitoring token',
      icon: <FileLinkIcon frameColor={frameColor} arrowColor={arrowColor} />,
    },
    {
      id: 2,
      className,
      containerStyles: {
        marginInline: '16%',
      },
      //   onClick: downloadConfigFile,
      title: 'Step 2',
      text: 'Go to dashboard',
      to: '/dashboard',
      //   disabled: !(isServersExists && isKeysExists),
      icon: <LoginIcon frameColor={frameColor} arrowColor={arrowColor} />,
    },
  ];

  const handleClose = () => navigate('/pools');

  return isAuthorized ? (
    <ChooseDialog
      handleClose={handleClose}
      title="Follow the steps"
      isOpen={true}
      data={data}
      dialogProps={{
        sx: {
          '& .MuiPaper-root': {
            boxShadow: customTheme.shadows.modal,
            maxWidth: '576px',
          },

          '& .MuiBackdrop-root': {
            backgroundColor: 'inherit',
          },
        },
      }}
    />
  ) : null;
};

export default DownloadKeyDashboard;

