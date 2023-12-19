import { useTheme } from '@emotion/react';
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { serversDialogData } from '../constants';
import ChooseDialog from '../ui/components/ChooseDialog';
import AddServerModal from '../ui/components/ServerPage/AddServerModal';
import ServerRow from '../ui/components/ServerPage/ServerRow';

const Servers = () => {
  const [isServerOpen, setIsServerOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const [servers, setServers] = useState(
    JSON.parse(localStorage.getItem('servers') || '[]')
  );
  const [selectedServer, setSelectedServer] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const updateServer = (id, value, field) => {
    const updatedArray = servers.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setServers(updatedArray);
    localStorage.setItem('servers', JSON.stringify(updatedArray));
  };

  const deleteServer = (id) => {
    const updatedArray = servers.filter(function (item) {
      return item.id !== id;
    });
    setServers(updatedArray);
    localStorage.setItem('servers', JSON.stringify(updatedArray));
    const mountedPools = JSON.parse(
      localStorage.getItem('mountedPools') || '{}'
    );
    const keysToDelete = Object.keys(mountedPools).filter(
      (key) => mountedPools[key] === id
    );
    keysToDelete.forEach((key) => delete mountedPools[key]);
    localStorage.setItem('mountedPools', JSON.stringify(mountedPools));
  };

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.keyCode === 27) setSelectedServer(false);
  }

  const handleOwnServerClick = () => {
    setIsOpen(false);
    setIsServerOpen(true);
  };

  const handleServerClose = () => {
    setIsServerOpen(false);
  };

  return (
    <Container sx={{ marginLeft: { lg: '7.6%', md: '7%', xs: 'auto' } }}>
      <ChooseDialog
        title="Select an option"
        isOpen={isOpen}
        handleClose={handleClose}
        data={serversDialogData(handleOwnServerClick)}
        buttonText="back"
        dialogProps={{
          PaperProps: {
            sx: {
              '@media (max-height:800px)': {
                top: '95px',
              },
            },
          },
        }}
      />
      <AddServerModal isOpen={isServerOpen} handleClose={handleServerClose} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          component="h1"
          variant="h4"
          align="left"
          fontSize={48}
          lineHeight={1}
          sx={{ marginBottom: '8px' }}
        >
          Servers
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
          Add server
        </Button>
      </Box>
      <Table aria-label="Servers">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>IPv4</TableCell>
            <TableCell>Gateway</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>SSH Key</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {servers.map((server) => (
            <ServerRow
              key={server.id}
              server={server}
              selectedServer={selectedServer}
              setSelectedServer={setSelectedServer}
              updateServer={updateServer}
              handleKeyDown={handleKeyDown}
              deleteServer={deleteServer}
            />
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Servers;

