import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ModalWrapper from '../ui/components/AuthModalWrapper';
import { runPriceData } from '../constants';
import { getCustomThemeStyles } from '../ui/styles/theme';
import { useTheme } from '@emotion/react';
import { authService } from '../helpers/auth';
import { useNavigate } from 'react-router-dom';
import { nearConfig } from '../helpers/nearConfig';
import SnackbarAlert from '../ui/components/SnackbarAlert';
import RunOrderFormComponent from '../ui/components/OrderPage/RunOrderFormComponent';

const RunOrderPage = () => {
  const navigate = useNavigate();
  const [token, setNewToken] = useState(localStorage.getItem('TOKEN') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderSend, setIsOrderSend] = useState(false);
  const [statusOrder, setStatusOrder] = useState('');

  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const body = JSON.stringify({ server: 'RUN' });
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
        },
        body,
      };
      await fetch(`${nearConfig.backendUrl}order-server`, requestOptions)
        .then((response) => {
          if (response.status === 401) {
            setStatusOrder('Unauthorized');
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === 'success') {
            setStatusOrder(
              'Thank you for your order, someone from kuutamo will be contacting you shortly to arrange payment and organize on boarding'
            );
            setIsOrderSend(true);
          } else if (data.status === 'fail') {
            setStatusOrder(data.message);
          } else {
            setStatusOrder('Something went wrong...');
          }
        })
        .catch((error) => {
          console.log(error);
          setStatusOrder('Something went wrong...');
        });
      setIsSubmitting(false);
    } catch (e) {
      return e;
    }
  };
  useEffect(() => {
    if (token) {
      const timeRemaining = authService.getRemainingTime(token);
      const timeInMinutes = timeRemaining / 60;
      if (timeInMinutes > 0) {
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

  const handleBackClick = () => {
    navigate('/pools');
  };

  return (
    <Box sx={{ paddingTop: '40px' }}>
      <SnackbarAlert
        msg={statusOrder}
        setMsg={setStatusOrder}
        severity={isOrderSend ? 'success' : 'error'}
      />
      <ModalWrapper
        isOpen={true}
        handleClose={handleBackClick}
        dialogProps={{
          PaperProps: {
            sx: {
              marginTop: '120px',
              maxWidth: '888px',
              borderRadius: '20px',
              backgroundColor: 'primary.light',
              boxShadow:
                '0px 123px 49px rgba(0, 33, 71, 0.01), 0px 69px 41px rgba(0, 33, 71, 0.03), 0px 31px 31px rgba(0, 33, 71, 0.04), 0px 8px 17px rgba(0, 33, 71, 0.05), 0px 0px 0px rgba(0, 33, 71, 0.05)',
            },
          },
        }}
      >
        <Box sx={{ padding: '50px 156px 80px' }}>
          <Box
            sx={{
              '& > div:first-of-type .padding__box': {
                paddingLeft: 0,
              },
              '& > div:last-of-type .padding__box': {
                paddingRight: 0,
              },
            }}
          >
            {runPriceData.map((data) => (
              <RunOrderFormComponent
                containerProps={{
                  sx: {
                    width: '100%',
                    borderRight: 1,
                    borderColor: customTheme.colors.primary,

                    '&:last-of-type': {
                      border: 0,
                    },
                  },
                }}
                data={data}
                key={data.id}
              />
            ))}
          </Box>
          <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
            <Button
              disabled={isSubmitting || isOrderSend}
              variant="contained"
              sx={{
                borderRadius: '10px',
                backgroundColor: 'primary.main',
                padding: '16px 55px',
                fontSize: '15px',
                lineHeight: 1,
                fontWeight: '400',
              }}
              onClick={handleSubmit}
            >
              ORDER
            </Button>
          </Box>
        </Box>
      </ModalWrapper>
    </Box>
  );
};

export default RunOrderPage;

