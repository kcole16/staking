import React, { useEffect, useState } from 'react';
import { authService } from '../helpers/auth';
import { monitoringService } from '../helpers/monitoring';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Loader from '../ui/components/Loader';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { dashboardAutoRefresh } from '../constants';

const Dashboard = () => {
  const navigate = useNavigate();
  const [token, setNewToken] = useState(localStorage.getItem('TOKEN') || '');
  const [isGrafanaReady, setGrafanaReady] = useState(undefined);
  const [autoRefresh, setAutoRefresh] = useState(
    localStorage.getItem('iframeAutoRefresh') || '5s'
  );
  const theme = useTheme();

  useEffect(() => {
    if (token) {
      const timeRemaining = authService.getRemainingTime(token);
      const timeInMinutes = timeRemaining / 60;
      if (timeInMinutes > 0) {
        monitoringService
          .isExistsGrafanaToken(token)
          .then((resIsExistsGrafanaToken) => {
            if (resIsExistsGrafanaToken)
              monitoringService
                .checkGrafanaUrl(token)
                .then((resCheckGrafanaUrl) =>
                  setGrafanaReady(resCheckGrafanaUrl)
                );
            else navigate('/pools/data');
          });
        const getRefreshToken = () => {
          authService.refreshToken(token).then((res) => {
            if (res && res.status === 'success' && res.data && res.data.token) {
              localStorage.setItem('TOKEN', res.data.token);
              setNewToken(res.data.token);
            } else {
              navigate('/signin', {
                state: { to: '/dashboard', back: '/pools' },
              });
            }
          });
        };
        if (timeInMinutes <= 5) {
          getRefreshToken();
        } else {
          setTimeout(getRefreshToken, (timeRemaining - 300) * 1000);
        }
      } else {
        navigate('/signin', { state: { to: '/dashboard', back: '/pools' } });
      }
    } else {
      navigate('/signin', { state: { to: '/dashboard', back: '/pools' } });
    }
  }, [navigate, token]);

  const handleAutoRefreshChange = (e) => {
    setAutoRefresh(e.target.value);
    localStorage.setItem('iframeAutoRefresh', e.target.value);
  };

  return isGrafanaReady ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginRight: '204px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <FormControl
          sx={{
            width: 120,
            marginBottom: 1,
          }}
          size="small"
        >
          <InputLabel id="auto-refresh-label">auto-refresh</InputLabel>
          <Select
            labelId="auto-refresh-label"
            id="auto-refresh-select"
            value={autoRefresh}
            label="auto-refresh"
            onChange={handleAutoRefreshChange}
          >
            {dashboardAutoRefresh.map((value, idx) => (
              <MenuItem value={value} key={idx}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <iframe
        title="grafana"
        src={`${process.env.REACT_APP_GRAFANA_URL}?auth_token=${token}&theme=${
          theme.palette.mode
        }&kiosk&refresh=${autoRefresh === 'off' ? '' : autoRefresh}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
      ></iframe>
    </Box>
  ) : isGrafanaReady === false ? (
    <Box sx={{ marginLeft: '262px', maxWidth: '732px', textAlign: 'center' }}>
      <Box
        sx={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Loader />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '36px',
            lineHeight: 1.2,
            marginBottom: '24px',
            maxWidth: '575px',
          }}
        >
          Please wait while you are provisioned on the back end.
        </Typography>
      </Box>
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: '24px',
          lineHeight: 1.5,
        }}
      >
        This can take up to 48 hours but usually will happen much sooner
      </Typography>
    </Box>
  ) : null;
};

export default Dashboard;

