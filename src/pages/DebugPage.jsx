import { Box } from '@mui/material';
import React from 'react';

const DebugPage = () => {
  return (
    <Box sx={{ width: 1, marginRight: '204px' }}>
      <iframe
        title="debug"
        src="http://localhost:3030/debug"
        width="100%"
        height="100%"
        style={{ border: 0 }}
      ></iframe>
    </Box>
  );
};

export default DebugPage;
