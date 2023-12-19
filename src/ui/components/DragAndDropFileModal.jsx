import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import ArrowLeftIcon from '../../svg/arrow-left';

const DragAndDropFileModal = ({
  isOpen,
  handleClose,
  handleSubmit,
  onDragOver,
  onDragLeave,
  onDrop,
  dragOver,
  file,
  fileSelect,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: isOpen ? 'block' : 'none',
        width: '100%',
        height: '100%',
        position: 'absolute',
      }}
    >
      <Box
        sx={{
          borderRadius: '10px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '576px',
          bgcolor: 'background.paper',
        }}
      >
        <Button
          sx={{
            color: 'text.primary',
            textTransform: 'none',
            width: 'fit-content',
            margin: '18px 0 0 18px',
            fontSize: '16px',
          }}
          onClick={handleClose}
        >
          <Box
            sx={{
              width: '28px',
              height: '28px',
              [theme.breakpoints.down('xl')]: {
                width: '24px',
                height: '24px',
              },

              marginRight: '11.5px',
              color: 'primary.main',
            }}
          >
            <ArrowLeftIcon />
          </Box>
          back
        </Button>
        <Box sx={{ padding: '30px 40px' }}>
          <label
            htmlFor="file"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            style={{
              border: `${
                dragOver ? '3px dashed yellowgreen' : '3px black dashed'
              }`,
              width: '100%',
              padding: '3em 1.78em',
              display: 'inline-block',
              cursor: 'pointer',
            }}
          >
            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'text.primary',
                textAlign: 'center',
              }}
              component="h1"
            >
              {file
                ? file.name
                : !dragOver
                ? 'Select Or Drop your File here...'
                : 'Drop here...'}
            </Typography>
          </label>
          <input
            hidden
            type="file"
            name="file"
            id="file"
            onChange={fileSelect}
          />
          <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              type="button"
              onClick={handleSubmit}
              variant="contained"
              sx={{
                padding: '16px 32px',
                fontSize: '15px',
                lineHeight: 1,
                fontWeight: '400',

                '&:hover': {
                  backgroundColor: 'primary.main',
                },
              }}
            >
              CONTINUE
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DragAndDropFileModal;
