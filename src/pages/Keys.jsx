import { useTheme } from '@emotion/react';
import {
  Box,
  Button,
  Container,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useState } from 'react';
import ModalWrapper from '../ui/components/AuthModalWrapper';
import SnackbarAlert from '../ui/components/SnackbarAlert';
import KeyRow from '../ui/components/KeysPage/KeyRow';

const Keys = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newNameKey, setNewNameKey] = useState('');
  const [newKey, setNewKey] = useState('');
  const [helperTextName, setHelperTextName] = useState('');
  const [helperTextKey, setHelperTextKey] = useState('');
  const [keys, setKeys] = useState(
    JSON.parse(localStorage.getItem('keys') || '[]')
  );
  const [selectedKey, setSelectedKey] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');

  const theme = useTheme();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const isSSHPublicKey = (publicKey) => {
    const sshPublicKeyRegex =
      /^(?:ssh-rsa AAAAB3NzaC1yc2|ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNT|ecdsa-sha2-nistp384 AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzOD|ecdsa-sha2-nistp521 AAAAE2VjZHNhLXNoYTItbmlzdHA1MjEAAAAIbmlzdHA1Mj|ssh-ed25519 AAAAC3NzaC1lZDI1NTE5|ssh-dss AAAAB3NzaC1kc3)[0-9A-Za-z+/].*\n?$/;
    return sshPublicKeyRegex.test(publicKey);
  };

  const addKey = () => {
    if (!newNameKey) {
      setHelperTextName('This field is required');
    } else if (!newKey || !isSSHPublicKey(newKey)) {
      setHelperTextKey('Please enter a valid public key');
    } else if (keys.filter((element) => element.name === newNameKey)[0]) {
      setHelperTextName('Key with this name already exists');
    } else {
      keys.push({ name: newNameKey, key: newKey });
      localStorage.setItem('keys', JSON.stringify(keys));
      setKeys(keys);
      setNewKey('');
      setNewNameKey('');
      setIsOpen(false);
    }
  };

  const updateKey = (name, key) => {
    if (isSSHPublicKey(key)) {
      const updatedArray = keys.map((item) => {
        if (item.name === name) {
          return { ...item, key: key };
        }
        return item;
      });
      setKeys(updatedArray);
      localStorage.setItem('keys', JSON.stringify(updatedArray));
    } else {
      setWarningMsg('Public Key is invalid');
    }
  };

  const deleteKey = (name) => {
    const updatedArray = keys.filter(function (item) {
      return item.name !== name;
    });
    setKeys(updatedArray);
    localStorage.setItem('keys', JSON.stringify(updatedArray));

    const servers = JSON.parse(localStorage.getItem('servers') || '[]');
    const updatedServers = servers.filter(function (item) {
      if (item.key === name) item.key = '';
      return item;
    });
    localStorage.setItem('servers', JSON.stringify(updatedServers));
  };

  function handleKeyDown(event, name) {
    if (
      event.key === 'Enter' ||
      event.keyCode === 27 ||
      event.type === 'blur'
    ) {
      updateKey(name, event.target.value);
      setSelectedKey(false);
    }
  }

  const handleKeyNameChange = (e) => {
    setNewNameKey(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
    setHelperTextName('');
  };

  const handleKeyValueChange = (e) => {
    setNewKey(e.target.value);
    setHelperTextKey('');
  };

  return (
    <Container sx={{ marginLeft: { lg: '7.6%', md: '7%', xs: 'auto' } }}>
      <SnackbarAlert msg={warningMsg} setMsg={setWarningMsg} severity="error" />
      <ModalWrapper
        handleClose={handleClose}
        isOpen={isOpen}
        dialogProps={{
          PaperProps: {
            sx: {
              '@media (max-height:800px)': {
                top: '95px',
              },
            },
          },
        }}
      >
        <DialogContent>
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              marginBlock: '14px 1em',
              padding: '0',
              textAlign: 'center',
              lineHeight: {
                xl: '52px',
                lg: '48px',
                md: '44px',
                sm: '38px',
                xs: '32px',
              },
              fontSize: '32px',
            }}
          >
            Add Public key
          </DialogTitle>
          <TextField
            type="text"
            margin="normal"
            required
            fullWidth
            id="key"
            label="Key name"
            autoComplete="off"
            helperText={helperTextName}
            error={!!helperTextName}
            value={newNameKey}
            onChange={handleKeyNameChange}
          />
          <TextField
            type="text"
            margin="normal"
            required
            fullWidth
            id="key"
            label="Public key"
            autoComplete="off"
            helperText={helperTextKey}
            error={!!helperTextKey}
            value={newKey}
            onChange={handleKeyValueChange}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={addKey}
              variant="text"
              sx={{
                padding: '16px 32px',
                boxShadow: '0px 0px 8px rgb(0 33 71 / 10%)',
                color: 'text.primary',
                backgroundColor: 'primary.light',
                border: 'inherit',
                fontSize: '15px',
                margin: '16px 4px 16px 8px',
              }}
            >
              <img
                style={{ marginRight: '18px' }}
                src={'/icons/addsquare-' + theme.palette.mode + '.png'}
                alt="add"
              />
              Add Key
            </Button>
          </Box>
        </DialogContent>
      </ModalWrapper>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          component="h1"
          variant="h4"
          align="left"
          fontSize={48}
          lineHeight={1}
          sx={{ marginBottom: '8px' }}
        >
          Keys
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          onClick={handleOpen}
          variant="text"
          sx={{
            padding: '16px 32px',
            boxShadow: '0px 0px 8px rgb(0 33 71 / 10%)',
            color: 'text.primary',
            backgroundColor: 'primary.light',
            border: 'inherit',
            fontSize: '15px',
            margin: '16px 4px 16px 8px',
          }}
        >
          <img
            style={{ marginRight: '18px' }}
            src={'/icons/addsquare-' + theme.palette.mode + '.png'}
            alt="add"
          />
          Add Key
        </Button>
      </Box>
      <Table aria-label="Keys">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{ width: '200px', padding: '21px 29px 24px' }}
            >
              Name
            </TableCell>
            <TableCell>Public Key</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map((key) => (
            <KeyRow
              key={key.name}
              keyObj={key}
              handleKeyDown={handleKeyDown}
              deleteKey={deleteKey}
              selectedKey={selectedKey}
              setSelectedKey={setSelectedKey}
            />
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Keys;

