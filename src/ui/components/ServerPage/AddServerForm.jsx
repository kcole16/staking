import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { Field, Form, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import SelectArrow from '../../../svg/Arrows/selectArrow';
import ArrowLeftIcon from '../../../svg/arrow-left';
import MuiTextField from '../MuiTextFieldFormik';
import { getCustomThemeStyles } from '../../styles/theme';
import { MuiStyledSelect, StyledMenuItem } from '../StyledSelect';
import { Link } from 'react-router-dom';
import DependentIPField from '../DependentIPField';
import DependentDiskField from '../DependentDiskField';
import { ServerButton } from './ServerButton';
import { getTypeItems } from '../../../constants';
import LatitudeLogo from '../../../svg/latitudeLogo';
import OvhLogo from '../../../svg/ovhLogo';

const AddServerForm = () => {
  const [typeItems, setTypeItems] = useState([]);
  const theme = useTheme();
  const { values, errors, handleChange, resetForm, setFieldValue } =
    useFormikContext();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  const handleProviderChange = (e) => {
    if (e.target && e.target.value) {
      const key = values.key;
      const server = values.server;
      resetForm();
      setFieldValue('server.id', server.id);
      setFieldValue('key.value', key.value);
      setFieldValue('key.name', key.name);
      handleChange(e);
    }
  };

  useEffect(() => {
    if (values.server.Provider) {
      setTypeItems(getTypeItems(values.server.Provider));
    }
  }, [values.server.Provider]);

  const selectProps = {
    displayEmpty: true,
    disableUnderline: true,
    IconComponent: (props) => <SelectArrow {...props} />,
    sx: {
      fontFamily: customTheme.font.roboto,
      fontSize: '18px',
    },
    MenuProps: {
      PaperProps: {
        sx: {
          padding: '0',
          borderRadius: '10px',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0px 0px 8px rgba(7, 9, 14, 0.1);'
              : '0px 0px 8px rgb(0 33 71 / 10%)',
          backgroundColor: 'primary.light',
          backgroundImage: 'none',
          border: 1,
          borderColor: 'primary.dark',
        },
      },
    },
  };

  const buttonStyles = {
    padding: '16px 32px',
    boxShadow: '0px 0px 8px rgb(0 33 71 / 10%)',
    color: 'text.primary',
    backgroundColor: 'primary.light',
    border: 'inherit',
    fontSize: '15px',
    margin: '16px 4px 16px 8px',
  };

  const helperTextStyles = {
    sx: {
      fontWeight: '400',
      fontFamily: customTheme.font.roboto,
      fontSize: '14px',
      position: 'absolute',
      bottom: '-25px',
    },
  };

  const keyFieldStyles = {
    marginBottom: 0,
    height: '68px',
    border: 1,
    borderColor: 'primary.main',
    borderRadius: '10px',
    transition: '0.3s',

    '& .MuiInputBase-root': {
      minHeight: '100%',
    },
    '& fieldset': { border: '0' },

    '&:has( input:focus, input:hover)': {
      boxShadow: customTheme.shadows.main,
    },
  };

  return (
    <Box
      component={Form}
      sx={{
        padding: '64px',
        maxWidth: '1356px',
        boxShadow: customTheme.shadows.modal,
        borderRadius: '20px',
      }}
    >
      <Typography
        sx={{
          fontFamily: customTheme.font.roboto,
          fontSize: '24px',
          lineHeight: 1,
          color: 'text.primary',
        }}
      >
        Add SSH Public Key:
      </Typography>
      <Box sx={{ display: 'flex', columnGap: '16px' }}>
        <Field
          component={MuiTextField}
          name="key.name"
          fontSize="20px"
          type="text"
          margin="normal"
          placeholder="Key Name"
          autoComplete="off"
          inputProps={{
            style: { fontSize: 20 },
          }}
          InputLabelProps={{ style: { fontSize: 20 } }}
          FormHelperTextProps={helperTextStyles}
          error={errors['key'] && !!errors['key'].name}
          helperText={errors['key'] && errors['key'].name}
          sx={{ flex: '0.05 1 auto', ...keyFieldStyles }}
        />
        <Field
          component={MuiTextField}
          name="key.value"
          type="text"
          margin="normal"
          autoComplete="off"
          FormHelperTextProps={helperTextStyles}
          error={errors['key'] && !!errors['key'].value}
          helperText={errors['key'] && errors['key'].value}
          placeholder="Public Key"
          inputProps={{ style: { fontSize: 20 } }}
          InputLabelProps={{ style: { fontSize: 20 } }}
          sx={{ flex: '1 1 auto', ...keyFieldStyles }}
        />
      </Box>
      <Box textAlign="center" marginTop="32px">
        <Typography
          sx={{
            fontSize: '32px',
            lineHeight: 1,
            marginBottom: '40px',
            fontWeight: 500,
          }}
        >
          Get a server, install Ubuntu, ensure this key has root access
        </Typography>
        <Typography sx={{ fontSize: '18px', lineHeight: 1 }}>
          Validated provider guides
        </Typography>
        <Box
          sx={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'center',
            columnGap: '32px',
          }}
        >
          <ServerButton
            component={Link}
            to="https://www.latitude.sh/dashboard"
            variant="outlined"
            target="_blank"
          >
            <Box sx={{ color: 'text.primary', width: '152px', height: '28px' }}>
              <LatitudeLogo />
            </Box>
          </ServerButton>
          <ServerButton
            component={Link}
            to="https://www.ovhcloud.com/en-gb/bare-metal/advance/adv-1/"
            variant="outlined"
            target="_blank"
          >
            <Box
              sx={{
                color: customTheme.colors.ovhLogo,
                width: '152px',
                height: '24px',
              }}
            >
              <OvhLogo />
            </Box>
          </ServerButton>
        </Box>
      </Box>
      <Table aria-label="Servers" sx={{ marginTop: '40px' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderTopLeftRadius: '10px' }} align="center">
              ID
            </TableCell>
            <TableCell align="center">Provider</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">IPv4</TableCell>
            <TableCell align="center">CIDR</TableCell>
            <TableCell align="center">Gateway</TableCell>
            <TableCell align="center">Admin Username</TableCell>
            <TableCell align="center">№ of disks</TableCell>
            <TableCell align="center" sx={{ borderTopRightRadius: '10px' }}>
              SSH Key
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center">
              <Field
                component={MuiTextField}
                name="server.id"
                type="text"
                FormHelperTextProps={helperTextStyles}
                error={errors['server'] && !!errors['server'].id}
                helperText={errors['server'] && errors['server'].id}
                variant="standard"
                margin="normal"
                id="key"
                autoComplete="off"
              />
            </TableCell>
            <TableCell align="center">
              <Field
                component={MuiStyledSelect}
                name="server.Provider"
                variant="standard"
                id="provider-select"
                FormHelperTextProps={helperTextStyles}
                error={errors['server'] && !!errors['server'].Provider}
                helperText={errors['server'] && errors['server'].Provider}
                onChange={handleProviderChange}
                select
                SelectProps={selectProps}
              >
                <StyledMenuItem disabled value="">
                  Select
                </StyledMenuItem>
                <StyledMenuItem value="OVH">OVH</StyledMenuItem>
                <StyledMenuItem value="Latitude">Latitude</StyledMenuItem>
                <StyledMenuItem value="kuutamo">kuutamo</StyledMenuItem>
                <StyledMenuItem value="Other">Other</StyledMenuItem>
              </Field>
            </TableCell>
            <TableCell align="center">
              <Field
                component={MuiStyledSelect}
                variant="standard"
                id="type-select"
                name="server.Type"
                FormHelperTextProps={helperTextStyles}
                error={errors['server'] && !!errors['server'].Type}
                helperText={errors['server'] && errors['server'].Type}
                select
                SelectProps={selectProps}
              >
                <StyledMenuItem disabled value="">
                  Select
                </StyledMenuItem>
                {typeItems.map((el) => (
                  <StyledMenuItem key={el.id} {...el}>
                    {el.value}
                  </StyledMenuItem>
                ))}
              </Field>
            </TableCell>
            <TableCell align="center">
              <Field
                component={MuiTextField}
                type="text"
                name="server.IPv4"
                variant="standard"
                margin="normal"
                id="IPv4"
                autoComplete="off"
                FormHelperTextProps={helperTextStyles}
                error={errors['server'] && !!errors['server'].IPv4}
                helperText={errors['server'] && errors['server'].IPv4}
              />
            </TableCell>
            <TableCell align="center">
              <Field
                component={MuiTextField}
                type="number"
                name="server.CIDR"
                disabled={
                  values.server.Provider === 'OVH' ||
                  values.server.Provider === 'Latitude'
                }
                FormHelperTextProps={helperTextStyles}
                inputProps={{
                  min: 0,
                }}
                error={errors['server'] && !!errors['server'].CIDR}
                helperText={errors['server'] && errors['server'].CIDR}
                variant="standard"
                margin="normal"
                id="CIDR"
                autoComplete="off"
              />
            </TableCell>
            <TableCell align="center">
              <DependentIPField
                name="server.Gateway"
                disabled={
                  (values.server.Provider === 'OVH' ||
                    values.server.Provider === 'Latitude') &&
                  (!errors || !errors.server || !errors.server.IPv4)
                }
                FormHelperTextProps={helperTextStyles}
                error={errors['server'] && !!errors['server'].Gateway}
                helperText={errors['server'] && errors['server'].Gateway}
                type="text"
                variant="standard"
                margin="normal"
                id="Gateway"
                autoComplete="off"
              />
            </TableCell>
            <TableCell align="center">
              <Field
                component={MuiTextField}
                name="server.Username"
                type="text"
                variant="standard"
                margin="normal"
                id="Username"
                autoComplete="off"
                FormHelperTextProps={helperTextStyles}
                error={errors['server'] && !!errors['server'].Username}
                helperText={errors['server'] && errors['server'].Username}
              />
            </TableCell>
            <TableCell align="center">
              <DependentDiskField
                name="server.disks"
                variant="standard"
                id="disks-select"
                select
                disabled={
                  !!values.server.Provider &&
                  values.server.Type !== 'Other' &&
                  values.server.Type !== '-'
                }
                FormHelperTextProps={helperTextStyles}
                error={errors['server'] && !!errors['server'].disks}
                helperText={errors['server'] && errors['server'].disks}
                SelectProps={selectProps}
              >
                <StyledMenuItem disabled value="">
                  Select
                </StyledMenuItem>
                <StyledMenuItem value="1">1</StyledMenuItem>
                <StyledMenuItem value="2">2</StyledMenuItem>
              </DependentDiskField>
            </TableCell>
            <TableCell
              align="center"
              sx={{
                overflow: 'hidden',
                maxWidth: '180px',
                textOverflow: 'ellipsis',
              }}
            >
              {values.key.name}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="text" component={Link} to="/servers" sx={buttonStyles}>
          <Box
            width={24}
            height={24}
            color="primary.main"
            sx={{ marginRight: '16px' }}
          >
            <ArrowLeftIcon />
          </Box>
          Back
        </Button>
        <Button type="submit" variant="text" sx={buttonStyles}>
          <img
            style={{ marginRight: '18px' }}
            src={'/icons/addsquare-' + theme.palette.mode + '.png'}
            alt="add"
          />
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default AddServerForm;

