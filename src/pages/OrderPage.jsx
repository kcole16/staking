import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PriceModalWrapper from '../ui/components/PriceModalWrapper';
import {
  additionalServices,
  orderdServerInitialValues,
  priceData,
} from '../constants';
import OrderFormComponent from '../ui/components/OrderPage/OrderFormComponent';
import { getCustomThemeStyles } from '../ui/styles/theme';
import { useTheme } from '@emotion/react';
import OrderAdditionalSwitch from '../ui/components/OrderPage/OrderAdditionalSwitch';
import { authService } from '../helpers/auth';
import { useNavigate } from 'react-router-dom';
import { nearConfig } from '../helpers/nearConfig';
import SnackbarAlert from '../ui/components/SnackbarAlert';

const OrderPage = () => {
  const navigate = useNavigate();
  const [isOrderSend, setIsOrderSend] = useState(false);
  const [statusOrder, setStatusOrder] = useState('');
  const [token, setNewToken] = useState(localStorage.getItem('TOKEN') || '');
  const [formData, setFormData] = useState(orderdServerInitialValues);
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  const handleSubmit = async () => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
        },
        body: JSON.stringify(formData),
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

  return (
    <Box sx={{ paddingTop: '40px' }}>
      <SnackbarAlert
        msg={statusOrder}
        setMsg={setStatusOrder}
        severity={isOrderSend ? 'success' : 'error'}
      />
      <PriceModalWrapper
        isOpen={true}
        contentProps={{
          sx: {
            padding: '80px 156px',
          },
        }}
        dialogProps={{
          PaperProps: {
            sx: {
              marginTop: '120px',
              maxWidth: '1356px',
              borderRadius: '20px',
              backgroundColor: 'primary.light',
              boxShadow:
                '0px 123px 49px rgba(0, 33, 71, 0.01), 0px 69px 41px rgba(0, 33, 71, 0.03), 0px 31px 31px rgba(0, 33, 71, 0.04), 0px 8px 17px rgba(0, 33, 71, 0.05), 0px 0px 0px rgba(0, 33, 71, 0.05)',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            borderBottom: 1,
            borderColor: customTheme.colors.primary,
            flexWrap: 'wrap',
            '& > div:first-of-type .padding__box': {
              paddingLeft: 0,
            },
            '& > div:last-of-type .padding__box': {
              paddingRight: 0,
            },
          }}
        >
          {priceData.map((data) => (
            <OrderFormComponent
              data={data}
              key={data.id}
              formData={formData}
              setFormData={setFormData}
            />
          ))}
        </Box>
        {additionalServices &&
          additionalServices.map((service, idx) => (
            <OrderAdditionalSwitch
              service={service}
              key={idx}
              formData={formData}
              setFormData={setFormData}
            />
          ))}
        <Box sx={{ marginTop: '32px', textAlign: 'center' }}>
          {isOrderSend ? (
            <Button
              variant="contained"
              sx={{
                borderRadius: '10px',
                backgroundColor: 'primary.main',
                padding: '16px 55px',
                fontSize: '15px',
                lineHeight: 1,
                fontWeight: '400',
              }}
              onClick={() => navigate('/servers')}
            >
              CLOSE
            </Button>
          ) : (
            <Button
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
          )}
        </Box>
      </PriceModalWrapper>
    </Box>
  );
};

export default OrderPage;

