import { TableCell, TableRow } from '@mui/material';
import React from 'react';

const RewardsLineRow = ({ dataEl, ordinaryData, page, rowsPerPage, index }) => {
  return (
    <TableRow>
      <TableCell>{dataEl.pool}</TableCell>
      <TableCell>
        {
          (rowsPerPage > 0
            ? ordinaryData.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : ordinaryData)[index].y
        }
      </TableCell>
      <TableCell>{dataEl.y}</TableCell>
      <TableCell>{dataEl.x}</TableCell>
    </TableRow>
  );
};

export default RewardsLineRow;
