import React, { useState } from 'react';
import ChooseDialog from '../ui/components/ChooseDialog';
import { Snackbar, useTheme } from '@mui/material';
import { getCustomThemeStyles } from '../ui/styles/theme';
import CopyWithGivenColors from '../svg/copyWithGivenColors';
import CopySuccessIcon from '../svg/copySuccess';
import { Link, useNavigate } from 'react-router-dom';

const RunModalPage = () => {
  const [open, setOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const customTheme = getCustomThemeStyles(theme.palette.mode === 'dark');

  const className = 'follow';

  const frontColor =
    className === 'follow' ? '#002147' : theme.palette.text.primary;
  const backColor = theme.palette.primary.main;

  const handleClose = () => navigate('/pools');

  const handleRunClick = () => {
    setIsCopied(true);

    setOpen(true);
    navigator.clipboard.writeText('kneard-mgr proxy');
  };

  const handleSnackBarClose = () => {
    setIsCopied(false);
    setOpen(false);
  };

  const data = [
    {
      id: 1,
      onClick: handleRunClick,
      className,
      title: 'Step 1',
      text: 'Run',
      containerProps: {
        sx: {
          marginInline: '13%',
          marginBottom: '24px',
        },
      },
      icon: isCopied ? (
        <CopySuccessIcon frontColor={backColor} backColor={frontColor} />
      ) : (
        <CopyWithGivenColors backColor={backColor} frontColor={frontColor} />
      ),
    },
  ];

  return (
    <>
      <ChooseDialog
        title="Follow the steps"
        isOpen={true}
        data={data}
        handleClose={handleClose}
        submitButtonText="CONTINUE"
        buttonComponent={Link}
        buttonLink="/debug"
        dialogProps={{
          sx: {
            '& .MuiPaper-root': {
              boxShadow: customTheme.shadows.modal,
            },

            '& .MuiBackdrop-root': {
              backgroundColor: 'inherit',
            },
          },
        }}
      />
      <Snackbar
        message="Copied to clibboard"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        open={open}
      />
    </>
  );
};

export default RunModalPage;

