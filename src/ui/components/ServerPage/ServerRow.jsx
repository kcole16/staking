import {
  IconButton,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  TextField,
  useTheme,
} from '@mui/material';
import React from 'react';
import TrashIcon from '../../../svg/trash';
import { useConfirm } from 'material-ui-confirm';

const ServerRow = ({
  server,
  selectedServer,
  updateServer,
  setSelectedServer,
  handleKeyDown,
  deleteServer,
}) => {
  const confirm = useConfirm();
  const theme = useTheme();
  const handleBlur = () => setSelectedServer(false);
  const keys = JSON.parse(localStorage.getItem('keys') || '[]');

  return selectedServer === server.id ? (
    <TableRow>
      <TableCell>{server.id}</TableCell>
      <TableCell>{server.Type}</TableCell>
      <TableCell>
        <TextField
          fullWidth
          variant="standard"
          autoComplete="off"
          value={server.IPv4}
          onBlur={handleBlur}
          onChange={(e) => updateServer(server.id, e.target.value, 'IPv4')}
          onKeyDown={handleKeyDown}
        />
      </TableCell>
      <TableCell>
        <TextField
          fullWidth
          variant="standard"
          autoComplete="off"
          value={server.Gateway}
          onBlur={() => setSelectedServer(false)}
          onChange={(e) => updateServer(server.id, e.target.value, 'Gateway')}
          onKeyDown={handleKeyDown}
        />
      </TableCell>
      <TableCell>
        <TextField
          fullWidth
          variant="standard"
          autoComplete="off"
          value={server.Username}
          onBlur={() => setSelectedServer(false)}
          onChange={(e) => updateServer(server.id, e.target.value, 'Username')}
          onKeyDown={handleKeyDown}
        />
      </TableCell>
      <TableCell>
        <Select
          labelId="key-select-label"
          id={'key-select' + server.id}
          value={server.key}
          onChange={(e) => {
            updateServer(server.id, e.target.value, 'key');
            setSelectedServer(false);
          }}
          MenuProps={{
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
          }}
        >
          <MenuItem value="">---</MenuItem>
          {keys.map((k) => (
            <MenuItem value={k.name} key={k.name}>
              {k.name}
            </MenuItem>
          ))}
        </Select>
        <IconButton
          color="inherit"
          sx={{
            margin: '8px',
            width: '32px',
            height: '32px',
            color: 'primary.main',
          }}
          onClick={() => {
            confirm({
              confirmationText: 'Delete',
              description:
                'Are you sure you want to proceed with deleting the ID: ' +
                server.id +
                ' server?',
            })
              .then(() => {
                deleteServer(server.id);
              })
              .catch(() => {});
          }}
        >
          <TrashIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ) : (
    <TableRow key={server.id} onClick={() => setSelectedServer(server.id)}>
      <TableCell>{server.id}</TableCell>
      <TableCell>{server.Type}</TableCell>
      <TableCell>{server.IPv4}</TableCell>
      <TableCell>{server.Gateway}</TableCell>
      <TableCell>{server.Username}</TableCell>
      <TableCell>{server.key}</TableCell>
    </TableRow>
  );
};

export default ServerRow;
