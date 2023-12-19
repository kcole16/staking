import { Box, IconButton, TableCell, TableRow, TextField } from '@mui/material';
import React from 'react';
import TrashIcon from '../../../svg/trash';
import { useConfirm } from 'material-ui-confirm';

const KeyRow = ({
  keyObj,
  handleKeyDown,
  deleteKey,
  selectedKey,
  setSelectedKey,
}) => {
  const confirm = useConfirm();
  const { name, key: keyVal } = keyObj;

  return (
    <TableRow key={name} onClick={() => setSelectedKey(name)}>
      <TableCell
        align="center"
        sx={{
          padding: 0,
          height: '43px',
          width: '200px',
        }}
      >
        {name}
      </TableCell>
      <TableCell sx={{ wordBreak: 'break-all' }}>
        {selectedKey === name ? (
          <Box display="flex">
            <TextField
              multiline
              rows={7}
              type="text"
              margin="normal"
              fullWidth
              variant="standard"
              autoComplete="off"
              defaultValue={keyVal}
              onBlur={(e) => handleKeyDown(e, name)}
              onKeyDown={(e) => handleKeyDown(e, name)}
            />
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
                    'Are you sure you want to proceed with deleting the : ' +
                    name +
                    ' key?',
                })
                  .then(() => {
                    deleteKey(name);
                  })
                  .catch(() => {});
              }}
            >
              <TrashIcon />
            </IconButton>
          </Box>
        ) : (
          keyVal
        )}
      </TableCell>
    </TableRow>
  );
};

export default KeyRow;
